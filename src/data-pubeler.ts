import { TokenResponse } from './token-response';
import axios from 'axios';
import chalk from 'chalk';

export class Pubeler {
  constructor(
    private readonly dataSet: Array<object>,
    private readonly tokenResponse: TokenResponse,
    private readonly url: string,
  ) {}

  private successRecords = 0;
  private failedRecords = 0;

  public async pubelRecords() {
    const primaryKeyName = Object.keys(this.dataSet[0])[0];
    for (let index = 0; index < this.dataSet.length; index++) {
      await this.pubelRecord(this.dataSet[index], primaryKeyName);
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
      });
      console.log(`Success Posting: ${primaryKeyValue}`);
      this.successRecords++;
      return response.data;
    } catch (err) {
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
