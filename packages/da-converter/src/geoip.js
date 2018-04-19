const geoip2 = require('geoip2');
const path = require('path');
const pify = require('pify');
const { dataRoot } = require('./settings');

const geoLiteDbPath = path.join(dataRoot, 'GeoLite2-City.mmdb');

geoip2.init(geoLiteDbPath);

module.exports.geoLookup = pify(geoip2.lookupSimple.bind(geoip2));
