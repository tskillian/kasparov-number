var express = require('express');
var path = require('path');
var getPathToKasparov = require('../scrape');
var smitaScrape = require('../js/scrape');
var async = require('async');


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
	var path = [];
	// initialize profiles with Kasparov and Kamsky
	var kasparovProfile = {
		uscfID: '12518524',
		name: 'Garry Kasparov',
		regularRating: '2812',
		state: '',
		country: 'RU'
	};
	var kamskyProfile = {
		uscfID: '12528459',
		name: 'Gata Kamsky',
		regularRating: '2796',
		state: 'NY',
		country: 'US'
	};
	var userInput = req.body.uscfID;
	console.log(userInput);
	getPathToKasparov(userInput, function(playersArray) {
		async.eachSeries(playersArray, function(player, callback) {
			console.log(player);
			smitaScrape.getProfile(player, function(err, profile) {
				console.log(profile);
				path.push(profile);
				callback(null);
			});
			
		}, function() {
			path.push(kamskyProfile);
			path.push(kasparovProfile);
			res.send(path);
		});

	});
});


var port = process.env.PORT || 3000;
app.listen(port);
console.log('Started server on port ' + port);
