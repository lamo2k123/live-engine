var path    = require('path'),
    render  = require('connect-render');

var Render = function(engine) {
    if(!(this instanceof Render)) {
        return new Render(engine);
    }

    this.engine = engine;

    this._use();

    return {};

};

Render.prototype._use = function() {
    var config  = this.engine.manager.configs.get('template'),
        dir     = path.join(this.engine.get('#public'), config.dir, config.theme);

    this.engine.app.use(render({
        root    : dir,
        layout  : config.layout,
        viewExt : config.ext,
        cache   : config.cache/*,
        helpers: {
            sitename: 'connect-render demo site',
            starttime: new Date().getTime(),
            now: function (req, res) {
                return new Date();
            }
        }*/
    }));
};

module.exports = Render;