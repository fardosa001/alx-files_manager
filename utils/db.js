const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    this.database = process.env.DB_DATABASE || 'files_manager';

    const url = `mongodb://${host}:${port}`;
    this.connected = false;
    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.connect();
  }

  async connect() {
    try {
      await this.client.connect();
      this.connected = true;
    } catch (error) {
      console.error('Error connecting to the database:', error.message);
    }
  }

  async isAlive() {
    return this.connected;
  }

  async nbUsers() {
    const usersCollection = this.client.db(this.database).collection('users');
    return usersCollection.countDocuments();
  }

  async nbFiles() {
    const filesCollection = this.client.db(this.database).collection('files');
    return filesCollection.countDocuments();
  }
}

const dbClient = new DBClient();

module.exports = dbClient;
