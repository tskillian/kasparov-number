var phantom = require('node-phantom');
var id = 12528459;


phantom.create(function(err, ph) {
    'use strict';
    return ph.createPage(function(err, page) {
        return page.open('http://main.uschess.org/datapage/gamestats.php?memid=' + id, function(err, status) {
            console.log('opened site? ', status);
            page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js', function() {
                //jQuery Loaded.
                //Wait for a bit for AJAX content to load on the page. Here, we are waiting 5 seconds.

                return page.evaluate(function() {
                    // Helper function to go through an array of objects with bucket and wins property, finding
                    // the highest bucket with a win
                    var highestBucketWithWin = function(arr) {
                        var topBucket = 0;
                        arr.forEach(function(element) {
                            console.log('topBucket: ' + topBucket + ' current loop bucket: ' + element.bucket);
                            if (parseInt(element.wins, 10) > 0 && parseInt(element.bucket, 10) > topBucket) {
                                topBucket = element.bucket;
                            }
                        });
                        return topBucket;
                    };
                    // Populate an array of objects where each object has a bucket and wins property,
                    // the bucket being a given rating and wind being how many wins against that rating
                    var rows = [];
                    $('.blog').siblings().find('tr').each(function(i, element) {
                        var $row = $(element);
                        rows.push({
                            bucket: $row.find('td').eq(0).text(),
                            wins: $row.find('td').eq(2).text()
                        });
                    });
                    console.log(highestBucketWithWin);
                    return highestBucketWithWin(rows);
                }, function(err, result) {
                    console.log(result);
                    ph.exit();
                });

            });
        });
    });
});