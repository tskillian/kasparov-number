/*global KasparovNumber, Backbone, JST*/

KasparovNumber.Views = KasparovNumber.Views || {};

(function () {
    'use strict';

    KasparovNumber.Views.PlayerNodeView = Backbone.View.extend({
    	tagName: 'p',
        render : function () {
        		this.$el.html('Chess Player: ' + this.model.get("name"))
        		return this;
        	}

    });

})();