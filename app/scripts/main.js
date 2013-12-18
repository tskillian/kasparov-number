/*global require*/
'use strict';

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        }
    },
    paths: {
        jquery: '../bower_components/jquery/jquery',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore/underscore',
        bootstrap: 'vendor/bootstrap'
    }
});

require([
    'backbone',
    'routes/router',
    'collections/path',
    'views/map-graph'
], function (Backbone, Router, Collection, Views) {
    window.backboneApp.Router = new Router();
    new Views.MapGraphView({
            collection: new Collection.PathCollection()
        });
    Backbone.history.start();
    window.backboneApp.init();
});

window.backboneApp = {
    Models: {},
    Collections: {},
    Views: {},
    Router: {},
};
