
'use strict';

const Path = require('path');
const Observey = require('../index');

(async function () {
	try {

		const observer = Observey.create({
			path: Path.join(__dirname, 'dev')
		});

		observer.on('error', function (error) {
			console.log(error);
		});

		observer.on('change', function (path) {
			console.log(`change: ${path}`);
		});

		observer.on('add', function (path) {
			console.log(`add: ${path}`);
		});

		observer.on('remove', function (path) {
			console.log(`remove: ${path}`);
		});

		await observer.open();

	} catch (e) {
		console.log(e);
	}
}());
