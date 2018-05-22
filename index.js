'use strict';

const Fs = require('fs');
const Util = require('util');
const Path = require('path');
const Events = require('events');

const Stat = Util.promisify(Fs.stat);
const ReadFolder = Util.promisify(Fs.readdir);

module.exports = class Observey extends Events {

	constructor (options) {
		super();

		options = options || {};

		this.path = options.path;

		this.last = '';
		this.watchers = [];
		this.stamp = Date.now();
	}

	error (error) {
		this.emit('error', error);
	}

	change (path, type, name) {
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

	}

	async handleWatch (path) {
		this.watchers.push([
			path,
			Fs.watch(
				path,
				this.change.bind(this, path)
			)
		]);
	}

	async handleChild (path) {
		let stat;

		try {
			stat = await Stat(path);
		} catch (error) {
			return this.error(error);
		}

	 	if (stat.isDirectory()) {
			await this.open(path);
		}

	}

	async handleChildren (path) {
		let paths;

		try {
			paths = await ReadFolder(path, 'utf8');
		} catch (error) {
			return this.error(error);
		}

		for (let i = 0, l = paths.length; i < l; i++) {
			await this.handleChild(Path.join(path, paths[i]));
		}

	}

	async open (path) {
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

	}

	async close () {
		const watchers = this.watchers;

		for (const watcher of watchers) {
			watcher[1].close();
		}
	}

}
