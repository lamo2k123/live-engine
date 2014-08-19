module.exports = function(app) {

	var Sessions = function() {
        this.oStore = {
            length : 0
        };

		return {
			name: 'Sessions',
			api	: {
                add     : this.add.bind(this),
                has     : this.has.bind(this),
                get     : this.get.bind(this),
                remove  : this.remove.bind(this)
			}
		};

	};

    Sessions.prototype.add = function(sId, oData) {
        if(sId && oData && !this.oStore[sId]) {
            this.oStore[sId] = oData;
            this.oStore.length++;
            return true;
        } else {
            return false;
        }
    };

    Sessions.prototype.remove = function(sId) {
        if(sId && this.oStore[sId]) {
            delete this.oStore[sId];
            this.oStore.length--;
            return true;
        } else {
            return false;
        }
    };

    Sessions.prototype.has = function(sId) {
        return (sId && this.oStore[sId]);
    };

    Sessions.prototype.get = function(sId) {
        console.log(sId && this.oStore[sId]);
        return sId && this.oStore[sId];
    };

    return new Sessions();
};
