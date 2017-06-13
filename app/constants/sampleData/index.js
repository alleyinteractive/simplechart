import singleSeries from '!!raw-loader!./singleSeries.csv'; // eslint-disable-line
import countriesByYear from '!!raw-loader!./countriesByYear.csv'; // eslint-disable-line
import emissionsPerCountry from '!!raw-loader!./emissionsPerCountry.csv'; // eslint-disable-line
import stockMarkets from '!!raw-loader!./stockMarkets.csv'; // eslint-disable-line
import engineMpg from '!!raw-loader!./engineMpg.csv'; // eslint-disable-line
import products from '!!raw-loader!./productsRevenueRatingProductionCost.csv'; // eslint-disable-line

export const sampleData = [ // eslint-disable-line
  {
    label: 'Single Data Series',
    data: singleSeries,
  },
  {
    label: 'Countries By Year (multiple series)',
    data: countriesByYear,
  },
  {
    label: 'CO2 Emissions by Country (multiple series)',
    data: emissionsPerCountry,
  },
  {
    label: 'Stock market indices, November 2016',
    data: stockMarkets,
  },
  {
    label: 'Engine City and Highway MPG Comparison (scatter)',
    data: engineMpg,
  },
  {
    label: 'Product Revenue, Rating, and Product Cost Comparison (bubble)',
    data: products,
  },
];
