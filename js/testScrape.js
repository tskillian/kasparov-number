var Scrape = require("./scrape.js")

var testuscfID = ['12528459', '12710197', '12870732', '12869413', '1271019'];

for (var i = 0; i < testuscfID.length; i++) {
    Scrape.getProfile(testuscfID[i], function(error, data) {
        if (error) {
            console.log(error);
        } else {
            console.log(data);
        }
    });
    Scrape.getHighestBucketWithWin(testuscfID[i], function(error, data) {
        if (error) {
            console.log(error);
        } else {
            console.log(data);
        }
    });
    Scrape.getAllGamesByWinLossDraw(testuscfID[i], 2700, "W", function(error, data) {
        console.log(error);
        console.log(data);
    });
}

Scrape.getAllGamesByWinLossDraw('12625186', 2800, "W", function(error, data) {
    console.log(error);
    console.log(data);
});

Scrape.getAllGamesByWinLossDraw('12625186', 2700, "L", function(error, data) {
    console.log(error);
    console.log(data);
});

Scrape.getAllGamesByWinLossDraw('12625186', 2700, "D", function(error, data) {
    console.log(error);
    console.log(data);
});

