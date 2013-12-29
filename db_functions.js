var mongoose = require('mongoose');
var playersModel = require('./mongo_mongoose_schema');

var isUscfIdInDatabase = function(uscfId, callback) {
	'use strict';
	playersModel.find({
		uscfId: uscfId
	}, function(err, docs) {
		mongoose.disconnect();
		if (err) {
			return console.log(err);
		} else {
			if (docs.length > 0) {
				callback(null, true);
			} else {
				callback(null, false);
			}
		}

	});
};

//This is based on profile page, probably not useful
var addPlayerToDatabase = function(profile, callback) {
	'use strict';
	var player = new playersModel({
		name: profile.name,
		uscfId: parseInt(profile.uscfID, 10),
		location: profile.State
	});
	player.save(function (err) {
		if (err) {
			throw 'error when trying to save player';
		} else {
			callback();
		}
	});
};

module.exports = isUscfIdInDatabase;

// var me = {
// 	uscfID: '12869413',
// 	name: 'TIMOTHY S KILLIAN',
// 	RegularRating: '1898 on 2013-11',
// 	OverallRanking: '3856(T) out of 54597',
// 	State: 'IA'
// };

// addToDatabase(me, function() {console.log('complete');})


// isUscfIdInDatabase('12528459', function(err, data) {
// 	console.log(data);
// });











