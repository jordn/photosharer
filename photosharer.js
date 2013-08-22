Photos = new Meteor.Collection('photos');
Timeline = new Meteor.Collection('timeline')

if (Meteor.isClient) {
  Session.set("widgetSet", false);
  var key = "A8AiITlRQgy5paB0vuHf2z";

  Template.app.rendered = function ( ) { 
    if (!Session.get("widgetSet")) {  
      loadPicker(key);
    }
  };

  Template.app.events({
    'click button' : function () {
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
      filepicker.pickAndStore({
          mimetypes: ['image/*'],
          services:['COMPUTER', 'FACEBOOK', 'IMAGE_SEARCH', 'INSTAGRAM', 'URL', 'WEBCAM'],
        },{
          location:"S3"
        },
        function(InkBlob){
          console.log(JSON.stringify(InkBlob));
          window.inkblob = InkBlob;
          var photoId = savePhoto(InkBlob[0].url);
          addPhotoToTimeline(Meteor.userId(), photoId, true);

        },
        function(FPError){
          console.log(FPError.toString());
        }
      );
    }
  });

  Template.photos.photos = function () {
    if (Meteor.user()) {
      console.log('rendering photos');
      var userId = Meteor.userId();
      timeline = Timeline.findOne({userId: userId});
      photos = timeline.photos;
      display = []
      for (var i = photos.length - 1; i >= 0; i--) {
        photoId = photos[i].photoId;
        photo = Photos.findOne({_id: photoId});
        display.push({url: photo.url});
      };
      console.log(display);
      return display;
    }

  }


  function savePhoto (url) {
    if (Meteor.user()) {
      console.log('saving' + url)
      var userId = Meteor.userId();
      var date_taken = Date.now();
      var votes = 0;
      Photos.insert({userId: userId, url: url, date_taken: date_taken, votes: votes});
      photoId = Photos.findOne({userId: userId, url: url, date_taken: date_taken, votes: votes})._id;
      return photoId;
    }
 }

  function addPhotoToTimeline(userId, photoId, took) {
    if (Meteor.user()) {

      console.log('saving to timeline')
      if (Timeline.findOne({userId: userId})) {
        timeline = Timeline.findOne({userId: userId});
      } else {
        Timeline.insert({userId: userId, photos:[]});
        timeline = Timeline.findOne({userId: userId});
      }
      var date_received = Date.now();
      var vote = ""
      photos = timeline.photos;
      photos.push({photoId: photoId, date_received: date_received, vote: vote});
      Timeline.update({_id: timeline._id}, {userId: userId, photos: photos});
      return true;
    }
  }

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
