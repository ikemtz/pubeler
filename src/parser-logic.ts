import * as parse from 'csv-parse';

export class ParserLogic {
  constructor(private readonly content: string, private readonly delimeter: string) {}

  public getData(): Array<object> {
    const parserOutput = this.getContentArrays();
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

  private getContentArrays(): Array<Array<any>> {
    const parserOutput = Array<Array<any>>();
    // Create the parser
    const parser = parse({
      delimiter: this.delimeter,
      auto_parse: true,
      auto_parse_date: true,
      bom: true,
      cast: x => {
        if (x === 'true') {
          return true;
        } else if (x === 'false') {
          return false;
        }
        return (x || '').trim();
      },
    });

    // Use the readable stream api
    parser.on('readable', function() {
      let record;
      while ((record = parser.read())) {
        parserOutput.push(record);
      }
    });
    parser.write(this.content);
    parser.end();
    return parserOutput;
  }
}
