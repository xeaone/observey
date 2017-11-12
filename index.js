'use strict';

const Observer = require('./lib/observer');

const Observey = {};

Observey.observers = [];
Observey.observer = Observer;

Observey.create = function (options) {
	const observer = new this.observer(options);
	this.observers.push(observer);
	return observer;
};

module.exports = Observey;
