# broccoli-styledown

Broccoli plugin for generating styleguide HTML with [Styledown](https://github.com/styledown/styledown)


This code is based heavily on
[broccoli-less-single](https://github.com/gabrielgrant/broccoli-less-single)

## Installation

```bash
npm install --save-dev broccoli-styledown
```

## Usage

```js
var compileStyledown = require('broccoli-styledown');

var outputTree = compileStyledown(inputTree, options)
```

* **`inputTree`**: An array of a single tree, `['./styles']`. Only CSS-like files will be read. Multiple tree support is possible but not implemented.
* **`options`**: Hash of options
  * **`configMd`**: Styledown config markdown file. Path relative to root.
  * **`destFile`**: File to output generated styleguide HTML in build directory.
  * **`styledown`**: A hash of options for [`Styledown.parse`](https://github.com/styledown/styledown/blob/master/index.js)

`options` can also include options for [broccoli-caching-writer](https://github.com/ember-cli/broccoli-caching-writer#options). Default:
```js
{
  filterFromCache: {
    include: [/(less|css|sass|scss|styl|md)$/],
  }
}
```

## Development

### Tests

```bash
npm install
npm test
```

## License

MIT
