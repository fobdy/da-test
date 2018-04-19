import { multiExtent, transpose, generateColorStops } from './helpers';
import { interpolateCubehelixDefault } from 'd3-scale-chromatic';

test('multiExtent works as expected', () => {
  const data = [
    [-1, 10],
    [10, -5],
    [9, 3],
    [7, 6]
  ];
  expect(multiExtent(data)).toEqual([[-1, 10], [-5, 10]]);
});

test('transpose works as expected', () => {
  expect(transpose([[1, 2], [3, 4]]))
    .toEqual([[1, 3], [2, 4]]);
});

test('generateColorStops works as expected', () => {
  let stops = generateColorStops(interpolateCubehelixDefault, 3);
  expect(stops).toEqual({
    '0': 'rgb(0, 0, 0)',
    '0.33': 'rgb(43, 111, 57)',
    '0.67': 'rgb(212, 144, 198)',
    '1': 'rgb(255, 255, 255)'
  });

  stops = generateColorStops(interpolateCubehelixDefault, 1);
  expect(stops).toEqual({
    '0': 'rgb(0, 0, 0)',
    '1': 'rgb(255, 255, 255)'
  });
});
