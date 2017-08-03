var raspivid = require('raspivid');
var fs = require('fs');
 
var file = fs.createWriteStream(__dirname + '/video.h264');
var video = raspivid();
 
video.pipe(file);