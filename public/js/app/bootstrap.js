require.config({
	baseUrl: 'js',
	paths: {
        domReady    : 'lib/requirejs/domReady',
        i18n        : 'lib/requirejs/i18n',

		jquery		: 'lib/jquery/jquery-2.1.1.min',
		underscore	: 'lib/lodash/lodash.underscore.min',
		io 			: 'lib/socket.io/socket.io-1.0.6',
		backbone	: 'lib/backbonejs/backbone-min',
        lang        : 'app/i18n/ru'/*
		loader		: 'app/loader',
		router	: 'app/router'*/
	},
	deps : [
		'app/components/sign/main',
		'app/components/header/main',
//		'app/components/overlay/main'
	],
	callback : function(Sign, Header, Overlay) {
		new Header();
//		new Overlay();
		new Sign();

	}
});