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

var outputTree = compileStyledown([inputTrees], options)
```

* **`inputTree`**: An array of nodes, `['styles', 'styleguide']`. Only CSS-like files and your config MD file will be passed to Styledown.
* **`options`**: Hash of options
  * **`configMd`**: (Default: `config.md`) Styledown config markdown file. Path relative to any inputNode. *NOTE*: If there are multiple config files with the same name in different inputNodes, bad things will probably happen.
  * **`destFile`**: File to output generated styleguide HTML in build directory.
  * **`styledown`**: A hash of options for [`Styledown.parse`](https://github.com/styledown/styledown/blob/master/index.js)

## Development

### Tests

```bash
npm install
npm test
```

## License

MIT
