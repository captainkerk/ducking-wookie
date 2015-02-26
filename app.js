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

	var url = urlValueArray[totalValue];
	if(url){
		if(url.indexOf('http://') != -1 || url.indexOf('https://') != -1){
			res.redirect(urlValueArray[totalValue]);
		}
		else {
			res.redirect('http://' + urlValueArray[totalValue]);
		}

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

app.get('/recent', function(req, res) {

	length = urlValueArray.length - 1;
	var resultArray = [];

	var convertedValue = '';

	for(k = 0; k < 10; k++){

		position = urlValueArray.length - k -1;
		fixedPosition = urlValueArray.length - k -1;

		if(position > 9){

			var convertedValue = '';
			var positionValueSplit = position.toString().split('');

			for(i = positionValueSplit.length ; i > -1; i--){

				var divisor = Math.pow(36, i);

				var temp = Math.floor(position / divisor);

				position -= (temp * divisor);

				convertedValue += conversionArray[temp];
			}

			while(convertedValue.charAt(0) === '0'){
				convertedValue = convertedValue.substr(1);
			}
		}
		else {
			convertedValue = position;
		}

		var pair = new Object();

		pair.key = convertedValue;
		pair.value = urlValueArray[fixedPosition];

		resultArray.push(pair);
	}
	res.json({'urls' : resultArray});
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


http.listen(3000, function(){
  	console.log('listening on *:3000');
});
