import {formatDate} from './time';
import {v4 as uuid} from 'uuid';
import path from 'path';
import fs from 'fs';

const logEvents = async (
  message: string = '',
  filename: string = 'event-log.txt'
) => {
  const dateTime = formatDate(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
  const logItem = `${dateTime}    ${uuid()}   ${message}\n`;
  const logdir = path.join(__dirname, '../', 'logs');
  try {
    // If no /logs directory, create one
    if (!fs.existsSync(logdir)) {
      await fs.promises.mkdir(logdir);
    }
    await fs.promises.appendFile(path.join(logdir, filename), logItem);
  } catch (error) {
    console.log(error);
  }
};

export default logEvents;
