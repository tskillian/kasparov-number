/*global KasparovNumber, Backbone*/

KasparovNumber.Collections = KasparovNumber.Collections || {};

(function () {
    'use strict';

    KasparovNumber.Collections.PathCollection = Backbone.Collection.extend({

        model: KasparovNumber.Models.PathModel

    });

})();
