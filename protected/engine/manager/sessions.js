
var Sessions = function(manager) {
    if(!(this instanceof Sessions)) {
        return new Sessions(manager);
    }

    this.manager = manager;
    this.unique = 0;
    this.store = {
        length : 0
    };

    return {
        get : this.get.bind(this),
        add : this.add.bind(this),
        has : this.has.bind(this)
    }
};

Sessions.prototype.get = function(sid) {
    return sid && this.store[sid];
};

Sessions.prototype.has = function(sid) {
    return (sid && this.store[sid]);
};

Sessions.prototype.add = function(sid, data) {
    if(sid && data && !this.store[sid]) {
        this.store[sid] = data;
        this.store.length++;
        return true;
    } else {
        return false;
    }
};

Sessions.prototype.remove = function(sid) {
    if(sid && this.store[sid]) {
        delete this.store[sid];
        this.store.length--;
        return true;
    } else {
        return false;
    }
};

module.exports = Sessions;