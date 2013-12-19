/*global KasparovNumber, Backbone, JST*/

KasparovNumber.Views = KasparovNumber.Views || {};

(function () {
    'use strict';

    KasparovNumber.Views.PlayerNodeView = Backbone.View.extend({
    	tagName: 'li',
        render : function () {
        		this.$el.html(this.model.get("name"))
        		return this;
        	}

    });

})();