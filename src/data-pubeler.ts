import { TokenResponse } from './token-response';
import axios, { AxiosRequestConfig } from 'axios';
import { Agent as httpAgent } from 'http';
import { Agent as httpsAgent } from 'https';
import { Config } from './config';
import { format } from 'date-fns';
import * as fs from 'fs';
const chalk = require('chalk');

export class Pubeler {
  constructor(
    private readonly dataSet: Array<object>,
    private readonly tokenResponse: TokenResponse,
    private readonly url: string,
    private readonly config: Config,
  ) {
    this.requestConfig = {
      headers: { Authorization: `Bearer ${this.tokenResponse.access_token}` },
      httpAgent: new httpAgent({}),
      httpsAgent: new httpsAgent({ rejectUnauthorized: !(this.config.skip_ssl_validation || false) }),
    };
  }
  private readonly requestConfig: AxiosRequestConfig;
  private successRecords = 0;
  private failedRecords: string[] = [];

  public async pubelRecords() {
    const primaryKeyName = Object.keys(this.dataSet[0])[0];
    for (let i = 0; i < this.dataSet.length; i++) {
      await this.pubelRecord(this.dataSet[i], primaryKeyName, i);
    }
    console.log(`Successful posts ${chalk.green(this.successRecords.toString())}`);
    console.log(`Failed posts ${chalk.red(this.failedRecords.length)}`);
    if (this.failedRecords.length) {
      const urlSplits = this.config.postDestinationUrl.split('/');
      const path = `./${urlSplits[urlSplits.length - 1]}.${format(new Date(), 'yyMMddHHmmss')}.failures.txt`;
      fs.writeFileSync(path, this.failedRecords.join('\n'));
      console.error(`Failed post records were written to: ${path}`);
    }
    console.log('Pubeler out 🎤 💧 ✌');
  }

  private async pubelRecord(record: any, primaryKeyName: string, index: number): Promise<unknown> {
    const primaryKeyValue = record[primaryKeyName];
    try {
      const response = await axios.post(this.url, record, this.requestConfig);

      console.log(`Success Posting Row# ${index}: ${primaryKeyValue}`);
      this.successRecords++;
      return response.data;
    } catch (err: any) {
      console.error(chalk.red(`Error Posting Row# ${index}: ${primaryKeyValue}`));
      let msg: string = err.message;
      if (err.response && err.response.data) {
        msg = JSON.stringify(err.response.data);
      }
      console.error(chalk.red(`  Error message: ${msg}`));
      this.failedRecords.push(this.stringifyRecord(record));
      return err;
    }
  }

  public stringifyRecord(record: any): string {
    return Object.values(record).join(this.config.textDelimeter);
  }
}
