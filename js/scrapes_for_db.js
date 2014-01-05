var request = require('request'),
    cheerio = require('cheerio'),
    mongodb = require('mongodb'),
    async = require('async'),
    dbInfo = require('../priv_mongo_info'),
    MongoClient = mongodb.MongoClient;

var queue, playersVisited, currentId;
// Start back off timer at 30 seconds, to double each time script is blocked from USCF
var backoffTimer = 30000;

var getPersistentData = function(callback) {
    'use strict';
    MongoClient.connect(dbInfo, function(err, db) {
        var collection = db.collection('dataPersistence');
        var dbObject = collection.find({});
        dbObject.toArray(function(err, data) {
            db.close();
            queue = data[0].queue;
            playersVisited = data[0].playersVisited;
            currentId = queue[0];
            callback(currentId);
        });
    });
};



var getProfile = function(uscfID, callback) {
    'use strict';
    var errorMsg = '';
    var user = null;
    var requestURL = 'http://www.uschess.org/msa/MbrDtlMain.php?' + uscfID;

    request(requestURL, function(error, response, body) {
        var $ = cheerio.load(body);
        var tmp = $('.topbar-middle b').html();
        // if tmp is null/undefined, temporarily blocked by USCF, so try after a hefty delay
        if (tmp === null) {
            console.log(body);
            backoffTimer *= 2;
            setTimeout(addPlayersLoop, backoffTimer);
        } else {
            if (tmp.search('Error') !== -1) { //uscfID not valid
                throw 'uscfID not valid or error somehwere on USCF page: ' + requestURL;
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
                        // conditional to account to edge case where player doesn't even have provisonal rating
                        if (value === '(Unrated)') {
                            user[field] = value;
                        } else {
                            var asOfDate = value.match(/\d{4}-\d{2}/)[0];
                            value = value.match(/\d{4}/)[0];
                            user[field] = value;
                            user.asOfDate = asOfDate;
                        }
                    } else if (field === 'FIDEID') {
                        value = value.match(/\d+/).toString();
                        user[field] = value;
                    } else if (field === 'OverallRanking' || field === 'State') {
                        user[field] = value;

                    }
                }); //end each
            } //end user created
            callback(errorMsg, user);
        }
    }); //ends request
}; //ends getProfile

// getProfile('12528459', function(err, data) {
//     console.log(data);
// });

var addProfileToDatabase = function(profile, callback) {
    'use strict';
    MongoClient.connect(dbInfo, function(err, db) {
        var collection = db.collection('players');
        collection.insert({
            name: profile.name,
            uscfId: profile.uscfID,
            uscfRating: parseInt(profile.RegularRating, 10),
            asOfDate: profile.asOfDate,
            location: profile.State,
            fideId: profile.FIDEID,
            wins: [],
            draws: [],
            losses: []
        }, function(err, docs) {
            if (err) {
                db.close();
                throw err;
            } else {
                db.close();
                console.log(docs);
                callback();
            }
        });

    });
};

//getProfile('12528459', addProfileToDatabase);

var getAllBuckets = function(id, callback) {
    'use strict';
    var requestUrl = 'http://main.uschess.org/datapage/gamestats.php?memid=' + id;
    request(requestUrl, function(error, response, body) {
        var $ = cheerio.load(body);
        var bucketsArray = [];
        $('.blog').siblings().find('tr').each(function(i, element) {
            var $row = $(element);
            var bucket = $row.find('td').eq(0).text();
            if (bucket && bucket.length < 5) {
                bucketsArray.push(bucket);
            }
        });
        callback(null, id, bucketsArray);
    });
};

// getAllBuckets('12528459', function(err, data) {
//     console.log(data);
// });
var getGamesInBucket = function(id, bucket, callback) {
    'use strict';
    var requestURL = 'http://www.uschess.org/datapage/gamestats.php?memid=' + id + '&dkey=' + bucket + '&drill=G';
    request(requestURL, function(error, response, body) {
        var games = [];
        var $ = cheerio.load(body);
        var $table = $('.blog').siblings().find('tr');
        $table.each(function(index, element) {
            var $row = $(element);
            var winLossDraw = $row.find('td').eq(7).text();
            if (winLossDraw) {
                var rating = $row.find('td').eq(6).text().slice(0, 4);
                // Rating should be either a number or 'UNR'
                if (parseInt(rating, 10)) {
                    rating = parseInt(rating, 10);
                }
                games.push({
                    winLossDraw: winLossDraw,
                    opponentUscfId: $row.find('td').eq(4).text().trim(),
                    tournament: $row.find('td').eq(0).text(),
                    preTourneyRating: rating
                });
            }
        });
        callback(null, games);
    });
};

// getGamesInBucket('12528459', '2900', function(err, data) {
//     console.log(data);
// });

var getGamesInAllBuckets = function(err, id, bucketsArray, callback) {
    'use strict';
    var allGamesArray = [];
    async.eachSeries(bucketsArray, function(bucket, eachCallback) {
        getGamesInBucket(id, bucket, function(err, games) {
            allGamesArray = allGamesArray.concat(games);
            eachCallback(null);
        });
    }, function(err) {
        console.log('array length: ' + allGamesArray.length);
        callback(id, allGamesArray);
    });
};

//getAllBuckets('20131342', getGamesInAllBuckets);

var addGamesToDatabase = function(err, id, games, callback) {
    'use strict';
    var wonGames = [],
        lostGames = [],
        drawnGames = [],
        gamesForDb = [];

    games.forEach(function(game) {
        if (game.winLossDraw === 'W') {
            wonGames.push(game);
        } else if (game.winLossDraw === 'L') {
            lostGames.push(game);
        } else if (game.winLossDraw === 'D') {
            drawnGames.push(game);
        }
    });
    gamesForDb[0] = wonGames;
    gamesForDb[1] = lostGames;
    gamesForDb[2] = drawnGames;

    MongoClient.connect(dbInfo, function(err, db) {
        var collection = db.collection('players');
        async.eachSeries(gamesForDb, function(arr, eachCallback) {
            console.log('adding '+arr.length+' games to db');
            if (arr.length > 0 && arr[0].winLossDraw === 'W') {
                collection.update({
                    uscfId: id
                }, {
                    $push: {
                        wins: { $each: arr }
                    }
                }, function() {
                    eachCallback();
                });
            } else if (arr.length > 0 && arr[0].winLossDraw === 'L') {
                collection.update({
                    uscfId: id
                }, {
                    $push: {
                        losses: { $each: arr }
                    }
                }, function() {
                    eachCallback();
                });
            } else if (arr.length > 0 && arr[0].winLossDraw === 'D') {
                collection.update({
                    uscfId: id
                }, {
                    $push: {
                        draws: { $each: arr }
                    }
                }, function() {
                    eachCallback();
                });
            } else {
                eachCallback();
            }
            // if (game.winLossDraw === 'W') {
            //     collection.update({
            //         uscfId: id
            //     }, {
            //         $push: {
            //             wins: game
            //         }
            //     }, function() {
            //         eachCallback();
            //     });
            // } else if (game.winLossDraw === 'L') {
            //     collection.update({
            //         uscfId: id
            //     }, {
            //         $push: {
            //             losses: game
            //         }
            //     }, function() {
            //         eachCallback();
            //     });
            // } else if (game.winLossDraw === 'D') {
            //     collection.update({
            //         uscfId: id
            //     }, {
            //         $push: {
            //             draws: game
            //         }
            //     }, function() {
            //         eachCallback();
            //     });
            // }
        }, function(err) {
            db.close();
            console.log('updates finished');
            callback(id, games);
        });
    });
};

// var exampleGames = [{
//     winLossDraw: 'L',
//     opponentUscfId: '12635380  ',
//     tournament: 'Klein End-of-Year Scholastic ',
//     preTourneyRating: 'Unr.'
// }, {
//     winLossDraw: 'W',
//     opponentUscfId: '12653365  ',
//     tournament: 'Klein End-of-Year Scholastic ',
//     preTourneyRating: 'Unr.'
// }, {
//     winLossDraw: 'D',
//     opponentUscfId: '20115970  ',
//     tournament: 'Klein End-of-Year Scholastic ',
//     preTourneyRating: 'Unr.'
// }];

//addGamesToDatabase(null, "12528459", exampleGames);

var updatePersistentData = function(id, games, queue, playersVisited, callback) {
    'use strict';
    games.forEach(function(game) {
        if (game.winLossDraw === 'L' && !(game.opponentUscfId in playersVisited)) {
            //avoid duplicates
            if (queue.indexOf(game.opponentUscfId) === -1) {
                queue.push(game.opponentUscfId.trim());
            }
        }
    });
    // remove player whose profile and games we just added and add to players visited
    var temp = queue.shift();
    if (temp !== id) {
        throw 'queue and current ID mismatch';
    }
    playersVisited[temp] = temp;

    MongoClient.connect(dbInfo, function(err, db) {
        var collection = db.collection('dataPersistence');
        collection.update({
            name: 'dataPersistence'
        }, {
            $set: {
                'queue': queue,
                'playersVisited': playersVisited
            }
        }, function() {
            db.close();
            callback();
        });
    });
};

// updatePersistentData('123', exampleGames, [], {}, function() {
//     console.log('finished updating');
// });
var addNextPlayerInQueue = function(callback) {
    'use strict';
    getPersistentData(function(currentId) {
        getProfile(currentId, function(err, profile) {
            addProfileToDatabase(profile, function() {
                getAllBuckets(currentId, function(err, id, bucketsArray) {
                    getGamesInAllBuckets(null, id, bucketsArray, function(id, AllGamesArray) {
                        addGamesToDatabase(null, id, AllGamesArray, function(id, games) {
                            updatePersistentData(id, games, queue, playersVisited, function() {
                                console.log('done pls');
                                callback();
                            });
                        });
                    });
                });
            });
        });
    });
};

// async.times(2, function(n, next) {
//     addNextPlayerInQueue(function() {
//         next();
//     });
// }, function() {
//     console.log('done with async.times');
// }
// );

//addNextPlayerInQueue(addNextPlayerInQueue);

var count = 0;

function addPlayersLoop() {
    async.whilst(
        function () { return count < 1000; },
        function (callback) {
            count += 1;
            console.log('current backoff timer: '+backoffTimer/1000+' seconds');
            console.log('delay so that USCF doesn\'t get mad at me...');
            setTimeout(function() {
                addNextPlayerInQueue(callback);
            } , 5000);
        },
        function (err) {
            console.log(queue.length);
            console.log('whilst done');
        }
    );
}

addPlayersLoop();


