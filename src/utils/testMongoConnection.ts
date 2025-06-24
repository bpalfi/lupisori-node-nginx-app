import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB, closeDB } from '../config/database';

// Load environment variables
dotenv.config();

/**
 * Test MongoDB connection, list databases and collections
 */
const testMongoConnection = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/develop-CCP30-content-de';

    console.log(`Attempting to connect to MongoDB at: ${mongoUri}`);

    // Connect to MongoDB
    await connectDB(mongoUri);

    // Get the admin database
    const adminDb = mongoose.connection.db.admin();

    // List all databases
    const dbs = await adminDb.listDatabases();
    console.log('\nAvailable databases:');
    dbs.databases.forEach((db: { name: string }) => {
      console.log(`- ${db.name}`);
    });

    // Get the current database name
    const currentDbName = mongoose.connection.db.databaseName;
    console.log(`\nCurrent database: ${currentDbName}`);

    // List all collections in the current database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nAvailable collections in current database:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });

    // Close connection
    await closeDB();
    console.log('\nTest completed successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error testing MongoDB connection:', error);
    process.exit(1);
  }
};

// Run the test
testMongoConnection();
