var express = require('express');
var path = require('path');
var getPathToKasparov = require('../scrape');
var _ = require('underscore');

var app = express()
	.use(express.static(__dirname,
		path.join(__dirname, 'bower_components'),
		path.join(__dirname, 'js'), path.join(__dirname, 'visualD3')))
	.use(express.bodyParser());


// app.get("/songs", function(req, res) {
// 	res.json(data);
// });

app.post('/search', function(req, res) {
	'use strict';
	var pathAndProfiles = {};
	// initialize profiles with Kasparov and Kamsky
	pathAndProfiles.profiles = [{
		uscfID: '12518524',
		name: 'Garry Kasparov',
		regularRating: '2812',
		state: '',
		country: 'RU'
	}, {
		uscfID: '12528459',
		name: 'Gata Kamsky',
		regularRating: '2796',
		state: 'NY',
		country: 'US'
	}]; 
	console.log(req.body.IDinput);
	var userInput = req.body.IDinput;
	getPathToKasparov(userInput, function(data) {

		pathAndProfiles.path = data;

		res.send(pathAndProfiles);
	});
});


var port = process.env.PORT || 3000;
app.listen(port);
console.log('Started server on port ' + port);