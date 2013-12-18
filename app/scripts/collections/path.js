/*global define*/

define([
    'underscore',
    'backbone',
    'models/user'
], function (_, Backbone, UserModel) {
    'use strict';

    var PathCollection = Backbone.Collection.extend({
        model: UserModel,
        url : '/search'
    });

    return PathCollection;
});
