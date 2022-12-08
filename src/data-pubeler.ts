import { TokenResponse } from './token-response';
import axios from 'axios';
import * as https from 'https';
import { Config } from './config';
const chalk = require('chalk');

export class Pubeler {
  constructor(
    private readonly dataSet: Array<object>,
    private readonly tokenResponse: TokenResponse,
    private readonly url: string,
    private readonly config: Config,
  ) {}

  private successRecords = 0;
  private failedRecords = 0;

  public async pubelRecords() {
    const primaryKeyName = Object.keys(this.dataSet[0])[0];
    for (const element of this.dataSet) {
      await this.pubelRecord(element, primaryKeyName);
    }
    console.log(`Successful posts ${chalk.green(this.successRecords.toString())}`);
    console.log(`Failed posts ${chalk.red(this.failedRecords.toString())}`);
    console.log('Pubeler out 🎤 💧 ✌');
  }

  private async pubelRecord(record: any, primaryKeyName: string): Promise<object> {
    const primaryKeyValue = record[primaryKeyName];
    try {
      const response = await axios.post(this.url, record, {
        headers: { Authorization: `Bearer ${this.tokenResponse.access_token}` },
        httpsAgent: new https.Agent({ rejectUnauthorized: !(this.config.skip_ssl_validation || false) }),
      });
      console.log(`Success Posting: ${primaryKeyValue}`);
      this.successRecords++;
      return response.data;
    } catch (err: any) {
      console.log(chalk.red(`Error Posting: ${primaryKeyValue}`));
      let msg: string = err.message;
      if (err.response && err.response.data) {
        msg = JSON.stringify(err.response.data);
      }
      console.log(chalk.red(`  Error message: ${msg}`));
      this.failedRecords++;
      return err;
    }
  }
}
