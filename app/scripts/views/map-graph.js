/*global KasparovNumber, Backbone, JST*/

KasparovNumber.Views = KasparovNumber.Views || {};

(function () {
    'use strict';

    KasparovNumber.Views.MapGraphView = Backbone.View.extend({

        render : function {
        		this.$el.html('This is your course path ' + this.model.get('path'))
        		return this;
        	}

    });

})();