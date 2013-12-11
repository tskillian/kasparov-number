var page = require('webpage').create();
//var userId=12869413;
var userId=12528459;
page.open('http://www.uschess.org/msa/MbrDtlMain.php?' + userId, function(status) {
	if (status!="success"){
		console.log(status);
	}
	
  	page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function() {

		var test = page.evaluate(function(s) {
			var user={};
			//extracting USCF ID & name
			var tmp = $(".topbar-middle b").html();
			tmp=tmp.split(":");
			user.uscfID=tmp[0]; //tmp.slice(0, tmp.indexOf(":")); alternate to using split
			user.name=tmp[1].trim() //tmp.slice(tmp.indexOf(":")+2);

			//extracting other details using regex
			var mainContent=$(".topbar-middle table")[3];
			var tmpTD = $(mainContent).find("tr:contains('Regular Rating') td")[1]; 
			//matches 0000 for rating & 0000-00 for year & month
			user.regularRating = $(tmpTD).html().match(/\d{4}/) + " on " + $(tmpTD).html().match(/\d{4}-\d{2}/); 
			tmpTD = $(mainContent).find("tr:contains('Overall Ranking') td")[1];
			//matches rank 1-4 digits + (T) or not + out of + 5 digits (?:.T.) ensures .T. is not returned
			user.overallRanking =$(tmpTD).html().match(/\d{1,4}(?:.T.)? out of \d{5}/);
			tmpTD = $(mainContent).find("tr:contains('State') td")[4];
			//matches 2 uppercase characters
			user.state = $(tmpTD).html().match(/[A-Z]{2}/);
			tmpTD = $(mainContent).find("tr:contains('FIDE Title') td")[1];
			//.*? matches between > & < follwed by replacing < & >.	
			user.fideTitle = (tmpTD!== undefined) ? $(tmpTD).html().match(/>.*?</)[0].replace(/</,"").replace(/>/,"").trim():"";
			return user;
		});
		console.log(test.uscfID + "," + test.name);
		console.log(test.regularRating + "," + test.overallRanking);
		console.log(test.state + "," + test.fideTitle);
		phantom.exit();
  	});
});

