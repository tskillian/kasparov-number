var getHighestBucketWithWin = require('./record_against_rating_buckets_scrape');
var kamskyOrRecentWin = require('./Gamestats_Scrape');
var async = require('async');

var PlayerID = '12869418';
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

var didBeatKamksy = function(playerList) {
	'use strict';
    for (var i = 0; i < playerList.length; i++) {
        if (playerList[i].playerID in kamskyLosses && playerList[i].winLoss === 'W') { //if player beat Kamsky, return true
            return playerList[i].playerID;
        }
    }
    return false;
};

var getWinByIndex = function(playerList, winIndex) {
    'use strict';
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
var jumpCount = 0;
var path = [];

async.whilst(
	function() {
		'use strict';
		return !(PlayerID in kamskyLosses) || PlayerID === '12528459';
	},
	function(callback) {
		'use strict';
		async.waterfall([

			function(callback) {
				getHighestBucketWithWin(PlayerID, function(highestBucket) {
					console.log('playerID in getHighestBucketWithWin function: ' + PlayerID);
					callback(null, highestBucket);
				});
			},
			function(highestBucket, callback) {
				kamskyOrRecentWin(PlayerID, highestBucket, 'W', function(winsList) {
					console.log('playerID in recent win function: ' + PlayerID);

					callback(null, winsList);
				});
			}
		], function(err, winsList) {
			//console.log(winsList);
			jumpCount += 1;
			console.log('jumps: '+jumpCount);
			console.log('path is:'+ path);
			// If there's a win vs Kamsky in wins list, return his ID, otherwise continue as normal
			if (didBeatKamksy(winsList)) {
				PlayerID = '12528459';
			} else {
				PlayerID = getWinByIndex(winsList, 0);
				callback(null);
			}
			// console.log('playerID in result function: '+ PlayerID);
			// PlayerID = winsList.trim();
			// console.log('playerID in result function after mutation: '+ PlayerID);
		});
	},
	function(err) {
		'use strict';
		console.log('error is: ' + err);
	});






