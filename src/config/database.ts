import mongoose from 'mongoose';

/**
 * Configuration for MongoDB connection
 * @module database
 */

/**
 * Connect to MongoDB with retry mechanism
 * @async
 * @param {string} uri - MongoDB connection string
 * @param {number} retryAttempts - Number of retry attempts (default: 5)
 * @param {number} retryDelay - Delay between retries in ms (default: 5000)
 * @returns {Promise<typeof mongoose>} Mongoose connection
 * @throws {Error} If connection fails after all retry attempts
 */
export const connectDB = async (
  uri: string,
  retryAttempts: number = 5,
  retryDelay: number = 5000
): Promise<typeof mongoose> => {
  let attempts = 0;

  while (attempts < retryAttempts) {
    try {
      const connection = await mongoose.connect(uri);
      console.log(`MongoDB connected: ${connection.connection.host}`);
      return connection;
    } catch (error) {
      attempts++;
      console.error(`MongoDB connection error (attempt ${attempts}/${retryAttempts}):`, error);

      if (attempts >= retryAttempts) {
        console.error('All connection attempts failed. Exiting process.');
        process.exit(1);
      }

      console.log(`Retrying in ${retryDelay/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }

  // This should never be reached due to process.exit() in the catch block
  throw new Error('Failed to connect to MongoDB after multiple attempts');
};

/**
 * Close MongoDB connection
 * @async
 * @returns {Promise<void>}
 */
export const closeDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
};
