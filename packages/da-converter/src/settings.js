const { resolve, join} = require('path');

const projectRoot = resolve(__dirname, '../');
const dataRoot = join(projectRoot, 'data');

module.exports = {
  projectRoot,
  dataRoot,
  samplesPath: join(dataRoot, 'sample.json')
};
