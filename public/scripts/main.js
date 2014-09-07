$(document).ready(function() {
	$('.uscfIdForm').submit(function (e) {
		e.preventDefault();
		var resultsDiv = $('.results');
		resultsDiv.empty();
		resultsDiv.append('<div>Calculating Path to Kasparov...</div>');
		resultsDiv.append('<span class="loadingSpinner"></span>');
		var uscfId = $('#uscfId').val();
		var uscfIdRegex = /^\d{8}$/;
		if (uscfIdRegex.test(uscfId)) {
			$.getJSON('/' + uscfId, function (data) {
				resultsDiv.empty();
				var delayBetweenResults = 400;
				if (data.length > 1) {
					for (var i = 1; i < data.length; i++) {
						var html = $('<div>' + data[i - 1].name + ' beat ' + data[i].name + '</div>');
						html.hide().delay((i + 1)* delayBetweenResults).appendTo(resultsDiv).fadeIn(1000);
					}
				} else {
					resultsDiv.empty();
					resultsDiv.append('<div>Something went wrong - Either no path could be found, or an invalid USCF ID was entered</div>');
				}
			});
		} else {
			resultsDiv.empty();
			resultsDiv.append('<div>Invalid USCF ID, please try again</div');
		}
	});
});