import mongoose from 'mongoose';
import { selectedConfig } from './config.js';
import { logger } from './logger.js';

// Use native ES6 promise
mongoose.Promise = global.Promise;

// Connect to MongoDB
mongoose.connect(selectedConfig.database.url);
const db = mongoose.connection;

db.on('error', () => {
  logger.error(
    `MongoDB connection error at ${selectedConfig.database.url}\nPlease make sure MongoDB is running.`
  );
  process.exit(1);
});

db.once('open', () => {
  logger.debug('MongoDB connection with database succeeded.');
});

db.on('reconnecting', () => {
  logger.debug('Reconnecting with MongoDB.');
});

db.on('disconnected', () => {
  logger.warn(`MongoDB connection lost.`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close();
  logger.debug('MongoDB connection disconnected through app termination.');
  process.exit(0);
});

export { db };
