var page = require('webpage').create();
var playerObjects;
var kamsky = 12528459;

function getObjects(callback) {
page.open('http://www.uschess.org/datapage/gamestats.php?memid=12710197&dkey=2600&drill=G', function() {
  page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function() {
    playerObjects = page.evaluate(function() {
    	var table = $('.blog').siblings('table').children().children();
    	var tableLength = table.length
    	console.log(tableLength)
    	var LW = []
    	for (i = 2; i < tableLength; i ++) {
    		var wl = table.eq(i).contents().eq(7).text();
    		var pID = table.eq(i).contents().eq(4).text();
    		LW.push({winLoss : wl,
    				playerID : pID
    				})
    	}
    	return LW
    });
    console.log(playerObjects[0]);
    phantom.exit();
    callback( playerObjects );
  });
});
};

console.log(getObjects(isKamksy))

console.log(typeof playerObjects);

function isKamksy (array) {
	for (i = 0; i < array.length; i ++) {
		if (array[i][playerID] === kamsky && array[i][winLoss] === 'W') {
			return true
		}
	}
	return false
}

console.log('Hi')