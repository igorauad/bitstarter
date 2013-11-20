var express = require('express');
var fs = require('fs');
var app = express();
var url = require("url");

app.configure(function(){
    app.use('/public', express.static(__dirname + "/public"));
});

/* Middleware for logging:  */
app.use(express.logger());

/* Middleware for parsing post body */
app.use(express.bodyParser());

app.get('/', function(request, response) {
    var buffer = fs.readFileSync('signup.html');
    response.send(buffer.toString());
});

app.get('/index', function(request, response) {
    var buffer = fs.readFileSync('index.html');
    response.send(buffer.toString());
});
 
app.post('/preRegister', function(req, res) {
    var name = req.body.inputName;
    var buffer = fs.readFileSync('index.html');
    res.send(buffer.toString());
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
