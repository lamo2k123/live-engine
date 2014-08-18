require.config({
	baseUrl: 'js',
	paths: {
        domReady    : 'lib/requirejs/domReady',

		jquery		: 'lib/jquery/jquery-2.1.1.min',
		underscore	: 'lib/lodash/lodash.underscore.min',
		io 			: 'lib/socket.io/socket.io-1.0.6',
		backbone	: 'lib/backbonejs/backbone-min',
        lang        : 'app/i18n/ru'/*
		loader		: 'app/loader',
		router	: 'app/router'*/
	},
	deps : [
		'app/components/users/main',
		'app/components/header/main',
		'app/components/overlay/main'
	],
	callback : function(Users, Header, Overlay) {
		new Header();
		new Overlay();
		new Users();

	}
});