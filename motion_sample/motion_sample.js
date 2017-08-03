var PiMotion = require('node-pi-motion');
 
var options = {
  verbose: true,
  throttle: 200
}
 
var nodePiMotion = new PiMotion(options);
 
nodePiMotion.on('DetectedMotion', function() {
  console.log('Motion detected! Now do something.');
});