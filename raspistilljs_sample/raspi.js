const Raspistill = require('node-raspistill').Raspistill;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const raspistill = new Raspistill({
    width: 640,
    height: 480,
    verticalFlip: true,
    horizontalFlip: true,
    outputDir: '/home/pi/Desktop'
});

function sendPostRequest(url, name) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
    }
  };
  xhttp.open("POST", url, true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("name=" + name);
}

raspistill.takePhoto('first')
    .then((photo) => {
        console.log('took first photo', photo);
        sendPostRequest("https://ellefuncapp.azurewebsites.net/api/HttpTriggerCSharp1?code=hHOx4SqGNu7scSZWP9njpwY0oKTfXxAL32zLjHntXYePk53qlM5EUQ==",
         "elle")
        return raspistill.takePhoto('second');
    })
    .then((photo) => {
        console.log('took second photo', photo);
    })
    .catch((error) => {
        console.error('something bad happened', error);
    });