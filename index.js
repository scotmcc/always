module.exports = (function() {

	function Promise () {

		var complete = false;
		var successful = false;
		var success = [];
		var failure = [];
		var always = [];
		var watchers = [];
		var error, result;

		this.done = function(fun) {
			if (typeof fun !== 'function') {
				throw new Error('Parameter must be a function.');
			}
			var i = success.indexOf(fun);
			if (i === -1) {
				success.push(fun);
			}
			if (complete && successful) {
				fun.call(null, result);
			}
			return this;
		};

		this.fail = function(fun) {
			if (typeof fun !== 'function') {
				throw new Error('Parameter must be a function.');
			}
			var i = failure.indexOf(fun);
			if (i === -1) {
				failure.push(fun);
			}
			if (complete && !successful) {
				fun.call(null, error);
			}
			return this;
		};

		this.always = function(fun) {
			if (typeof fun !== 'function') {
				throw new Error('Parameter must be a function.');
			}
			var i = always.indexOf(fun);
			if (i === -1) {
				always.push(fun);
			}
			if (complete) {
				fun.call(null, successful ? result : error);
			}
			return this;
		};

		this.watch = function(fun) {
			if (typeof fun !== 'function') {
				throw new Error('Parameter must be a function.');
			}
			var i = watchers.indexOf(fun);
			if (i === -1) {
				watchers.push(fun);
			}
			if (complete) {
				fun.call(null, successful ? result : error);
			}
			return this;
		};

		this.resolved = function(res) {
			complete = true;
			successful = true;
			result = res;
			for (var i = 0; i < success.length; i++) {
				success[i].call(null, result);
			}
			for (var i = 0; i < always.length; i++) {
				always[i].call(null, result);
			}
			return this;
		};

		this.failed = function(err) {
			complete = true;
			successful = false;
			error = err;
			for (var i = 0; i < failure.length; i++) {
				failure[i].call(null, error);
			}
			for (var i = 0; i < always.length; i++) {
				always[i].call(null, error);
			}
		};

		this.progress = function(mes) {
			message = mes;
			for (var i = 0; i < watchers.length; i++) {
				watchers[i].call(null, message);
			}
		};

		return this;

	}

	if (process.argv[1] === __filename && process.argv[2] === 'watch') {
		var x = {
			foo: 'bar'
		};

		Promise.call(x);

		x.watch(function(message) {
			console.log(message);
		});

		x.progress('0%');
		x.progress('25%');
		x.progress('50%');
		x.progress('75%');
		x.progress('100%');

		x.watch(function(message) {
			console.log(message);
		});
	}

	if (process.argv[1] === __filename && process.argv[2] === 'test') {
		var x = new Promise();
		var y = new Promise();
		var result = "GOOD!";
		var error = "BAD!";
		var done = function (result) {
			console.log('Promise executed successfully', result);
		};
		var fail = function (error) {
			console.log('Promise execution failure', error);
		};
		var always = function (info) {
			console.log('Promise complete', info);
		};
		var past = function(info) {
			console.log('Always added to completed promise', info);
		};
		x.done(done).fail(fail).always(always);
		y.done(done).fail(fail).always(always);
		x.resolved('GOOD!');
		y.failed('BAD!');
		x.always(past);
		y.always(past);
	}

    return {
    	Promise: Promise
    };

}());