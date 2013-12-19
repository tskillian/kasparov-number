var getHighestBucketWithWin = require('./record_against_rating_buckets_scrape');
var kamskyOrRecentWin = require('./Gamestats_Scrape');
var async = require('async');

var getPathToKasparov = function(PlayerID, callback1) {
	'use strict';

	// initialize jump count and path
	var jumpCount = 0;
	var path = [];


	// Players Kamsky has lost to hard coded to make search considerably faster
	var kamskyLosses = {
		'15218438': '15218438',
		'12641216': '12641216',
		'12577974': '12577974',
		'12543746': '12543746',
		'12544264': '12544264',
		'12801246': '12801246',
		'12473035': '12473035',
		'13209014': '13209014',
		'12528454': '12528454',
		'12775614': '12775614',
		'12735968': '12735968',
		'10460921': '10460921',
		'10098327': '10098327',
		'12045270': '12045270',
		'12205680': '12205680',
		'12841701': '12841701',
		'10076994': '10076994'
	};

	// A couple helper functions to make the async looping more readable/debuggable 

	var didBeatKamksy = function(playerList) {
		for (var i = 0; i < playerList.length; i++) {
			if (playerList[i].playerID in kamskyLosses && playerList[i].winLoss === 'W') { //if player beat Kamsky, return true
				return playerList[i].playerID;
			}
		}
		return false;
	};

	var getWinByIndex = function(playerList, winIndex) {
		if (winIndex >= playerList.length) {
			throw 'Win index out of bounds on getWinByIndex function';
		} else {
			winIndex = winIndex || 0;
			if (path.indexOf(playerList[winIndex].playerID) !== -1) {
				getWinByIndex(playerList, winIndex += 1);
			} else {
				path.push(playerList[winIndex].playerID);
				return playerList[winIndex].playerID;
			}
		}
	};

	async.whilst(
		function() {
			return !(PlayerID in kamskyLosses) || PlayerID === '12528459';
		},
		function(callback) {
			async.waterfall([

				function(callback) {
					getHighestBucketWithWin(PlayerID, function(highestBucket) {
						// console.log('playerID in getHighestBucketWithWin function: ' + PlayerID);
						callback(null, highestBucket);
					});
				},
				function(highestBucket, callback) {
					kamskyOrRecentWin(PlayerID, highestBucket, 'W', function(winsList) {
						callback(null, winsList);
					});
				}
			], function(err, winsList) {
				jumpCount += 1;
				if (didBeatKamksy(winsList)) {
					PlayerID = didBeatKamksy(winsList);
					path.push(PlayerID);
					callback(null);
				} else {
					PlayerID = getWinByIndex(winsList, 0);
					callback(null);
				}
			});
		},
		function(err) {
			if (err) {
				console.log('error is: ' + err);
			} else {
				// Add Kamsky and Kasparov since we got up to Kamsky losses
				callback1(path);
			}
		});

};

module.exports = getPathToKasparov;

// getPathToKasparov('12869413', function(result) {
// 	console.log(result);
// });






