const mongoose = require('mongoose');

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is not configured. Add the MongoDB connection string to backend/.env.');
  }

  const maxAttempts = 5;
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        dbName: 'buildnbuy',
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      });

      mongoose.connection.on('reconnected', () => {
        console.log('MongoDB reconnected: ✅');
      });

      return conn;
    } catch (error) {
      lastError = error;

      if (error.code === 8000 || error.codeName === 'AtlasError') {
        throw new Error(
          'The MongoDB user lacks permission to access the buildnbuy database. ' +
          'In Atlas Database Access, grant this user the readWrite role for buildnbuy.'
        );
      }

      if (attempt === maxAttempts) break;

      const delay = Math.min(1000 * (2 ** (attempt - 1)), 8000);
      await wait(delay);
    }
  }

  throw new Error(
    `Could not connect to MongoDB after ${maxAttempts} attempts (${lastError?.name || 'connection error'}). ` +
    'Check that the Atlas cluster is running, your current IP is allowed in Network Access, and the database user credentials in backend/.env are correct.'
  );
};

module.exports = connectDB;
