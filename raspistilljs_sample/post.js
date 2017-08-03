var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

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

sendPostRequest("https://ellefuncapp.azurewebsites.net/api/HttpTriggerCSharp1?code=hHOx4SqGNu7scSZWP9njpwY0oKTfXxAL32zLjHntXYePk53qlM5EUQ==",
         "elle");