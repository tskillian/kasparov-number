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
                    $('#GraphView').append(KasparovNumber.graphView.render().el)
                    var url;
                    var locationData = {};
                    var data = path.toJSON();
                    console.log(data);
                    // var data = [{
                    //     name: 'Tim Killian',
                    //     state: 'IA'
                    // }, {
                    //     name: 'Kamsky',
                    //     state: 'NY'
                    // }];
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
                                }
                            });
                        });
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