import {customLogger} from './middleware/customLogger';
import express from 'express';
import colors from 'colors';
import cors, {CorsOptions} from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import router from './routes';
import {errorHandler} from './middleware/customErrorHandler';
import cookieParser from 'cookie-parser';

colors.enable();

dotenv.config();
const port = process.env.PORT || 8000;

connectDB();

const app = express();

// Custom Logger Middleware
app.use(customLogger);

// Cross Origin Resource Sharing
const allowList = ['http://localhost:8080'];
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (allowList.indexOf(origin as string) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// build-in middlewware to handle urlencoded data aka form data
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({extended: false}));

// built-in middleware for json
// 'content-type: application/json'
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

app.use('/api', router);

app.use(errorHandler);

app.listen(port, () => {
  console.log('App listening at http://localhost:8000');
});
