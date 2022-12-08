#!/usr/bin/env node

import * as fs from 'fs';
import { ParserLogic } from './parser-logic';
import { TokenLogic } from './token-logic';
import { Pubeler } from './data-pubeler';
import { Config } from './config';
import { program } from 'commander';
import { CommandLineArguments } from './command-line-arguments';
const chalk = require('chalk');

console.clear();
program
  .version('0.1.0')
  .description(
    `A utility to automate the publishing of data contained in flat files to resful APIs.  For more info, check out the readme: ${chalk.blueBright(
      'https://github.com/ikemtz/pubeler',
    )} `,
  )
  .requiredOption('-C, --configFile <configFile>', 'location of configuration file <Required>')
  .requiredOption('-D, --dataFile <dataFile>', 'location of data file <Required>');
program.parse(process.argv);

const commandLineArgs = program.opts() as CommandLineArguments;

if ((commandLineArgs.configFile || '').trim().length == 0 || (commandLineArgs.dataFile || '').trim().length == 0) {
  commandLineArgs.help();
}

const configJson = fs.readFileSync(commandLineArgs.configFile, { encoding: 'utf8' });
const config: Config = JSON.parse(configJson);

const content = fs.readFileSync(commandLineArgs.dataFile, { encoding: 'utf8' });
const parserLogic = new ParserLogic(content, config.textDelimeter);

const records = parserLogic.getDataAsync();

new TokenLogic(config).getToken().then(async (token) => {
  console.log('Starting the posting process');
  const pubeler = new Pubeler(await records, token, config.postDestinationUrl);
  pubeler.pubelRecords();
});
