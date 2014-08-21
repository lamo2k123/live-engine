var engine = require('./protected/engine');

engine.manager.routes.get('/test', function(req, res, next) {
//	console.log(res);
	res.render('index.html', {test: '123'});
});

engine.server.start();

/*
var path        = require('path'),
    mongoose    = require('mongoose'),
    bodyParser  = require('body-parser'),
    engine      = require('./protected/engine');

var express = require('express'),
    app     = express();


app.set('dirname', __dirname);

app.set('views', path.join(engine.manager.configs.get('template').dir, engine.manager.configs.get('template').theme));
app.set('view engine', engine.manager.configs.get('template').engine);


mongoose.connect('mongodb://' + engine.manager.configs.get('db').hosts.join(',') + '/' + engine.manager.configs.get('db').database, {
    user : engine.manager.configs.get('db').username,
    pass : engine.manager.configs.get('db').password
});


app.use(engine.manager.modules.get('cookies').use);
app.use(engine.manager.modules.get('sessions').use);
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

engine.manager.components.get('layout', app, engine);
engine.manager.components.get('news', app, engine);
engine.manager.components.get('users', app, engine);



app.listen(8080);
console.log('Magic happens on port 8080');
*/
