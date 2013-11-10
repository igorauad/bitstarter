var express = require('express');
var fs = require('fs');
var app = express();
var url = require("url");
app.use(express.logger());

app.get('/index', function(request, response) {
    var buffer = fs.readFileSync('index.html');
    response.send(buffer.toString());
});
 
app.get('/', function(request, response) {
    var buffer = fs.readFileSync('signup.html');
    response.send(buffer.toString());
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
