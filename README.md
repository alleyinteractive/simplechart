# Simplechart

## Build process

`$ npm run build` will compile both the App and Widget bundles, using the latest Git commit hash as a version.

_Don't use this_ during normal development. You'll only need to build if you're pushing to an implementation of Simplechart, e.g. its [WordPress plugin](https://www.github.com/alleyinteractive/wordpress-simplechart).

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

## Embedding charts

Embedded charts can retrieve data either from a URL or local variable. The data structure for an embed is:

```
{
  data: [ /* Array w/ chart data */ ],
  options: { /* Object w/ chart options */ },
  metadata: { // Strings for title, caption, credit
    title: '',
    caption: '',
    credit: ''
  }
}
```

The widget "template" consists of a containing element which requires:

* `id` attribute used internally by the Redux store to identify the widget's data
* `.simplechart-widget`, plus any of your own classes
* A child element with the class `.simplechart-chart` where the chart itself will show up.

Optionally, child elements with `.simplechart-title`, `.simplechart-caption`, `.simplechart-credit` will receive those strings of metadata.

You can give any of these elements other classes to apply your own CSS if you want.

#### Data from URL

```
<figure
  id='widget456'
  class='simplechart-widget'
  data-url='http://mycoolsite.com/simplechart/api/456'
>
  <p class='simplechart-title'></p>
  <p class='simplechart-caption'></p>
  <div class='simplechart-chart'></div>
  <p class='simplechart-credit'></p>
</figure>
```

The presence of the `data-url` attribute tells `widget.js` to render the chart after receiving data from that URL. The expected reponse format is:

```
{
  "success": true,
  "data": {
    "data": "[{\"label\":\"One\",\"value\":29.7},{\"label\":\"Two\",\"value\":0},{\"label\":\"Three\",\"value\":32.8},{\"label\":\"Four\",\"value\":196.4},{\"label\":\"Five\",\"value\":0.1},{\"label\":\"Six\",\"value\":98},{\"label\":\"Seven\",\"value\":13.9},{\"label\":\"Eight\",\"value\":5.1}]",
    "options": "{\"type\":\"discreteBarChart\",\"height\":500}",
    "metadata": "{\"title\":\"Sample Bart Chart\",\"caption\":\"An example of the NVD3 discreteBarChart\",\"credit\":\"Alley Interactive\"}"
  }
}
```

Note that the response expects **stringified** JSON. This is because we want to reduce the number of times that CMS plugins implementing Simplechart and storing its data have to do their own parsing/stringifying.

#### Data from local variable

```
<figure
  id='examplewidget'
  class='simplechart-widget'
  data-var
>
  <p class='simplechart-title'></p>
  <p class='simplechart-caption'></p>
  <div class='simplechart-chart'></div>
  <p class='simplechart-credit'></p>
</figure>
```

The `data-var` attribute does not take a value. When it's present, widget data can be loaded synchronously or asynchronously. [This example](https://github.com/alleyinteractive/simplechart/blob/master/widget.html#L46) shows how to use both of these methods.

##### Synchronous data

Use the global `_SimplechartWidgetData` with the widget's `id` as a key. In this case, `_SimplechartWidgetData.examplewidget` should include all of the data needed to render the chart, including options and metadata.

You can only use this method once per widget, _before_ loading `widget.js`.

##### Asynchronous data

At any time, you can trigger the event `widgetData` on the widget's containing element. If `evt.detail` contains `data`, `options`, _and_ `metadata`, the entire chart will be rebuilt.

Otherwise, `evt.detail.data` will _replace_ existing chart data array. `evt.detail.options` and `evt.detail.metadata` will be shallow-merged into the chart's existing `options` and `metadata`.
