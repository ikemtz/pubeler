import { parse } from 'csv-parse';

export class ParserLogic {
  constructor(private readonly content: string, private readonly delimeter: string) {}

  public async getDataAsync(): Promise<Array<object>> {
    const parserOutput = await this.getContentArraysAsync();
    const headerRow = parserOutput[0];
    const parsedData = Array<object>();

    //Starting @1 because the first row should be the header row
    for (let recordIndex = 1; recordIndex < parserOutput.length; recordIndex++) {
      const record = this.parseRecord(headerRow, parserOutput[recordIndex]);
      parsedData.push(record);
    }
    return parsedData;
  }

  private parseRecord(fieldNames: Array<string>, recordRowArray: Array<any>): object {
    let record: any = {};
    let fieldIndex = 0;
    fieldNames.forEach((element: string) => {
      record[element] = recordRowArray[fieldIndex];
      fieldIndex++;
    });
    return record;
  }

  private getContentArraysAsync(): Promise<Array<Array<any>>> {
    const parserOutput = Array<Array<any>>();
    return new Promise((resolve, reject) => {
      // Create the parser
      const parser = parse({
        delimiter: this.delimeter,
        auto_parse: true,
        auto_parse_date: true,
        bom: true,
        cast: (x) => {
          x = (x || '').trim();
          if (x.toLowerCase() === 'true') {
            return true;
          } else if (x.toLowerCase() === 'false') {
            return false;
          } else if (x === 'NULL' || x.length === 0) {
            return null;
          }
          return x;
        },
      });

      // Use the readable stream api
      parser.on('readable', function () {
        let record;
        while ((record = parser.read()) !== null) {
          parserOutput.push(record);
        }
      });
      parser.on('error', function (err) {
        console.error(err.message);
        reject(err.message);
      });
      parser.write(this.content);
      parser.end(() => resolve(parserOutput));
    });
  }
}
