define([
	'backbone'
], function(
	Backbone
) {

	var Main = Backbone.Model.extend({

        defaults : {
            auth    : false,
            email   : ''
        },

		initialize: function() {


		}

	});

	return Main;
});