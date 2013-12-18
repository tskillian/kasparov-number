/*global define*/

define([
	'underscore',
	'backbone'
], function(_, Backbone) {
	'use strict';

	var UserModel = Backbone.Model.extend({
		defaults: function() {
			return {
				uscfID: null,
				name: null,
				RegularRating: null,
				OverallRanking: null,
				State: null,
				FIDETitle: null
			}
		}
	});

	return UserModel;
});
