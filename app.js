var express = require('express'),
    app     = express();

app.set('configs', {
	cookie : require('./configs/cookie.json')
});

app.set('dirname', __dirname);
app.set('config', require('./config.json'));




app.set('require', {
    'fs'            : require('fs'),
    'path'          : require('path'),
    'body-parser'   : require('body-parser'),
    'mongoose'      : require('mongoose'),
	'io'			: require('socket.io').listen(app.get('config').socket.port)
});


app.set('views', app.get('require')['path'].join(app.get('dirname'), app.get('config').template.dir, app.get('config').template.theme));
app.set('view engine', app.get('config').template.engine);


app.get('require').mongoose.connect('mongodb://' + app.get('config').db.hosts.join(',') + '/' + app.get('config').db.database, {
    user : app.get('config').db.username,
    pass : app.get('config').db.password
});

app.use(require('./protected/modules/cookies/index.js').use);
app.use(require('./protected/modules/sessions/index.js').use);

app.use(app.get('require')['body-parser'].urlencoded({extended : false}));
app.use(app.get('require')['body-parser'].json());



app.set('components-manager', require('./protected/engine/components-manager.js')(app));



app.listen(8080);
console.log('Magic happens on port 8080');
