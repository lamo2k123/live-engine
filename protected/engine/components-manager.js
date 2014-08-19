module.exports = function(app){

    var ComponentsManager = function() {
        this.dir = app.get('require')['path'].join(app.get('dirname'), app.get('config').dir.protected, app.get('config').dir.components);
        this.components = {};

        this.loaded();
    };

    ComponentsManager.prototype.loaded = function(){
        app.get('require')['fs'].readdir(this.dir, this._readdir.bind(this));

        return this;
    };

    ComponentsManager.prototype._readdir = function(error, files) {
        if(!error) {
            for(var i in files) {
                var dir = app.get('require')['path'].join(this.dir, files[i]);
                app.get('require')['fs'].stat(dir, this._stat.bind(this, dir));
            }
        } else {
            console.log('_readdir', error);
        }

        return this;
    };

    ComponentsManager.prototype._stat = function(dir, error, stat) {
        if(!error) {
            if(stat.isDirectory()) {
                var main = app.get('require')['path'].join(dir, app.get('config').component.main);
                app.get('require')['fs'].exists(main, this._exists.bind(this, main));
            }
        } else {
            console.log('_stat', error);
        }

        return this;
    };

    ComponentsManager.prototype._exists = function(main, exists) {
        if(exists) {
            var component = require(main)(app);
            this.components[component.name] = component.api;
        }

        return this;
    };

    ComponentsManager.prototype.getApi = function(component) {
        if(component && this.components[component]) {
            return this.components[component];
        }

        return false;
    };

    return new ComponentsManager(app)
};
