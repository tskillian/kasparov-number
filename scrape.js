var getHighestBucketWithWin = require('./record_against_rating_buckets_scrape');
var kamskyOrRecentWin = require('./Gamestats_Scrape');
var async = require('async');

// getUserInput //get USCF ID
// checkIfInDB // if not in database, add player info to database. 

// //if not in database:
// 	getHighestWin 
// 		getHighestBucket //needs USCF IF, returns highest ratings bucket with a win
// 		getFirstWin // returns true needs USCF ID and highest bucket
// 					// add this player to the database



// taking in USCF ID, check if any wins against Kamsky, if false return USCF ID of highest win




// var userInput //USCF ID, starting point
// var path = []; //Store array of USCF ID's
// var uscfId = userInput;
// while (uscfId !== kamskyId)
// 	getHighestWin(uscfId)
// 		var highestBucket = getHighestBucket(uscfId) //returns highest ratings bucket with win
// 		var firstWin = getFirstWin(uscfId, highestBucket) // returns true if there's a win vs kamsky, otherwise
// 															// returns USCF ID of most recent win
// 		if (firstWin !== true) {
// 			path.push(firstWin)
// 			uscfId = firstWin;
// 		}

var PlayerID = '12869418';



var asdf = function(PlayerID) {
	'use strict';
	async.waterfall([
		function(callback) {
			getHighestBucketWithWin(PlayerID, function(highestBucket) {
				callback(null, highestBucket);
			});
		},
		function(highestBucket, callback) {
			kamskyOrRecentWin(PlayerID, highestBucket, function(recentWin) {
				callback(null, recentWin);
			});
		}
	], function(err, result) {
		console.log(result.trim());
		PlayerID = result.trim();
		return result;

	});
};



async.whilst(
	function() {
		return PlayerID !== '12528459';
	},
	function(callback) {
		async.waterfall([

			function(callback) {
				getHighestBucketWithWin(PlayerID, function(highestBucket) {
					console.log('playerID in getHighestBucketWithWin function: '+ PlayerID);
					callback(null, highestBucket);
				});
			},
			function(highestBucket, callback) {
				kamskyOrRecentWin(PlayerID, highestBucket, function(recentWin) {
					console.log('playerID in recent win function: '+ PlayerID);
					callback(null, recentWin);
				});
			}
		], function(err, recentWin) {
			console.log(recentWin.trim());
			console.log('playerID in result function: '+ PlayerID);
			PlayerID = recentWin.trim();
			console.log('playerID in result function after mutation: '+ PlayerID);
			callback(null);

		});
	},
	function(err) {
		console.log('error is: ' + err);
	});

// var count = 0;

// async.whilst(
//     function () { return count < 5; },
//     function (callback) {
//         count++;
//         console.log(count);
//         setTimeout(callback, 1000);
//     },
//     function (err) {
//         // 5 seconds have passed
//     }
// );

//kickAssShit(PlayerID);




