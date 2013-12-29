var mongoose = require('mongoose');
var myMongoDb = require('./priv_mongo_info');
mongoose.connect(myMongoDb);
var playerSchema = mongoose.Schema({
	name: String,
	location: String,
	fideId: {
		type: Number,
		index: true
	},
	uscfId: {
		type: Number,
		index: true
	},
	fideRating: Number,
	uscfRating: Number,
	kasparovNumber: Number,
	wins: [{
		name: String,
		uscfId: Number,
		fideId: Number,
		fideRating: Number,
		uscfRating: Number,
		kasparovNumber: Number,
	}],
	losses: [{
		name: String,
		uscfId: Number,
		fideId: Number,
		fideRating: Number,
		uscfRating: Number,
		kasparovNumber: Number,
	}],
	draws: [{
		name: String,
		uscfId: Number,
		fideId: Number,
		fideRating: Number,
		uscfRating: Number,
		kasparovNumber: Number,
	}]
});

module.exports = mongoose.model('Player', playerSchema);