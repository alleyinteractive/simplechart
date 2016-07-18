import alleyDepartments from 'raw!./alleyDepartments.csv';
import countriesByYear from 'raw!./countriesByYear.csv';

export const sampleData = [
  {
    label: 'Alley Departments (single series)',
    data: alleyDepartments,
  },
  {
    label: 'Countries By Year (multiple series)',
    data: countriesByYear,
  },
];
