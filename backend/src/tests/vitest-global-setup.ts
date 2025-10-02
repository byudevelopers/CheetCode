// vitest-global-setup.ts
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

// Declare a global variable to hold the MongoMemoryServer instance
// Use `globalThis` for Vitest context
declare global {
  var __MONGOD__: MongoMemoryServer;
}

export async function setup() {
  if (globalThis.__MONGOD__) {
    // If already setup (e.g., due to watch mode restarting), clean up first
    await mongoose.disconnect();
    await globalThis.__MONGOD__.stop();
  }

  const mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  await mongoose.connect(uri);

  globalThis.__MONGOD__ = mongo; // Store the instance globally
  process.env.MONGO_URI = uri; // Optionally store URI in env for access in tests if needed

  console.log(`\n[Vitest Global Setup] In-memory MongoDB started at: ${uri}`);
}

export async function teardown() {
  if (mongoose.connection.readyState === 1) { // 1 means 'connected'
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    console.log("[Vitest Global Teardown] MongoDB connection closed.");
  }
  if (globalThis.__MONGOD__) {
    await globalThis.__MONGOD__.stop();
    console.log("[Vitest Global Teardown] In-memory MongoDB stopped.");
  }
}