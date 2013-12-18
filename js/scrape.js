var request = require('request'),
    cheerio = require('cheerio');

var getProfile = function(uscfID, callback) {
    'use strict';
    var errorMsg = "";
    var user = null;
    var requestURL = 'http://www.uschess.org/msa/MbrDtlMain.php?' + uscfID;

    request(requestURL, function(error, response, body) {
        if (!error) { //Page Loaded
            var $ = cheerio.load(body);
            var tmp = $(".topbar-middle b").html();
            if (tmp.search("Error") !== -1) { //uscfID not valid
                errorMsg = "Invalid USCF ID" + uscfID;
            } else {
                //get uscfID and player Name
                user = {};
                tmp = tmp.split(":");
                user.uscfID = tmp[0];
                user.name = tmp[1].trim();

                //extracting other details
                var mainContent = $(".topbar-middle table").toArray();
                $(mainContent).last().find("tr").each(function(i, element) {
                    var $row = $(element);
                    var field = $row.find("td").eq(0).text().replace(/\n/g, "").replace(/ /g, "");
                    var value = $row.find("td").eq(1).text().replace(/\n/g, "").trim();
                    if (field === "RegularRating") {
                        value = value.match(/\d{4}/) + " on " + value.match(/\d{4}-\d{2}/);
                        user[field] = value;
                    } else if (field === "OverallRanking" || field === "State" || field === "FIDETitle") {
                        user[field] = value;
                    }
                }); //end each
            } //end user created
        } else {
            errorMsg = "error loading page" + error;
        }
        callback(errorMsg, user);
    }); //ends request
} //ends getProfile

var getHighestBucketWithWin = function(uscfID, callback) {
    'use strict';
    var errorMsg = "";
    var topBucket = 0;
    var requestURL = 'http://main.uschess.org/datapage/gamestats.php?memid=' + uscfID;

    request(requestURL, function(error, response, body) {
        if (!error) { //Page Loaded
            var $ = cheerio.load(body);
            var $table = [];
            //creates array of objects {bucket,wins}
            $('.blog').siblings().find('tr').each(function(i, element) {
                var $row = $(element);
                $table.push({
                    bucket: $row.find('td').eq(0).text(), //bucket= rating range
                    wins: $row.find('td').eq(2).text() //wins= correspond to wins in bucket
                });
            }); //end each
            // finds highest bucket that has win
            $table.forEach(function(element) {
                if (parseInt(element.wins, 10) > 0 && parseInt(element.bucket, 10) > topBucket) {
                    topBucket = element.bucket;
                }
            }); //end forEach
            if (topBucket === 0) {
                errorMsg = "No win bucket for USCF id " + uscfID;
            }
        } else {
            errorMsg = "error loading page" + error;
        }
        callback(errorMsg, topBucket);
    }); //ends request
} //ends getHighestBucketWithWin

var getAllGamesByWinLossDraw = function(uscfID, bucket, winLossDraw, callback) {
    'use strict';
    var errorMsg = "";
    var winLossDrawArray = null;
    var requestURL = 'http://www.uschess.org/datapage/gamestats.php?memid=' + uscfID + '&dkey=' + bucket + '&drill=G';

    request(requestURL, function(error, response, body) {
        if (!error) { //Page Loaded
            var $ = cheerio.load(body);
            var winLossDrawArray = [];
            var $table = $('.blog').siblings().find('tr');
            var tableLength = $table.length;
            $table.each(function(i, element) {
                var $row = $(element);
                var wld = $row.find('td').eq(7).text();
                var uscfID = $row.find('td').eq(4).text();
                var player = {};
                player.winLossDraw = wld;
                player.uscfID = uscfID.trim();

                if (winLossDraw === wld) {
                    winLossDrawArray.push(player)
                } else if (winLossDraw === null && wld !== '') { // Make sure no empty objects are added when getting all
                    winLossDrawArray.push(player)
                }
            }); //end each
            if (winLossDrawArray.length===0){
                errorMsg="No data found for player " + uscfID +" in bucket " + bucket + "--" + winLossDraw;
            }

        } else {
            errorMsg = "error loading page" + error;
        }
        callback(errorMsg, winLossDrawArray);
    }); //ends request
} //ends getAllGamesByWinLossDraw

var Scrape={};
Scrape.getProfile =getProfile;
Scrape.getHighestBucketWithWin =getHighestBucketWithWin;
Scrape.getAllGamesByWinLossDraw =getAllGamesByWinLossDraw;

module.exports = Scrape;
