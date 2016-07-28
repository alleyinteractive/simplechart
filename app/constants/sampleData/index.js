import alleyDepartments from 'raw!./alleyDepartments.csv';
import countriesByYear from 'raw!./countriesByYear.csv';
import emissionsPerCountry from 'raw!./emissionsPerCountry.csv';

export const sampleData = [
  {
    label: 'Alley Departments (single series)',
    data: alleyDepartments,
  },
  {
    label: 'Countries By Year (multiple series)',
    data: countriesByYear,
  },
  {
    label: 'CO2 Emissions by Country (multiple series)',
    data: emissionsPerCountry,
  },
];
