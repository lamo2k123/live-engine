define([
	'backbone'
], function(
	Backbone
) {

	var Main = Backbone.View.extend({
		el : $('#header'),
		events: {
			'click #sign-up' 			    : 'eventSignUp',
			'click #sign-in' 			    : 'eventSignIn'
		},

		initialize: function() {

		},

		eventSignIn : function(e) {
			e && e.preventDefault();

			this.$el.find('#sign-in').addClass('selected');
			this.$el.find('#sign-up').removeClass('selected');

			return this;
		},

		eventSignUp : function(e) {
			e && e.preventDefault();

			this.$el.find('#sign-up').addClass('selected');
			this.$el.find('#sign-in').removeClass('selected');

			return this;
		}

	});

	return Main;
});