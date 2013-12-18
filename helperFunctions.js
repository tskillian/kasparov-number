var isKamksy = function(playerList) {
    for (var i = 0; i < array.length; i++) {
        if (playerList[i]['playerID'] === '12528459' && playerList[i]['winLoss'] === 'W') { //if player beat Kamsky, return true
            return true;
        }
    }
    return false;
};

var getWinByIndex = function(playerList, winIndex) {
    'use strict';
    if (winIndex >= playerList.length) {
        throw 'Win index out of bounds on getWinByIndex function';
    } else {
        winIndex = winIndex || 0;
        return playerList[winIndex];
    }
};

var getWinsArray = function(PlayerID) {
    'use strict';
    async.waterfall([
        function(callback) {
            getHighestBucketWithWin(PlayerID, function(highestBucket) {
                callback(null, highestBucket);
            });
        },
        function(highestBucket, callback) {
            kamskyOrRecentWin(PlayerID, highestBucket, function(recentWin) {
                callback(null, recentWin);
            });
        }
    ], function(err, result) {
        if (isKamsky(result) {
            return '12528459'
        }

    });
};

var getNextId = function(playerId) {
    var highetBucket = getHighestBucket(playerId);

}