import singleSeries from '!!raw-loader!./singleSeries.csv';
import countriesByYear from '!!raw-loader!./countriesByYear.csv';
import emissionsPerCountry from '!!raw-loader!./emissionsPerCountry.csv';
import stockMarkets from '!!raw-loader!./stockMarkets.csv';
import engineMpg from '!!raw-loader!./engineMpg.csv';
import products from '!!raw-loader!./productsRevenueRatingProductionCost.csv';

export const sampleData = [
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
