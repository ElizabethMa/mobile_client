var jtoJHandle = {
    takePictures : function(str, picType, cookie){
         var cameraSuccess = function(imageData){
             console.log('cameraSuccess result : ' + imageData);
             uploadPictures(imageData,picType);
         }

         var cameraError = function(message){
             console.log('cameraError by : ' + message);
         }

         var cameraOptions = {
             quality: 50,
             destinationType: Camera.DestinationType.DATA_URL
         }

         navigator.camera.getPicture(cameraSuccess, cameraError, cameraOptions);
     },
};

// param = takePictures("parsePicUrl_collect",picType,APP_collect.cookie);


