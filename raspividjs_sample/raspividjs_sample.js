var raspivid = require('raspivid');
var fs = require('fs');
 
var file = fs.createWriteStream(__dirname + '/video.h264');
var video = raspivid({
    rotation: 180,
    vstab: true,
    awb: auto
});
 
video.pipe(file);