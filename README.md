
# Observey
A file/folder system observer/watcher

### Overview
Watches and observes files and folders.

## Example
```js
const Observey = require('observey');

const observer = new Observey({
	path: '/path/to/file/or/folder'
});

observer.on('change', function (path) {
	console.log(`change: ${path}`);
});

await observer.open();
```

## API

### Observey
Creates and returns a Observey class.

- `options: Object`
	- `path: String` Path to file or folder
	
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
