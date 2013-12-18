var request = require('request'),
    cheerio = require('cheerio');
//    process = require('process');

//var id = process.argv[2];      // mine = 12528459

var getHighestBucketWithWin = function(id, callback) {
    'use strict';
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
        console.log('output from highest bucket file: '+topBucket)
        callback(topBucket);
        
    });
};

module.exports = getHighestBucketWithWin;