if (Meteor.isClient) {
  Session.set("widgetSet", false);
  var key = "A8AiITlRQgy5paB0vuHf2z";

  Template.hello.rendered = function ( ) { 
    if (!Session.get("widgetSet")) {  
      loadPicker(key);
    }
  };

  Template.hello.events({
    'click button' : function () {
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
      filepicker.pick({
        mimetypes: ['image/*'],
         container: 'modal',
        services:['COMPUTER', 'FACEBOOK', 'DROPBOX', 'IMAGE_SEARCH', 'INSTAGRAM', 'URL', 'WEBCAM'],
        },
        function(InkBlob){
          console.log(JSON.stringify(InkBlob));
        },
        function(FPError){
          console.log(FPError.toString());
        }
      );
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
