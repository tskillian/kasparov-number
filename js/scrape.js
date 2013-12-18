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
                user={};
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
                    }else if (field === "OverallRanking" || field === "State" || field === "FIDETitle") {
                        user[field] = value;
                    }
                }); //end each
            }//end if valid user created
        } else {
            errorMsg = "error loading page" + error;
        }
        callback(errorMsg, user);
    }); //ends request
} //ends getProfile
module.exports =getProfile;

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