var express = require('express'),
	session	= require('express-session'),
    app     = express();

app.set('dirname', __dirname);
app.set('config', require('./config.json'));


app.set('require', {
    'fs'            : require('fs'),
    'path'          : require('path'),
    'body-parser'   : require('body-parser'),
	'cookie-parser' : require('cookie-parser'),
    'mongoose'      : require('mongoose'),
	'passport'		: require('passport'),
	'io'			: require('socket.io').listen(app.get('config').socket.port)
});

app.set('views', app.get('require')['path'].join(app.get('dirname'), app.get('config').template.dir, app.get('config').template.theme));
app.set('view engine', app.get('config').template.engine);


app.get('require').mongoose.connect('mongodb://' + app.get('config').db.hosts.join(',') + '/' + app.get('config').db.database, {
    user : app.get('config').db.username,
    pass : app.get('config').db.password
});

app.use(app.get('require')['body-parser'].urlencoded({extended : false}));
app.use(app.get('require')['body-parser'].json());
app.use(app.get('require')['cookie-parser']());
app.use(session({
	secret: 'SECRET',
	resave: true,
	saveUninitialized: true
}));

app.use(app.get('require')['passport'].initialize());
app.use(app.get('require')['passport'].session());




require('./protected/engine/components-manager.js')(app);


app.listen(8080);
console.log('Magic happens on port 8080');