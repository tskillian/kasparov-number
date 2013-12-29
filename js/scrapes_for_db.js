var request = require('request'),
    cheerio = require('cheerio'),
    mongodb = require('mongodb'),
    async = require('async'),
    dbInfo = require('../priv_mongo_info'),
    MongoClient = mongodb.MongoClient; //Connect via MongoClient.connect(dbInfo, function(err, db) {})

var getPersistentData = function(callback) {
    'use strict';
    MongoClient.connect(dbInfo, function(err, db) {
        var collection = db.collection('dataPersistence');
        var dbObject = collection.find({});
        // callback(null, persistedData.toArray(function(err, data) {
        //     console.log(data[0].playersVisited, data[0].queue);
        // }));
        dbObject.toArray(function(err, data) {
            db.close();
            callback(null, data[0]);
        });
    });
};

// getPersistentData(function(err, data) {
//     'use strict';
//     console.log(data);
// });

var getProfile = function(uscfID, callback) {
    'use strict';
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
                        var asOfDate = value.match(/\d{4}-\d{2}/)[0];
                        value = value.match(/\d{4}/)[0];
                        user[field] = value;
                        user.asOfDate = asOfDate;
                    } else if (field === 'FIDEID') {
                        value = value.match(/\d+/).toString();
                        user[field] = value;
                    } else if (field === 'OverallRanking' || field === 'State') {
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

getProfile('12528459', function(err, data) {
    console.log(data);
});

var getAllBuckets = function(id, callback) {
    'use strict';
    console.log('player ID within getHighestBucketWithWin file: '+ id);
    var requestUrl = 'http://main.uschess.org/datapage/gamestats.php?memid=' + id;
    request(requestUrl, function(error, response, body) {
        var $ = cheerio.load(body);
        var buckets = [];
        $('.blog').siblings().find('tr').each(function(i, element) {
            var $row = $(element);
            var bucket = $row.find('td').eq(0).text();
            if (bucket && bucket.length < 5) {
                buckets.push(bucket);
            }
        });
        callback(null, buckets);
    });
};

// getAllBuckets('12528459', function(err, data) {
//     console.log(data);
// });
var addGamesInBucket = function(id, bucket, callback) {
    var requestURL = 'http://www.uschess.org/datapage/gamestats.php?memid=' + id + '&dkey='+bucket+'&drill=G';
    request(requestURL, function(error, response, body) {
        var games = [];
        var $ = cheerio.load(body);
        var $table = $('.blog').siblings().find('tr');
        $table.each(function(index, element) {
            var $row = $(element);
            var winLossDraw = $row.find('td').eq(7).text();
            if (winLossDraw) {
                games.push({
                    winLossDraw: winLossDraw,
                    opponentUscfId: $row.find('td').eq(4).text(),
                    tournament: $row.find('td').eq(0).text(),
                    preTourneyRating: $row.find('td').eq(6).text().slice(0,4)
                });
            }
        });
        callback(null, games);
    });
};

// addGamesInBucket('12528459', '2900', function(err, data) {
//     console.log(data);
// });


var getWin = function(player, bucket, WLD, callback) {
    'use strict';

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




// Need to add every game played to DB

// Start with array of buckets, the pop each off as you go, adding to players win/loss/draws
// go to each player lost to, doing same thing