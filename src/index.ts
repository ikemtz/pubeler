#!/usr/bin/env node

import * as fs from 'fs';
import { ParserLogic } from './parser-logic';
import { TokenLogic } from './token-logic';
import { Pubeler } from './data-pubeler';
import { Config } from './config';
import * as commander from 'commander';
import { CommandLineArguments } from './command-line-arguments';
import chalk from 'chalk';

console.clear();
const commandLineArgs = (commander
  .version('0.1.0')
  .description(
    `A utility to automate the publishing of data contained in flat files to resful APIs.  For more info, check out the readme: ${chalk.blueBright(
      'https://github.com/ikemtz/pubeler',
    )} `,
  )
  .option('-C, --configFile <configFile>', 'location of configuration file <Required>')
  .option('-D, --dataFile <dataFile>', 'location of data file <Required>')
  .parse(process.argv) as unknown) as CommandLineArguments;

if ((commandLineArgs.configFile || '').trim().length == 0 || (commandLineArgs.dataFile || '').trim().length == 0) {
  commandLineArgs.help();
}

const configJson = fs.readFileSync(commandLineArgs.configFile, { encoding: 'utf8' });
const config: Config = JSON.parse(configJson);

const content = fs.readFileSync(commandLineArgs.dataFile, { encoding: 'utf8' });
const parserLogic = new ParserLogic(content, config.textDelimeter);

const records = parserLogic.getData();

new TokenLogic(config).getToken().then(token => {
  console.log('Starting the posting process');
  const pubeler = new Pubeler(records, token, config.postDestinationUrl);
  pubeler.pubelRecords();
});
