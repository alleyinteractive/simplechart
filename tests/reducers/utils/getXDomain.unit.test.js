import getXDomain, { getSeriesMinMax }
  from '../../../app/reducers/utils/getXDomain';

const mockData = [
  {
    values: [
      { x: 178 },
      { x: 2 },
      { x: 485 },
      { x: -1.55 },
    ],
  },
  {
    values: [
      { x: 500 },
    ],
  },
  {
    values: [
      { x: 0 },
      { x: 0 },
      { x: 0 },
      { x: 0.0000001 },
    ],
  },
];
test('getSeriesMinMax', () => {
  expect(getSeriesMinMax([])[0]).toBe(0);
  expect(getSeriesMinMax([])[1]).toBe(0);

  let seriesMinMax = getSeriesMinMax(mockData[0].values);
  expect(seriesMinMax[0]).toBe(-1.55);
  expect(seriesMinMax[1]).toBe(485);

  seriesMinMax = getSeriesMinMax(mockData[1].values);
  expect(seriesMinMax[0]).toBe(500);
  expect(seriesMinMax[1]).toBe(500);

  seriesMinMax = getSeriesMinMax(mockData[2].values);
  expect(seriesMinMax[0]).toBe(0);
  expect(seriesMinMax[1]).toBe(0.0000001);
});

test('getXDomain', () => {
  expect(getXDomain('notAnArray')).toBe(false);

  expect(getXDomain(mockData)[0]).toBe(-1.55);
  expect(getXDomain(mockData)[1]).toBe(500);
});
