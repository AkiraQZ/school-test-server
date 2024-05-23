require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to database');
  } catch (err) {
    console.error('Error connecting to database:', err);
    throw err;
  }
}

const client = new MongoClient(process.env.dbUri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  module.exports = {
  client,
  connectToDatabase,
};