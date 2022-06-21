import {connect} from 'mongoose';

const connectDB = async () => {
  const mongoConnectionUri =
    process.env.DB_MODE === 'local'
      ? process.env.MONGO_URI_LOCAL
      : process.env.MONGO_URI;

  try {
    if (mongoConnectionUri === undefined) {
      throw new Error('mongoConnectionUri is undefined');
    }

    const conn = await connect(mongoConnectionUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDB;
