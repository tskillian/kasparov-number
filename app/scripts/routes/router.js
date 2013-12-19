/*global KasparovNumber, Backbone*/

KasparovNumber.Routers = KasparovNumber.Routers || {};

(function () {
    'use strict';

    KasparovNumber.Routers.MainrouterRouter = Backbone.Router.extend({
    	routes: {
    		"search/:uID" : "SearchUser"
    	},
    	SearchUser : function(uID) {
    		KasparovNumber.pathCollection = new KasparovNumber.Collections.PathCollection();
    		KasparovNumber.pathCollection.create({uscfID:uID});

    		KasparovNumber.pathCollection.fetch({
    			success: function () {
    				var path = KasparovNumber.pathCollection;
    				
    			}
    		})
    	}
    });

KasparovNumber.router = new KasparovNumber.Routers.MainrouterRouter();
Backbone.history.start({root: "/"})
})();

