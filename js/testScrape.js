var uscfId = 12528459; //12870732
//var uscfId=12869413;

var require = ("scrape.js")

getProfile('12710197', function(error, data) {
    console.log(error);
    console.log(data);
});

getProfile('1271019', function(error, data) {
    console.log(error);
    console.log(data);
});

getProfile('', function(error, data) {
    console.log(error);
    console.log(data);
});

getHighestBucketWithWin('12710197', function(error, data) {
    console.log(error);
    console.log(data);
});

getHighestBucketWithWin('1271019', function(error, data) {
    console.log(error);
    console.log(data);
});

getHighestBucketWithWin('', function(error, data) {
    console.log(error);
    console.log(data);
});