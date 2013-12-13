var express = require('express');
var fs = require('fs');
var app = express();
var url = require("url");
var Sequelize = require("sequelize")
var https = require('https');
var querystring = require('querystring');
var parseString = require('xml2js').parseString;

/* Serve files in public */
app.use('/public', express.static(__dirname + "/public"));

/* Middleware for logging:  */
app.use(express.logger());

/* Favicon */
app.use(express.favicon(__dirname + '/public/imgs/favicon.ico')); 

/* Middleware for parsing post body */
app.use(express.bodyParser());

app.get('/', function(request, response) {
    var buffer = fs.readFileSync('index.html');
    response.send(buffer.toString());
});
 
app.post('/preRegister', function(req, res) {
    var name = req.body.inputName;
    var email = req.body.inputEmail;
    console.log("Register request from " + name + " (" + email + ")");
    var buffer = fs.readFileSync('index.html');
    res.send(buffer.toString());
});

app.post('/preorder', function(req, res) {
    var senderName = req.body.preorderName;
    var senderEmail = req.body.preorderEmail;
    console.log(senderName + " " + senderEmail);

    var post_data = querystring.stringify({
	'email' : 'igor.auad@gmail.com',
	'charset': 'UTF-8',
	'token': '4E0E29549B5243CAA2E1D0061FFBE049',
        'currency' : 'BRL',
	'itemId1' : '0001',
	'itemDescription1' : 'Pre-compra consulta',
	'itemAmount1' : '100.00',
	'itemQuantity1' : '1',
	'reference' : 'REF1234',
	'senderName' : senderName,
	'senderAreaCode' : '91',
	'senderPhone' : '32457810',
	'senderEmail' : senderEmail,
	'shippingCost' : '0.00'
    });
    
    console.log(post_data);

    // An object of options to indicate where to post to
    var post_options = {
	host: 'ws.pagseguro.uol.com.br',
	port: '443',
	path: '/v2/checkout',
	method: 'POST',
	headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': post_data.length
	}
    };

    // Set up the request
    var post_req = https.request(post_options, function(resp) {
	resp.setEncoding('utf8');
	resp.on('data', function (chunk) {
            console.log('Response: ' + chunk);
	    parseString(chunk, function (err, result) {
		json_text = JSON.stringify(result);
		json_res = JSON.parse(json_text);
		paymentUrl = "https://pagseguro.uol.com.br/v2/checkout/payment.html?code=" +  json_res.checkout.code[0];
		console.log(paymentUrl);
		res.redirect(307, paymentUrl);    
	    });
	});
    });

    // post the data
    post_req.write(post_data);
    post_req.end();

    var buffer = fs.readFileSync('index.html');

});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
