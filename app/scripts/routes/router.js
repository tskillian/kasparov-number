/*global KasparovNumber, Backbone*/

KasparovNumber.Routers = KasparovNumber.Routers || {};

(function () {
    'use strict';

    KasparovNumber.Routers.MainrouterRouter = Backbone.Router.extend({
    	routes: {
    		"search/:uID" : "SearchUser",
    		"about" : "About"
    	},
    	SearchUser : function(uID) {
    		KasparovNumber.pathCollection = new KasparovNumber.Collections.PathCollection();
    		KasparovNumber.pathCollection.create({uscfID:uID});

    		KasparovNumber.pathCollection.fetch({
    			success: function () {
    				var path = KasparovNumber.pathCollection;
    				KasparovNumber.graphView = new KasparovNumber.Views.MapGraphView({
    					collection: path
    				})
    				$('#GraphView').append(KasparovNumber.graphView.render().el)
    			}
    		})
    	},
    	About : function() {
    		$('.jumbotron').html('');
    		$('#home').removeClass();
    		$('.jumbotron').append(aboutPage);
    		$('#about').addClass('active');
    	}
    });

KasparovNumber.router = new KasparovNumber.Routers.MainrouterRouter();
Backbone.history.start({root: "/"})
})();

var aboutPage = '<div id="gitList"><h2>This project brought to you by:</h2><p><ul><li><a href="https://github.com/smitabusar">smitabusar</a> </li><li><a href="https://github.com/tskillian">tskillian</a> </li><li><a href="https://github.com/pollackaaron">pollackaaron</a> </li></ul></p></div>'