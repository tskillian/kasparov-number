'use strict';

var async = require('async'),
    request = require('request'),
    cheerio = require('cheerio');

var kamskyOrRecentWin = function(player, bucket, WLD, callback) {
    var requestURL = 'http://www.uschess.org/datapage/gamestats.php?memid=' + player + '&dkey='+bucket+'&drill=G';
    request(requestURL, function(error, response, body) {
        var LW = [];
        var $ = cheerio.load(body);
        var $table = $('.blog').siblings().find('tr');
        $table.each(function(i, element) {
            var $row = $(element);
            var wl = $row.find('td').eq(7).text();
            var pID = $row.find('td').eq(4).text();
            var player = {};
            player.winLoss = wl;
            player.playerID = pID.trim();

            if (WLD === wl) {
                LW.push(player);
            } else if (WLD === null && wl !== '') { // Make sure no empty objects are added
                LW.push(player);
            }
        });
        callback(LW);
    });
};

var getHighestBucketWithWin = function(id, callback) {
    console.log('player ID within getHighestBucketWithWin file: '+ id);
    var requestUrl = 'http://main.uschess.org/datapage/gamestats.php?memid=' + id;
    request(requestUrl, function(error, response, body) {
        var $ = cheerio.load(body);
        var $table = [];
        $('.blog').siblings().find('tr').each(function(i, element) {
            var $row = $(element);
            $table.push({
                bucket: $row.find('td').eq(0).text(),
                wins: $row.find('td').eq(2).text()
            });
        });
        var topBucket = 0;
        $table.forEach(function(element) {
            if (parseInt(element.wins, 10) > 0 && parseInt(element.bucket, 10) > topBucket) {
                topBucket = element.bucket;
            }
        });
        console.log('output from highest bucket file: '+topBucket);
        callback(topBucket);
        
    });
};

var getPathToKasparov = function(PlayerID, callback) {
	var error = null;

	// initialize jump count and path
	var jumpCount = 0;
	var path = [];


	// Players Kamsky has lost to hard coded to make search considerably faster
	// (he's the worst (and maybe only?) US player to beat Kasparov)
	// As this object is used as a set, the values are arbitrary
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
			// 12528459 is Kamsky's ID
			return !((PlayerID in kamskyLosses) || PlayerID === '12528459') && !error;
		},
		function(asyncCallback) {
			async.waterfall([

				function(asyncCallback) {
					getHighestBucketWithWin(PlayerID, function(highestBucket) {
						asyncCallback(null, highestBucket);
					});
				},
				function(highestBucket, asyncCallback) {
					kamskyOrRecentWin(PlayerID, highestBucket, 'W', function(winsList) {
						asyncCallback(null, winsList);
					});
				}
			], function(err, winsList) {
				jumpCount += 1;
				if (didBeatKamksy(winsList)) {
					PlayerID = didBeatKamksy(winsList);
					path.push(PlayerID);
					asyncCallback(null);
				} else {
					try {
						PlayerID = getWinByIndex(winsList, 0);
					}
					catch (e) {
						console.log('in catch')
						console.log(e);
						error = e;
					}
					asyncCallback(null);
				}
			});
		},
		function(err) {
			if (err) {
				console.log('error is: ' + err);
			} else {
				console.log('in getpathtokasparov, before calling callback')
				callback(path);
			}
		});

};

var getProfile = function(uscfID, callback) {
    var errorMsg = '';
    var user = null;
    var requestURL = 'http://www.uschess.org/msa/MbrDtlMain.php?' + uscfID;

    request(requestURL, function(error, response, body) {
        if (!error) { //Page Loaded
            var $ = cheerio.load(body);
            var tmp = $('.topbar-middle b').html();
            if (tmp.search('Error') !== -1) { //uscfID not valid
                errorMsg = 'Invalid USCF ID: ' + uscfID;
            } else {
                //get uscfID and player Name
                user = {};
                tmp = tmp.split(':');
                user.uscfID = tmp[0];
                user.name = tmp[1].trim();

                //extracting other details
                var mainContent = $('.topbar-middle table').toArray();
                $(mainContent).last().find('tr').each(function(i, element) {
                    var $row = $(element);
                    var field = $row.find('td').eq(0).text().replace(/\n/g, '').replace(/ /g, '');
                    var value = $row.find('td').eq(1).text().replace(/\n/g, '').trim();
                    if (field === 'RegularRating') {
                        value = value.match(/\d{4}/) + ' on ' + value.match(/\d{4}-\d{2}/);
                        user[field] = value;
                    } else if (field === 'OverallRanking' || field === 'State' || field === 'FIDETitle') {
                        user[field] = value;
                    }
                }); //end each
            } //end user created
        } else {
            errorMsg = 'error loading page: ' + error;
        }
        callback(errorMsg, user);
    }); //ends request
}; //ends getProfile

module.exports = {
	getPathToKasparov: getPathToKasparov,
	getProfile: getProfile
};

// getPathToKasparov('00000000', function(result) {
// 	console.log(result);
// });






