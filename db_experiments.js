var mongoose = require('mongoose');
var dbModel = require('./mongo_mongoose_schema');

dbModel.find({
	uscfId: 12528459
}, function(err, docs) {
	'use strict';
	if (err) {
		mongoose.disconnect();
		return console.log('error finding');
	} else {
		mongoose.disconnect();
		return console.log(docs);
	}

});


