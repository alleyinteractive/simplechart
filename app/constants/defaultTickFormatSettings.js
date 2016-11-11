import { defaultLocaleIndex } from './d3Locales';

export const defaultTickFormatSettings = {
  locale: defaultLocaleIndex,
  showCurrencySymbol: false,
  groupThousands: true,
  prepend: '',
  append: '',
  decimalPlaces: 2,
  multiplier: '1',
};

export const multiplierOptions = [
  { value: '1000', children: '1000x' },
  { value: '100', children: '100x' },
  { value: '10', children: '10x' },
  { value: '1', children: '1' },
  { value: '.1', children: '1/10' },
  { value: '.01', children: '1/100' },
  { value: '.001', children: '1/1000' },
];
