#!/usr/bin/env node
const { readFileSync, writeFileSync } = require('fs');
const { addGeoInfo, resolveGeonames } = require('./src/converter.js');
const { samplesPath } = require('./src/settings.js');

const argv = require('yargs') // eslint-disable-line
  .command('convert [infile] [-o] [-f] [-p]',
    'Extend input samples with geo info.',
    yargs => {
      yargs
        .positional('infile', {
          describe: 'Input JSON file with IPs',
          default: samplesPath
        })
        .option('o', {
          alias: 'outfile',
          describe: 'Write output to given file instead of stdout'
        })
        .option('f', {
          alias: 'filter',
          describe: 'Skip unresolved IPs'
        })
        .boolean('f')
        .option('g', {
          alias: 'geonames',
          describe: 'Resolve geonames'
        })
        .boolean('g')
        .option('p', {
          alias: 'pretty',
          describe: 'Format output JSON'
        })
        .boolean('p')
        .coerce('infile', arg => JSON.parse(readFileSync(arg, 'utf-8')));
    }, async (argv) => {
      let result = await addGeoInfo(argv.infile);

      if (argv.filter)
        result = result.filter(([,,geoData]) => geoData != null);

      if (argv.geonames)
        result = resolveGeonames(result);

      const out = JSON.stringify(result, null, argv.pretty ? 2 : null);

      if (argv.outfile)
        writeFileSync(argv.outfile, out, 'utf-8');
      else
        process.stdout.write(out);
    })
  .demandCommand()
  .help()
  .argv;

