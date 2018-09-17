import singleSeries from './singleSeries.csv';
import countriesByYear from './countriesByYear.csv';
import emissionsPerCountry from './emissionsPerCountry.csv';
import stockMarkets from './stockMarkets.csv';
import engineMpg from './engineMpg.csv';
import products from './productsRevenueRatingProductionCost.csv';

export default [
  {
    label: 'Horizontal Multibar Test (multiple series)',
    data: `Party,Supports The Affordable Care Act,Opposes The Affordable Care Act,Complicated Position,No Information
    Republican,0.13,73.77,5.03,21.06
    Democrat,36.07,0.93,25.54,37.46`,
  },
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
