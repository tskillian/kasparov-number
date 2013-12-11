var page = require('webpage').create();
var player = 12710197;

page.open('http://www.uschess.org/datapage/gamestats.php?memid=' + player + '&dkey=2600&drill=G', function() {
    'use strict';
  page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function() {
    var playerObjects = page.evaluate(function() {
        var getPageData = function () {
    	var $table = $('.blog').siblings().find('tr');
    	var tableLength = $table.length;
    	console.log(tableLength);
    	var LW = [];
    	$table.each(function(i, element) {
            var $row = $(element);
    		var wl = $row.find('td').eq(7).text();
    		var pID = $row.find('td').eq(4).text();
            var player = new Object();
            player.winLoss = wl;
            player.playerID = pID;
    		LW.push(player);
        });
        return LW
    	};
        function isKamksy (array) {
            for (i = 0; i < array.length; i ++) {
                if (array[i]['playerID'] === '12528459' && array[i]['winLoss'] === 'W') { //if player beat Kamsky, return true
                    return true ;
                }
            }
            return false;
        };
        function highestWin (array) {
            for (i = 0; i < array.length; i ++) {
                if (array[i]['winLoss'] === 'W') {
                    return array[i]['playerID']; //return player object of first win
                }

            }
            return false;
        };

        var pageData = getPageData();

        if (isKamksy(pageData)) {
            return true;
        }
        else {
            return highestWin(pageData);
        }
    });
    console.log(playerObjects);
    phantom.exit();
  });
});





