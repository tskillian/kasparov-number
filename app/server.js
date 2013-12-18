var express = require('express');
var path = require('path');
var getPathToKasparov = require('../scrape');

var app = express()
			.use(express.static(__dirname,
								path.join(__dirname, 'bower_components'),
								path.join(__dirname, 'js'),path.join(__dirname, 'visualD3')))
			.use(express.bodyParser());


// app.get("/songs", function(req, res) {
// 	res.json(data);
// });

app.post('/search', function(req, res) {
	console.log(req.body.IDinput);
	var userInput = req.body.IDinput;
	getPathToKasparov(userInput, function(data) {
		console.log(data);
		res.send(data);
	});
});


var port = process.env.PORT || 3000;
app.listen(port);
console.log('Started server on port ' + port);