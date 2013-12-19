/*global KasparovNumber, Backbone, JST*/

KasparovNumber.Views = KasparovNumber.Views || {};

(function () {
    'use strict';

    KasparovNumber.Views.MapGraphView = Backbone.View.extend({

        template: JST['app/scripts/templates/map-graph.ejs']

    });

})();