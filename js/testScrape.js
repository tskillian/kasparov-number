//var uscfId = 12528459; //12870732
//var uscfId=12869413;

var Scrape = require("./scrape.js")

Scrape.getProfile('12710197', function(error, data) {
    console.log(error);
    console.log(data);
});

Scrape.getProfile('1271019', function(error, data) {
    console.log(error);
    console.log(data);
});

Scrape.getProfile('', function(error, data) {
    console.log(error);
    console.log(data);
});

Scrape.getHighestBucketWithWin('12710197', function(error, data) {
    console.log(error);
    console.log(data);
});

Scrape.getHighestBucketWithWin('1271019', function(error, data) {
    console.log(error);
    console.log(data);
});

Scrape.getHighestBucketWithWin('', function(error, data) {
    console.log(error);
    console.log(data);
});

Scrape.getAllGamesByWinLossDraw('12625186', 2700, "W",function(error, data) {
    console.log(error);
    console.log(data);
});

Scrape.getAllGamesByWinLossDraw('12625186', 2800, "W",function(error, data) {
    console.log(error);
    console.log(data);
});

Scrape.getAllGamesByWinLossDraw('12625186', 2700, "L",function(error, data) {
    console.log(error);
    console.log(data);
});

Scrape.getAllGamesByWinLossDraw('12625186', 2700, "D",function(error, data) {
    console.log(error);
    console.log(data);
});

Scrape.getProfile('1271019', function(error, data) {
    console.log(error);
    console.log(data);
});

Scrape.getProfile('', function(error, data) {
    console.log(error);
    console.log(data);
});