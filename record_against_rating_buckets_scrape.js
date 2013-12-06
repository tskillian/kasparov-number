var page = require('webpage').create();
var test;

page.open('http://main.uschess.org/datapage/gamestats.php?memid=12869413', function() {
  page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function() {
    var test = page.evaluate(function() {
      return $('.blog').siblings('table').children().children().eq(3).contents().eq(2).text();
    });
    console.log(test);
    phantom.exit();
  });
});