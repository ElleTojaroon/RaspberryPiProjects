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
var count = 0;

function printResultFor(op) {
    return function printResult(err, res) {
        if (err) console.log(op + ' error: ' + err.toString());
        if (res) console.log(op + ' status: ' + res.constructor.name);
    };
}

function sendToFunction() {
    var isDirectMethod = false;
    var messageString;
    var fontColor;
    var receiverDeviceId;

    if (count % 5 == 0) {
        isDirectMethod = true;
        messageString = 'writeLine';
        receiverDeviceId = 'receiverAlice';
        fontColor = "\x1b[31m"; // red -urgent
    } else {
        messageString = "telemetry data point";
        receiverDeviceId = 'receiverBob'; // used to be receiverBob
        fontColor = "\x1b[33m%s\x1b[0m:"; // yellow -telemetry
    }

    var data = JSON.stringify({ DeviceId: receiverDeviceId, MessageId: Date.now(), Message: messageString });
    var message = new Message(data);
    message.properties.add('isDirectMethod', isDirectMethod);

    console.log("Sending message: " + fontColor, message.getData(), "\x1b[0m");
    client.sendEvent(message, printResultFor('send'));
    count += 1;
}

var connectCallback = function (err) {
    if (err) {
        console.log('Could not connect: ' + err);
    } else {
        console.log('Client connected');
        nodePiMotion.on('DetectedMotion', function() {
          console.log('Motion detected! Now do something.');
          sendToFunction();
        });
    }
};

client.open(connectCallback);