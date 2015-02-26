var app = require('express')();
var http = require('http').Server(app);
var aws = require('aws-sdk');
var crypto = require('crypto');
var bodyParser = require('body-parser');

//parse POSTs as JSON
app.use(bodyParser.json());

urlValueArray = [];
conversionArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.get('/a/:id', function(req, res){
	var totalValue = 0;
	var power = 0;

	var keySplit = req.params.id.split('');

	for(i = keySplit.length -1; i >= 0; i--){
		var digitSum = conversionArray.indexOf(keySplit[i]);

		multiplier = Math.pow(36, power);

		power++;

		digitValue = digitSum * multiplier;

		totalValue += digitValue;
	}

	if(urlValueArray[totalValue]){
		res.redirect(urlValueArray[totalValue]);
	}
	else {
		res.end('Sorry!');
	}
});


app.post('/shorten', function (req, res) {

  	var url = req.body.url;

	urlValueArray.push(url);

	var convertedValue = '';

	var startingPoint = urlValueArray.length - 1;
	position = urlValueArray.length - 1;

	if(position > 9){
		var positionValueSplit = position.toString().split('');

		for(i = positionValueSplit.length ; i > -1; i--){

			var divisor = Math.pow(36, i);

			var temp = Math.floor(position / divisor);

			position -= (temp * divisor);

			convertedValue += conversionArray[temp];
		}
	}
	else {
		convertedValue = position;
	}


	res.end(JSON.stringify({ v : convertedValue.toString() }));
});

app.get('/add', function (req, res) {

	console.log('urls: ' + urlValueArray);

  	var url = 'http://example.com';

	urlValueArray.push(url);

	var convertedValue = '';

	var position = urlValueArray.length - 1;
	var convertedValue;

	if(position > 9){
		var positionValueSplit = position.toString().split('');

		console.log(positionValueSplit);

		for(i = positionValueSplit.length; i > -1; i--){

			var divisor = Math.pow(36, i);
			console.log('divisor' + divisor);

			var temp = Math.floor(position / divisor);
			console.log('temp' + temp);

			position -= (temp * divisor);

			convertedValue += conversionArray[temp];
		}
	}
	else {
		convertedValue = position;
	}


	console.log('convertedValue: ' + convertedValue);
	res.end('v: ' + convertedValue);

});

app.get('/css/custom.css', function(req, res){
	res.sendFile(__dirname + '/css/custom.css');
});

app.get('/js/actions.js', function(req, res){
	res.sendFile(__dirname + '/js/actions.js');
});

app.get('/js/ui-controller.js', function(req, res){
	res.sendFile(__dirname + '/js/ui-controller.js');
});

app.get('/hc1', function(req, res){
    	res.setHeader('Content-Type', 'application/json');
    	res.end(JSON.stringify({ a: 1 }));
});

app.get('/hc2', function(req, res){
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ b : 1 }));
});


http.listen(3000, function(){
  	console.log('listening on *:3000');
});
