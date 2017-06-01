import update from 'immutability-helper';
import getSumDomain from '../../utils/dataFormats/getSumDomain';

export const config = {
  type: 'stackedAreaChart',
  label: 'Stacked Area Chart',
  dataFormat: 'britechartsStackedArea',
  componentName: 'BritechartsAdapter',
  modules: {
    settings: ['Legend', 'Metadata', 'ColorPalette'],
  },
  getNiceDomain: getSumDomain,
};

export const defaultOpts = {
  showLegend: true,
  showControls: false,
  mapLegendData(data) {
    const legendMap = data.reduce(sumSeries, {});
    return Object
      .keys(legendMap)
      .map((name, index) => Object.assign(legendMap[name], { id: index }));
  },
};

function sumSeries(map, { name, value }) {
  const quantity = map[name] ? map[name].quantity + value : value;
  return update(map, {
    [name]: {
      $set: {
        quantity,
        name,
      },
    },
  });
}
