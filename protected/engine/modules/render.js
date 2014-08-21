var render = require('connect-render');

var Render = function(engine) {
    if(!(this instanceof Render)) {
        return new Render(engine);
    }

    this.engine = engine;

    this._use();

    return {};

};

Render.prototype._use = function() {
    this.engine.app.use(render({
        root: './public/templates/default',
        layout: 'layout.html',
        cache: true, // `false` for debug
        helpers: {
            sitename: 'connect-render demo site',
            starttime: new Date().getTime(),
            now: function (req, res) {
                return new Date();
            }
        }
    }));
};

module.exports = Render;