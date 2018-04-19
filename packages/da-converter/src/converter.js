const isIp = require('is-ip');
const { geoLookup } = require('./geoip');
const countries = require('i18n-iso-countries');
const countrydata = require('iso-3166-2.json');
countries.registerLocale(require('i18n-iso-countries/langs/en.json'));

const getCountryName = (code) => countries.getName(code, 'en');
const getDivisionName = (countryCode, divisionCode) => {
  const countryItem = countrydata[countryCode];
  if (countryItem == null)
    return null;
  const divCode = `${countryCode}-${divisionCode}`;
  return countryItem.divisions[divCode];
};

const selfie = (a) => a;

function geoLookupAll(ips, getter=selfie) {
  const lookups = ips
    .map(item => {
      const ip = getter(item);
      return isIp(ip) ? geoLookup(ip) : null;
    });

  return Promise.all(lookups);
}

async function addGeoInfo(samples) {
  const lookups = await geoLookupAll(samples, item => item[0]);
  return samples.map((sample, idx) => [...sample, lookups[idx]]);
}

function resolveGeonames(samples) {

  return samples.map(item => {
    if (item[2] == null)
      return item;
    const geo = item[2];
    const extendedGeo = Object.assign({}, geo, {
      humanNames: {
        country: getCountryName(geo.country)
      }
    });
    if (geo.subdivision != null) {
      const subdivision = getDivisionName(
        geo.country,
        geo.subdivision
      );
      if (subdivision)
        extendedGeo.humanNames.subdivision = subdivision;
    }
    return [...item.slice(0, -1), extendedGeo];
  });
}

module.exports = { geoLookupAll, addGeoInfo, resolveGeonames };
