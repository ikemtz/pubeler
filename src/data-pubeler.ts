import { TokenResponse } from './token-response';
import axios from 'axios';
import chalk from 'chalk';

export class Pubeler {
  constructor(
    private readonly dataSet: Array<object>,
    private readonly tokenResponse: TokenResponse,
    private readonly url: string,
  ) {}

  public async pubelRecords() {
    const primaryKeyName = Object.keys(this.dataSet)[0];
    for (let index = 0; index < this.dataSet.length; index++) {
      await this.pubelRecord(this.dataSet[index], primaryKeyName);
    }
  }

  private async pubelRecord(record: any, primaryKeyName: string): Promise<object> {
    try {
      const response = await axios.post(this.url, record, {
        headers: { Authorization: `Bearer ${this.tokenResponse.access_token}` },
      });
      console.log(`Success Posting: ${response.data[primaryKeyName]}`);
      return response.data;
    } catch (err) {
      console.log(chalk.red(`Error Posting: ${record[primaryKeyName]}`));
      console.log(chalk.red(`  Error message: ${err.message}`));
      return err;
    }
  }
}
