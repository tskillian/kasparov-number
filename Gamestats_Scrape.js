var request = require('request'),
    cheerio = require('cheerio');
var player = '12710197';
var bucket = '2600';
var async = require('async');

var LW = [];

var getWin = function(player, bucket, callback) {
    'use strict';
    var test = null;
    var requestURL = 'http://www.uschess.org/datapage/gamestats.php?memid=' + player + '&dkey='+bucket+'&drill=G';
    var data = request(requestURL, function(error, response, body) {
        var $ = cheerio.load(body);
        var getPageData = function() {
            var $table = $('.blog').siblings().find('tr');
            var tableLength = $table.length;
            $table.each(function(i, element) {
                var $row = $(element);
                var wl = $row.find('td').eq(7).text();
                var pID = $row.find('td').eq(4).text();
                var player = {};
                player.winLoss = wl;
                player.playerID = pID;
                LW.push(player);
            });
            return LW;
        };
        var checkPlayer = function(playerList) {
            function isKamksy(array) {
                for (var i = 0; i < array.length; i++) {
                    if (array[i]['playerID'] === '12528459' && array[i]['winLoss'] === 'W') { //if player beat Kamsky, return true
                        return true;
                    }
                }
                return false;
            };

            function highestWin(array) {
                for (var i = 0; i < array.length; i++) {
                    if (array[i]['winLoss'] === 'W') {
                        return array[i]['playerID']; //return player object of first win
                    }
                }
                return false;
                
            };

            var pageData = playerList();
            if (isKamksy(pageData)) {
                //callback(true);
                return callback(true);
            } else {
                //return callback(highestWin(pageData));
                return highestWin(pageData);
            }
        };
        return callback(checkPlayer(getPageData));
    });
    //return data ;
};

module.exports = getWin;
