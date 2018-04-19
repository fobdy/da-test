const pify = require('pify');
const readFile = pify(require('fs').readFile);
const { addGeoInfo, resolveGeonames } = require('../src/converter');
const { geoLookup } = require('../src/geoip');
const { samplesPath } = require('../src/settings');


test('converter converts', async () => {
  const samples = JSON.parse(await readFile(samplesPath, 'utf-8'));
  const totalData = await addGeoInfo(samples);
  expect(Array.isArray(totalData)).toBeTruthy();

  const geoData = await geoLookup(totalData[0][0]);
  expect(totalData[0][2]).toEqual(geoData);

  samples.forEach(async (sample, idx) => {
    expect(totalData[idx]).toEqual(expect.arrayContaining(sample));
    const [ip,] = sample;
    const [,,geoData] = totalData[idx];
    if (ip !== '192.168.0.256')
      expect(geoData).toEqual(await geoLookup(ip));
  });
});

test('resolveGeonames', () => {
  const data = [
    ['188.92.128.42' , 160, {
      'country': 'DE',
      'continent':'EU',
      'location': {
        'accuracy_radius':200,
        'latitude':51.2993,
        'longitude':9.491
      }
    }],
    ['213.76.30.185', 186, {
      'country':'PL',
      'continent':'EU',
      'postal':'87-807',
      'city':'Warzachewka Polska',
      'location': {
        'accuracy_radius':200,
        'latitude':52.5931,
        'longitude':19.0894,
        'time_zone':'Europe/Warsaw'
      },
      'subdivision':'KP'
    }]
  ];

  const expected = [
    ['188.92.128.42', 160, {
      'continent': 'EU',
      'country': 'DE',
      'humanNames': {
        'country': 'Germany'
      },
      'location': {
        'accuracy_radius': 200,
        'latitude': 51.2993,
        'longitude': 9.491
      }
    }],
    ['213.76.30.185', 186, {
      'city': 'Warzachewka Polska',
      'continent': 'EU',
      'country': 'PL',
      'humanNames': {
        'country': 'Poland'
      },
      'location': {
        'accuracy_radius': 200,
        'latitude': 52.5931,
        'longitude': 19.0894,
        'time_zone': 'Europe/Warsaw'
      },
      'postal': '87-807',
      'subdivision': 'KP'
    }]
  ];

  expect(resolveGeonames(data)).toEqual(expected);
});
