var getHighestBucketWithWin = require('./record_against_rating_buckets_scrape');
var kamskyOrRecentWin = require('./Gamestats_Scrape');
var async = require('async');

var PlayerID = '12869418';

var isKamksy = function(playerList) {
	'use strict';
    for (var i = 0; i < playerList.length; i++) {
        if (playerList[i].playerID === '12528459' && playerList[i].winLoss === 'W') { //if player beat Kamsky, return true
            return true;
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
        return playerList[winIndex].playerID;
    }
};

async.whilst(
	function() {
		'use strict';
		return PlayerID !== '12528459';
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
				kamskyOrRecentWin(PlayerID, highestBucket, function(winsList) {
					console.log('playerID in recent win function: ' + PlayerID);

					callback(null, winsList);
				});
			}
		], function(err, winsList) {
			console.log(winsList);
			// If there's a win vs Kamsky in wins list, return his ID, otherwise continue as normal
			if (isKamksy(winsList)) {
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






