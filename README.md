# Simplechart

## Build process

`$ npm run build` will compile both the App and Widget bundles, using the latest Git commit hash as a version.

_Don't use this_ during normal development. You'll only need to run Webpack if you're pushing a build to an implementation of Simplechart, e.g. its [WordPress plugin](https://www.github.com/alleyinteractive/wordpress-simplechart).

## Development mode

`$> npm start` then...

### App

The app is where you input data, select a chart type, set up options. Within an iframe, e.g. when used in the WordPress plugin, the app sends data to the parent window via postMessage for saving.

You can see the app at `http://localhost:8080/index.html`

### Widget

The widget recognizes Simplechart placeholder divs on a page, fetches data, and renders charts.

You can find widget examples at `http://localhost:8080/widget.html`

## Adding a new chart type

There are two components to each chart type in Simplechart: the React component itself and the data transformer function.

### Data transfomer

The data transformer function ingests the data and fields as they originally parsed from the CSV input, and attempts to transform it into the format required for the particular chart type. For example:

```
fruit,tastiness
apples,4.234
bananas,3.466
```
From this CSV input, the data transformer will receive the following data and fields arrays:
```
[
  {
    foo: "apples",
    bar: "4.234"
  },
  {
    foo: "bananas",
    bar: "3.466"
  }
]

['foo', 'bar']
```
The fields array is important because it reflects the order of original CSV columns, whereas the JS objects in the data array are unordered key-value pairs.

The output of the data transformer should be a data structure that your chart type will recognize, or `false` if the data is not compatible with your chart type. For a `PieChart` our data transformer would output:
```
[
  {
    label: "apples",
    value: 4.234
  },
  {
    label: "bananas",
    value: 3.466
  }
]
```
Note that our transformer changed the keys to `label` and `value`, and the values from strings to numbers.

### React component

see the examples in `app/components/Chart/ChartTypes/`, TK TK
