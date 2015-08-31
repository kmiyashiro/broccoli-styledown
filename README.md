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

var outputTree = compileStyledown(inputTrees, options)
```

* **`inputTrees`**: An array of trees that act as the include paths for
  less. If you have a single tree, pass `[tree]`.
* **`options`**: A hash of options for [broccoli-caching-writer](https://github.com/ember-cli/broccoli-caching-writer#options). Default:
  ```js
  {
    filterFromCache: {
      include: [/(less|css|sass|scss|styl|md)$/],
    }
  }
  ```
  * **`outputFile`**: File to output generated styleguide HTML.
  * **`styledown`**: A hash of options for [`Styledown.parse`](https://github.com/styledown/styledown/blob/master/index.js)

## Development

### Tests

```bash
npm install
npm test
```

## License

MIT
