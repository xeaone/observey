'use strict';

const Events = require('events');
const Path = require('path');
const Util = require('util');
const Fs = require('fs');

const Stat = Util.promisify(Fs.stat);
const ReadFolder = Util.promisify(Fs.readdir);

function Observer (options) {
	options = options || {};

	Events.EventEmitter.call(this);

	this.path = options.path;

	this.last = '';
	this.watchers = [];
	this.stamp = Date.now();
}

Observer.prototype = Object.create(Events.EventEmitter.prototype);
Observer.prototype.constructor = Observer;

Observer.prototype.error = function (error) {
	this.emit('error', error);
};

Observer.prototype.change = function (path, type, name) {
	path = Path.join(path, name);

	if (type === 'change') {
		if (path !== this.last) {
			this.last = path;
			this.stamp = Date.now();
			this.emit('change', path);
			this.emit('modify', path);
		} else if (this.stamp < Date.now()-300) {
			this.last = path;
			this.stamp = Date.now();
			this.emit('change', path);
			this.emit('modify', path);
		}
	} else if (type === 'rename') {
		if (Fs.existsSync(path)) {
			this.emit('add', path);
			this.emit('modify', path);
		} else {
			this.emit('remove', path);
			this.emit('modify', path);
		}
	}

};

Observer.prototype.handleWatch = async function (path) {
	this.watchers.push([
		path,
		Fs.watch(
			path,
			this.change.bind(this, path)
		)
	]);
};

Observer.prototype.handleChild = async function (path) {
	let stat;

	try {
		stat = await Stat(path);
	} catch (error) {
		return this.error(error);
	}

 	if (stat.isDirectory()) {
		await this.open(path);
	}

};

Observer.prototype.handleChildren = async function (path) {
	let paths;

	try {
		paths = await ReadFolder(path, 'utf8');
	} catch (error) {
		return this.error(error);
	}

	for (let i = 0, l = paths.length; i < l; i++) {
		await this.handleChild(Path.join(path, paths[i]));
	}

};

Observer.prototype.open = async function (path) {
	let stat;

	path = path || this.path;

	try {
		stat = await Stat(path);
	} catch (error) {
		return this.error(error);
	}

	if (stat.isDirectory()) {
		await this.handleWatch(path);
		await this.handleChildren(path);
	} else if (stat.isFile()) {
		await this.handleWatch(path);
	}

};

Observer.prototype.close = async function () {
	for (let i = 0, l = this.watchers.length; i < l; i++) {
		this.watchers[i][1].close();
	}
};

module.exports = Observer;
