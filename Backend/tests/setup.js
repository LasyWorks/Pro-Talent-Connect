const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

// Set env variables for testing
process.env.JWT_SECRET = "testsecret";
process.env.NODE_ENV = "test";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});
