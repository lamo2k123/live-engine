var fs  = require('fs'),
    path= require('path');

var Components = function(manager) {
    if(!(this instanceof Components)) {
        return new Components(manager);
    }

    this.manager = manager;
    this.components = {
        length : 0
    };

    return {
        get : this.get.bind(this),
        add : this.add.bind(this),
        api : this.api.bind(this)
    }
};

Components.prototype.add = function(name) {
    if(name && !this.components[name]) {
        var dir     = path.join(__dirname, '..', '..', 'components', name),
            file    = path.join(dir, 'main.js'),
            status  = fs.existsSync(file);

        if(status) {
            this.components[name] = require(file);
            this.components.length++;
            return true;
        }

    }

    return false;
};

Components.prototype.get = function(name, app, engine) {
    if(name) {
        if(this.components[name]) {
            return this.components[name](app, engine);
        } else {
            if(this.add(name)) {
                return this.get(name, app, engine);
            }
        }
    }

    return false;
};

Components.prototype.api = function(name) {
    if(name && this.components[name]) {
        console.log(this.components[name]);
        return this.components[name].api;
    }

    return false;
};


module.exports = Components;