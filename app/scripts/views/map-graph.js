/*global KasparovNumber, Backbone, JST*/

KasparovNumber.Views = KasparovNumber.Views || {};

(function () {
    'use strict';

    KasparovNumber.Views.MapGraphView = Backbone.View.extend({

        render : function () {
        	this.collection.each(function(model) {
                        KasparovNumber.nodeView = new KasparovNumber.Views.PlayerNodeView({
                                model:model
                        });
                
                this.$el.append(KasparovNumber.nodeView.render().el);
        },this);
         return this; 
     }

    });

})();