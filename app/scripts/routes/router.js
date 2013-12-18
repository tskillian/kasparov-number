/*global define*/

define([
    'jquery',
    'backbone'
], function ($, Backbone) {
    'use strict';

    var RouterRouter = Backbone.Router.extend({
        routes: {
        	"search/:uID" : "userSearch",
        },

    userSearch : function (uID) {
    	alert(uID);
    }

    });

    return RouterRouter;


});
