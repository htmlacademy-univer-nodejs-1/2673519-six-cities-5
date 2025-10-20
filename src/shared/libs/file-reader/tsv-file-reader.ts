import EventEmitter from 'node:events';
import { FileReader } from './file-reader.interface.js';
import { createReadStream } from 'node:fs';
import { STREAM_BATCH_SIZE } from '../../config/config.consts.js';

export class TSVFileReader extends EventEmitter implements FileReader {
  constructor(private readonly filename: string) {
    super();
  }

  public async read(): Promise<void> {
    const readStream = createReadStream(this.filename, {
      highWaterMark: STREAM_BATCH_SIZE,
      encoding: 'utf-8',
    });

    let remainingData = '';
    let nextLinePosition = -1;
    let linesImportedCount = 0;

    for await (const batch of readStream) {
      remainingData += batch.toString();

      while ((nextLinePosition = remainingData.indexOf('\n')) >= 0) {
        const completeRow = remainingData.slice(0, nextLinePosition + 1);
        linesImportedCount++;
        remainingData = remainingData.slice(++nextLinePosition);
        await new Promise((resolve) => {
          this.emit('line', completeRow, resolve);
        });
      }
    }

    this.emit('endImport', linesImportedCount);
  }
}
