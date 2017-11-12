[Star Issue Watch](https://github.com/AlexanderElias/observey)

# Observey
**A file/folder system observer/watcher**

### Overview
Watches and observes files and folders.

## Example
```js
const Observey = require('observey');

const observer = Observey.create({
	path: '/path/to/file/or/folder'
});

observer.on('change', function (path) {
	console.log(`change: ${path}`);
});

await observer.open();
```

## API

### Observey.observers
Returns an Array of Observers.

### Observey.create(options)
Creates and returns a Observer. Adds the Observer to the Observey.observers Array.
- `options: Object`
	- `path: String` Path to file or folder

### Observey.observer
Returns class Observer.
- `on: Function` Emitter
	- `error: String` Event emitted on error
	- `add: String` Event emitted on file/folder addtion
	- `change: String` Event emitted on file/folder change
	- `remove: String` Event emitted on file/folder removal
	- `modify: String` Event emitted on file/folder modification (add, change, remove)

## Authors
[AlexanderElias](https://github.com/AlexanderElias)

## License
[Why You Should Choose MPL-2.0](http://veldstra.org/2016/12/09/you-should-choose-mpl2-for-your-opensource-project.html)
This project is licensed under the MPL-2.0 License
