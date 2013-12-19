/*global KasparovNumber, Backbone*/

KasparovNumber.Models = KasparovNumber.Models || {};

(function () {
    'use strict';

    KasparovNumber.Models.UserModel = Backbone.Model.extend({
		uscfID: null,
  		name: null,
  		RegularRating: null,
  		OverallRanking: null,
  		State: null
    });

})();