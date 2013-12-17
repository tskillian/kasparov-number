var request = require('request'),
    cheerio = require('cheerio');
var uscfId=12528459; //12870732
//var uscfId=12869413;

    var getProfile = function ($) {
        var user={};
        //extracting USCF ID & name
        var tmp = $(".topbar-middle b").html();
        console.log(tmp);
        tmp=tmp.split(":");
        user.uscfID=tmp[0]; //tmp.slice(0, tmp.indexOf(":")); alternate to using split
        user.name=tmp[1].trim() //tmp.slice(tmp.indexOf(":")+2);

        //extracting other details using regex
        var mainContent=$(".topbar-middle table").toArray();
        $(mainContent).last().find("tr").each(function(i,element){
            var $row=$(element);
            var field=$row.find("td").eq(0).text().replace(/\n/g,"").replace(/ /g,"");
            var value=$row.find("td").eq(1).text().replace(/\n/g,"").trim();
            //console.log(field);
            if (field==="RegularRating"){
                value =  value.match(/\d{4}/) + " on " + value.match(/\d{4}-\d{2}/);
                user[field]=value;
            }
            if (field==="OverallRanking" || field==="State" || field==="FIDETitle"){
                user[field]=value;
            }
            

        });
        //console.log($rows.eq(22).text());
        
        // var regularRating=$rows.eq(2).find("td").eq(1).text();
        // user.regularRating =  regularRating.match(/\d{4}/) + " on " + regularRating.match(/\d{4}-\d{2}/);
        //  user.overallRanking =$rows.eq(9).find("td").eq(1).text().replace(/\n/g,""); 
        //  user.state = $rows.eq(16).find("td").eq(1).text().replace(/\n/g,""); 
        //  user.fideTitle = $rows.eq(21).find("td").eq(1).text().replace(/\n/g,""); //(tmpTD!== undefined) ? $(tmpTD).html().match(/>.*?</)[0].replace(/</,"").replace(/>/,"").trim():"";
        return user;
    }

'use strict';
var requestURL = 'http://www.uschess.org/msa/MbrDtlMain.php?' + uscfId
var PlayerProfile = request(requestURL, function (error, response, body) {
    if(!error){
    var $ = cheerio.load(body);
    
    var test=getProfile($);
    //console.log(test.uscfID + "," + test.name);
    // console.log(test.regularRating + "," + test.overallRanking);
    // console.log(test.state + "," + test.fideTitle);
    console.log(test);
    // return test;
    }else{
        console.log("error loading page" + error);
    }
});

