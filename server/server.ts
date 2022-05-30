import express, {Request, Response} from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import router from './routes';
import {errorHandler} from './middleware/customErrorHandler';

colors.enable();

dotenv.config();
const port = process.env.PORT || 8000;

connectDB();

const app = express();
app.use(express.json());

app.use('/api', router);

app.use(errorHandler);

app.listen(port, () => {
  console.log('App listening at http://localhost:8000');
});
