var request = require('request'),
    cheerio = require('cheerio');
var getProfile = function(uscfID, callback) {
    'use strict';
    var errorMsg = "";
    var user = null;
    var requestURL = 'http://www.uschess.org/msa/MbrDtlMain.php?' + uscfId;

    request(requestURL, function(error, response, body) {
        if (!error) {
            var $ = cheerio.load(body);

        } else {
            errorMsg="error loading page" + error;
        }
        callback(errorMsg,user);
    });


}

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