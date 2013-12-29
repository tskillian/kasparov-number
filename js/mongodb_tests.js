var mongodb = require('mongodb'),
	MongoClient = mongodb.MongoClient;

MongoClient.connect('mongodb://heroku:0d2b9433a5dc0f6bacd6bdc8ed1e7e2f@linus.mongohq.com:10010/app20265546', function(err, db) {
	console.log(db.collection('players'));
});