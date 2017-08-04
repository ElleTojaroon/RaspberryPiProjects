'use strict';
var wpi = require('wiringpi-node');

// GPIO pin of the led
var configPin = 7;
wpi.setup('wpi');
wpi.pinMode(configPin, wpi.OUTPUT);
var isLedOn = 0;
var watcher = 0;

var fontColor = "\x1b[36m"; // cyan
var errorColor = "\x1b[31m"; // red -urgent

var Mqtt = require('azure-iot-device-mqtt').Mqtt;
var DeviceClient = require('azure-iot-device').Client;

var connectionString = 'HostName=IotHubC2D.azure-devices.net;DeviceId=takePicture;SharedAccessKey=cgGlLd0xzl7Nza7/563E/Lb4avczu7imLO/Dy2axR6s=';
var client = DeviceClient.fromConnectionString(connectionString, Mqtt);

function turnLightOn() {
    isLedOn = 1;
}

function turnLightOff() {
    isLedOn = 0;
}

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
                turnLightOn();
                watcher = 1;
                console.log('Id: ' + msg.messageId + ' Body: ' + msg.data);
                client.complete(msg, printResultFor('completed'));
            });
            
        while (true) {
            if (!watcher) turnLightOff();
            else {
                setTimeout(function(){ 
                    watcher = 0;
                }, 1000);
            }
            
        } 
    }
});