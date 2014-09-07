'use strict'

var express = require('express');
var path = require('path');
var logfmt = require('logfmt');
var uscfScraper = require('./scrape');
var async = require('async');


var app = express();
// app.use(express.bodyParser());
app.use(logfmt.requestLogger());
app.use(express.static(path.join(__dirname, 'public')));

var userInput;

app.get('/', function (req, res) {
	res.render('index.html');
});

app.get('/:uscfId', function (req, res) {
	console.log(req.params.uscfId);
	// res.json(req.params.uscfId);
	var path = [];
	// initialize profiles with Kasparov and Kamsky
	var kasparovProfile = {
		uscfID: '12518524',
		name: 'GARRY KASPAROV',
		RegularRating: '2812',
		OverallRanking: '2 out of the entire world',
		State: 'RU',
		country: 'RU'
	};
	var kamskyProfile = {
		uscfID: '12528459',
		name: 'GATA KAMSKY',
		RegularRating: '2796',
		OverallRanking: '3 out of 53790',
		State: 'NY',
		country: 'US'
	};
	uscfScraper.getPathToKasparov(req.params.uscfId, function(playersArray) {
		// ensure the players list starts with the request USCF ID
		console.log('CB FUNCTION TO GETPATHTOKASPAROV')
		console.log(playersArray)
		playersArray.splice(0, 0, req.params.uscfId);

		// iterate through each player, scraping their 'profile' data
		// off of the USCF site and ensuring that they maintain the 
		// same order that they came in
		if (playersArray.length > 1) {
			async.each(playersArray, function(player, callback) {
				console.log(player);
				uscfScraper.getProfile(player, function(err, profile) {
					var tempIndex = playersArray.indexOf(profile.uscfID);
					path[tempIndex] = profile;
					callback();
				});

			
			}, function() {
				// add Kamsky and Kasparov profiles, as we always know that
				// they are the last 2 players in the path
				path.push(kamskyProfile);
				path.push(kasparovProfile);
				res.json(path);
			});
		} else {
			res.json([]);
		}

	});
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log('Started server on port ' + port);
