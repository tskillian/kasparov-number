/*global KasparovNumber, Backbone, JST*/

KasparovNumber.Views = KasparovNumber.Views || {};

(function () {
    'use strict';

    KasparovNumber.Views.MapGraphView = Backbone.View.extend({

        render : function () {
        	var count = 1;
        	this.collection.each(function(model) {
                        KasparovNumber.nodeView = new KasparovNumber.Views.PlayerNodeView({
                                model:model
                        });
                count += 1
                this.$el.append(KasparovNumber.nodeView.render().el);
        },this);
         return this; 
     }

    });

})();