const pify = require('pify');
const readFile = pify(require('fs').readFile);
const { geoLookup } = require('../src/geoip');
const { samplesPath } = require('../src/settings');
const isIp = require('is-ip');


test('geoLookup gives some geo info about given ip', async () => {
  const geoInfo = await geoLookup('109.171.128.20');
  expect(geoInfo).toHaveProperty('continent');
  expect(geoInfo).toHaveProperty('country');
  expect(geoInfo).toHaveProperty('city');
  expect(geoInfo.continent).toEqual('AS');
  expect(geoInfo.country).toEqual('SA');
  expect(geoInfo.city).toEqual('Jeddah');
});

test('one ip from sample data is invalid', async () => {
  const samples = JSON.parse(await readFile(samplesPath, 'utf-8'));

  expect(samples).toHaveLength(303);
  expect(samples[0]).toEqual(['190.215.130.193', 79]);
  expect(samples[302]).toEqual(['188.92.128.42', 160]);

  const invalid = samples.filter(([ip, ]) => !isIp(ip));
  expect(invalid).toHaveLength(1);
});

test('every ip from sample data can be resolved except one', async () => {
  const samples = JSON.parse(await readFile(samplesPath, 'utf-8'));

  expect(samples).toHaveLength(303);
  expect(samples[0]).toEqual(['190.215.130.193', 79]);
  expect(samples[302]).toEqual(['188.92.128.42', 160]);

  const lookups = samples
    .filter(([ip, ]) => isIp(ip))
    .map(([ ip, ]) => geoLookup(ip));

  const geoData = await Promise.all(lookups);
  expect(samples.length - geoData.length).toBe(1);
});
