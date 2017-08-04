'use strict';
const Raspistill = require('node-raspistill').Raspistill;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const raspistill = new Raspistill({
    width: 640,
    height: 480,
    verticalFlip: true,
    horizontalFlip: true,
    outputDir: '/home/pi/Desktop'
});

var Mqtt = require('azure-iot-device-mqtt').Mqtt;
var DeviceClient = require('azure-iot-device').Client;

var connectionString = 'HostName=IotHubC2D.azure-devices.net;DeviceId=takePicture;SharedAccessKey=cgGlLd0xzl7Nza7/563E/Lb4avczu7imLO/Dy2axR6s=';
var client = DeviceClient.fromConnectionString(connectionString, Mqtt);

function onTakePic() {
    raspistill.takePhoto()
        .then((photo) => {
            console.log('took first photo');
            raspistill.stop();
        })
        .catch((error) => {
            console.error('something bad happened', error);
        });
}

// function onWriteLine(request, response) {
//     response.send(200, 'Input was written to log.', function (err) {
//         if (err) {
//             console.error('An error occurred when sending a method response:\n' + err.toString());
//         } else {
//             console.log('Response to method \'' + request.methodName + '\' sent successfully.');
//         }
//     });
// }

function printResultFor(op) {
    return function printResult(err, res) {
        if (err) console.log(op + ' error: ' + err.toString());
        if (res) console.log(op + ' status: ' + res.constructor.name);
    };
}

client.open(function (err) {
    if (err) {
        console.error('could not open IotHub client');
    } else {
        console.log('client opened');

        client.on('message', function (msg) {
                onTakePic();
                console.log('Id: ' + msg.messageId + ' Body: ' + msg.data);
                client.complete(msg, printResultFor('completed'));
            });

        // client.onDeviceMethod('takePic', onTakePic);
    }
});