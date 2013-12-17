var getHighestBucketWithWin = require('./record_against_rating_buckets_scrape');
var kamskyOrRecentWin = require('./Gamestats_Scrape');
var async = require('async');

// getUserInput //get USCF ID
// checkIfInDB // if not in database, add player info to database. 

// //if not in database:
// 	getHighestWin 
// 		getHighestBucket //needs USCF IF, returns highest ratings bucket with a win
// 		getFirstWin // returns true needs USCF ID and highest bucket
// 					// add this player to the database



// taking in USCF ID, check if any wins against Kamsky, if false return USCF ID of highest win




// var userInput //USCF ID, starting point
// var path = []; //Store array of USCF ID's
// var uscfId = userInput;
// while (uscfId !== kamskyId)
// 	getHighestWin(uscfId)
// 		var highestBucket = getHighestBucket(uscfId) //returns highest ratings bucket with win
// 		var firstWin = getFirstWin(uscfId, highestBucket) // returns true if there's a win vs kamsky, otherwise
// 															// returns USCF ID of most recent win
// 		if (firstWin !== true) {
// 			path.push(firstWin)
// 			uscfId = firstWin;
// 		}


var P = '12869413';
var ar = ['12869413'];

var scrapePage = function (PlayerID, callback1) {
	async.waterfall([
	    function(callback) {
	    	getHighestBucketWithWin(PlayerID, function(highestBucket) {
	    	callback(null, highestBucket)
	    	});
	    },
	    function( highestBucket, callback){
	        // arg1 now equals 'three'
	        kamskyOrRecentWin(PlayerID, highestBucket, function(recentWin){
			callback(null, recentWin);
			});
	    }
	], function (err, result) {
	   // result now equals 'done'  

	   //console.log(result);
	   ar.push(result);
	   callback1(result)
	});
};
function scrapeLoop (res) {
	return scrapePage(res)
};


var kamskyFound = false

async.whilst(
	function() { return !kamskyFound},
	function(callback) {
		var next = scrapePage(ar[ar.length-1], function(data) {
			kamskyFound = (next === true) ? true : false;
			callback(null, data)}
			)}

	, function (err, result) {
		console.log(result)
	}

	);
