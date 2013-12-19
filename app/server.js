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

var userInput;

app.post('/search', function(req, res) {
	'use strict';

	userInput = req.body.uscfID;
	console.log(userInput);
	res.send('Success');
	
});

app.get('/search', function(req, res) {
	'use strict';
	var path = [];
	// initialize profiles with Kasparov and Kamsky
	var kasparovProfile = {
		uscfID: '12518524',
		Name: 'GARRY KASPAROV',
		RegularRating: '2812',
		OverallRanking: '2 out of the entire world',
		State: 'RU',
		country: 'RU'
	};
	var kamskyProfile = {
		uscfID: '12528459',
		Name: 'GATA KAMSKY',
		RegularRating: '2796',
		OverallRanking: '3 out of 53790',
		State: 'NY',
		country: 'US'
	};
	getPathToKasparov(userInput, function(playersArray) {
		async.each(playersArray, function(player, callback) {
			console.log(player);
			smitaScrape.getProfile(player, function(err, profile) {
				var tempIndex = playersArray.indexOf(profile.uscfID);
				path[tempIndex] = profile;
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
