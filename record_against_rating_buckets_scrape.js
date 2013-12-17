var request = require('request'),
    cheerio = require('cheerio');
//    process = require('process');

//var id = process.argv[2];      // mine = 12528459

var getHighestBucketWithWin = function(id, callback) {
    'use strict';
    var requestUrl = 'http://main.uschess.org/datapage/gamestats.php?memid=' + id;
    request(requestUrl, function(error, response, body) {
        var $ = cheerio.load(body);
        // Helper function to go through an array of objects with bucket and wins property, finding
        // the highest bucket with a win
        var highestBucketWithWin = function(arr) {
            var topBucket = 0;
            arr.forEach(function(element) {
                if (parseInt(element.wins, 10) > 0 && parseInt(element.bucket, 10) > topBucket) {
                    topBucket = element.bucket;
                }
            });
            return topBucket;
        };
        // Populate an array of objects where each object has a bucket and wins property,
        // the bucket being a given rating and wind being how many wins against that rating
        var $table = [];
        $('.blog').siblings().find('tr').each(function(i, element) {
            var $row = $(element);
            $table.push({
                bucket: $row.find('td').eq(0).text(),
                wins: $row.find('td').eq(2).text()
            });
        });
        callback(highestBucketWithWin($table));
    });
};

module.exports = getHighestBucketWithWin;