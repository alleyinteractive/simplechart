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
    const legendMap = data.reduce(reduceData, {});
    return Object
      .keys(legendMap)
      .map((name, index) => Object.assign(
        legendMap[name],
        { id: index }
      ));
  },
};

function reduceData(acc, { name, value }) {
  const quantity = acc[name] ? acc[name].quantity + value : value;
  return update(acc, {
    [name]: {
      $set: {
        quantity,
        name,
      },
    },
  });
}
