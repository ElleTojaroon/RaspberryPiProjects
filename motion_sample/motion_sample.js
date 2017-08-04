'use strict';
var PiMotion = require('node-pi-motion');
 
var options = {
  verbose: true,
  throttle: 200,
  sensitivity: 800
}
 
var nodePiMotion = new PiMotion(options);

var clientFromConnectionString = require('azure-iot-device-mqtt').clientFromConnectionString;
var Message = require('azure-iot-device').Message;
var connectionString = 'HostName=IotHubC2D.azure-devices.net;DeviceId=motionSensor;SharedAccessKey=5ne8tCMyfUh40iIPvd4qMCODJKibPyM0DwFpIxm+nT0=';
var client = clientFromConnectionString(connectionString);

function printResultFor(op) {
    return function printResult(err, res) {
        if (err) console.log(op + ' error: ' + err.toString());
        if (res) console.log(op + ' status: ' + res.constructor.name);
    };
}


function onTakePic() {
    console.log("taking a picture!");

    raspistill.takePhoto()
        .then((photo) => {
            console.log('took first photo');
        })
        .catch((error) => {
            console.error('something bad happened', error);
        });

    console.log("after took a picture!");
}

function sendToFunction() {
    var messageString = 'takePic';
    var receiverDeviceId = 'takePicture';
    var fontColor = "\x1b[31m"; // red -urgent

    var data = JSON.stringify({ DeviceId: receiverDeviceId, MessageId: Date.now(), Message: messageString });
    var message = new Message(data);
    message.properties.add('isTakingPicture', true);

    console.log("Sending message: " + fontColor, message.getData(), "\x1b[0m");
    client.sendEvent(message, printResultFor('send'));
}

var connectCallback = function (err) {
    if (err) {
        console.log('Could not connect: ' + err);
    } else {
        console.log('Client connected');
        nodePiMotion.on('DetectedMotion', function() {
          console.log('Motion detected!');
          onTakePic();
          sendToFunction();
        });
    }
};

client.open(connectCallback);
