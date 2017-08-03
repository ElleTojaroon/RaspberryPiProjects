var raspivid = require('raspivid');
var fs = require('fs');
 
var file = fs.createWriteStream(__dirname + '/video.h264');
var video = raspivid();
 
video.pipe(file);

'use strict';

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

var connectCallback = function (err) {
    if (err) {
        console.log('Could not connect: ' + err);
    } else {
        console.log('Client connected');

        // Create a message and send it to the IoT Hub every second
        setInterval(function () {
            var isDirectMethod = false;
            var isSBQueue = false;
            var isSBTopic = false;
            var messageString;
            var fontColor;
            var receiverDeviceId;

            if (forAllDirectMethods || (!forAnyAll && forSomeDirectMethod && count % 5 == 0)) {
                isDirectMethod = true;
                messageString = 'writeLine';
                receiverDeviceId = 'receiverAlice';
                fontColor = "\x1b[31m"; // red -urgent
            } else if (forAllSBQueue || (!forAnyAll && forSomeSBQueue && count % 3 == 0)) {
                isSBQueue = true;
                messageString = 'writeLine';
                receiverDeviceId = 'receiverAlice';
                fontColor = "\x1b[32m"; // green
            } else if (forAllSBTopic || (!forAnyAll && forSomeSBTopic && count % 7 == 0)) {
                isSBTopic = true;
                messageString = 'writeLine';
                receiverDeviceId = 'receiverAlice';
                fontColor = "\x1b[36m"; // cyan
            } else if (forAllTelemetry || (!forAnyAll && forSomeTelemetry)) { // isAllTelemetry
                messageString = "telemetry data point";
                receiverDeviceId = 'receiverBob'; // used to be receiverBob
                fontColor = "\x1b[33m%s\x1b[0m:"; // yellow -telemetry
            }

            var data = JSON.stringify({ DeviceId: receiverDeviceId, MessageId: Date.now(), Message: messageString });
            var message = new Message(data);
            message.properties.add('isDirectMethod', isDirectMethod);
            message.properties.add('isSBQueue', isSBQueue);
            message.properties.add('isSBTopic', isSBTopic);

            console.log("Sending message: " + fontColor, message.getData(), "\x1b[0m");
            client.sendEvent(message, printResultFor('send'));
            count += 1;
        }, 5000);
    }
};

client.open(connectCallback);