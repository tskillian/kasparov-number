/*global KasparovNumber, Backbone*/

KasparovNumber.Routers = KasparovNumber.Routers || {};

(function() {
    'use strict';

    KasparovNumber.Routers.MainrouterRouter = Backbone.Router.extend({
        routes: {
            "search/:uID": "SearchUser",
            "about": "About"
        },
        SearchUser: function(uID) {
            KasparovNumber.pathCollection = new KasparovNumber.Collections.PathCollection();
            KasparovNumber.pathCollection.create({
                uscfID: uID
            });

            KasparovNumber.pathCollection.fetch({
                success: function() {
                    var path = KasparovNumber.pathCollection;
                    KasparovNumber.graphView = new KasparovNumber.Views.MapGraphView({
                        collection: path
                    })
                    $('#jumpsTitle').css('display', 'block');
                    $('#GraphView').append(KasparovNumber.graphView.render().el);
                    var url;
                    var locationData = {};
                    var data = path.toJSON();
                    console.log(data);
                    function initialize() {
                        var mapOptions = {
                            center: new google.maps.LatLng(41.8780025, -93.097702),
                            zoom: 4
                        };
                        var map = new google.maps.Map(document.getElementById("map-canvas"),
                            mapOptions);
                        data.forEach(function(element) {
                            url = 'http://maps.googleapis.com/maps/api/geocode/json?address=+' + element.State + '&sensor=false';

                            $.ajax({
                                dataType: "json",
                                url: url,
                                success: function(data) {
                                    console.log(data.results[0].geometry.location);
                                    locationData[element.State] = data.results[0].geometry.location;
                                    var marker = new google.maps.Marker({
                                        position: new google.maps.LatLng(data.results[0].geometry.location.lat, data.results[0].geometry.location.lng),
                                        map: map,
                                        title: element.name
                                    });
                                var message = ("<p>Name: " + element.name + '<br>' +
                                				"Regular Rating: " + element.RegularRating + '<br>' +
                                				"Overall Ranking: " + element.OverallRanking + '<br>' +
                                				"State: " + element.State + "</p>")
                                addInfoWindow(marker, message);
                                }
                            });
                        });
						function addInfoWindow(marker, message) {
							var info = message;

							var infoWindow = new google.maps.InfoWindow({
								content: message
							});

							google.maps.event.addListener(marker, 'click', function() {
								infoWindow.open(map, marker);
							});
						}
                    };

                    initialize();
                }
            })
        },
        About: function() {
            $('.jumbotron').html('');
            $('#home').removeClass();
            $('.jumbotron').append(aboutPage);
            $('#about').addClass('active');
        }


    });


    KasparovNumber.router = new KasparovNumber.Routers.MainrouterRouter();
    Backbone.history.start({
        root: "/"
    });
})();
var aboutPage = '<div id="gitList"><h2>This project brought to you by:</h2><p><ul><li><a href="https://github.com/smitabusar">smitabusar</a> </li><li><a href="https://github.com/tskillian">tskillian</a> </li><li><a href="https://github.com/pollackaaron">pollackaaron</a> </li></ul></p></div>'