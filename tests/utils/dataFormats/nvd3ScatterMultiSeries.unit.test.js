import transform from '../../../app/utils/dataFormats/nvd3ScatterMultiSeries';

test('transforms valid parsed data', () => {
  const data = [
    {
      Product: 'Product 1',
      Cost: '600',
      Rating: '12',
      Revenue: '4.5',
    },
  ];

  const fields = [
    'Product',
    'Revenue',
    'Rating',
    'Cost',
  ];

  const expected = [{
    key: 'Product 1',
    values: [
      {
        x: 4.5,
        y: 12,
        size: 600,
      },
    ],
  }];

  expect(transform(data, fields, {})).toEqual(expected);
});

describe('returns false for invalid parsed data', () => {
  test('invalid num fields', () => {
    const data = [
      {
        Product: 'Product 1',
        Cost: '600',
      },
    ];

    const fields = ['Product', 'Cost'];
    expect(transform(data, fields, {})).toBe(false);
  });

  test('invalid row value', () => {
    const data = [
      {
        Product: 'Product 1',
        Cost: '600',
        Rating: 'foo bar',
        Revenue: '4.5',
      },
    ];

    const fields = [
      'Product',
      'Revenue',
      'Rating',
      'Cost',
    ];

    expect(transform(data, fields, {})).toBe(false);
  });
});
