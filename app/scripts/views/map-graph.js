/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'templates'
], function ($, _, Backbone, JST) {
    'use strict';

    var MapGraphView = Backbone.View.extend({
        template: JST['app/scripts/templates/map-graph.ejs']
    });

    return MapGraphView;
});
