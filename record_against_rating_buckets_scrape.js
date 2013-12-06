var page = require('webpage').create();

// helper function to go through an array of objects with bucket and wins property, finding
// the highest bucket with a win
var 

page.open('http://main.uschess.org/datapage/gamestats.php?memid=12869413', function() {
	page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function() {
		var wins = page.evaluate(function() {
			var rows = [];
			$('.blog').siblings().find('tr').each(function(i, element) {
				var $row = $(element);
				rows.push({
					bucket: $row.find('td').eq(0).text(),
					wins: $row.find('td').eq(2).text()
				});
			});
			return rows;
		});
		console.log(wins);
		phantom.exit();
	});
});

