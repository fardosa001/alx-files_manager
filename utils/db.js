const { MongoClient } = require('mongodb');
const mongo = require('mongodb');
const { pwdHashed } = require('./utils');

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    this.database = process.env.DB_DATABASE || 'files_manager';

    const url = `mongodb://${host}:${port}`;
    this.connected = false;
    this.client = new MongoClient(url, { useUnifiedTopology: true });
    this.client.connect().then(() => {
      this.connected = true;
    }).catch((err) => console.log(err.message));
  }

  isAlive() {
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

  async createUser(email, password) {
    const hashedPwd = pwdHashed(password);
    await this.client.connect();
    const user = await this.client.db(this.database).collection('users').insertOne({ email, password: hashedPwd });
    return user;
  }

  async getUser(email) {
    await this.client.connect();
    const user = await this.client.db(this.database).collection('users').find({ email }).toArray();
    if (!user.length) {
      return null;
    }
    return user[0];
  }

  async getUserById(id) {
    const _id = new mongo.ObjectID(id);
    await this.client.connect();
    const user = await this.client.db(this.database).collection('users').find({ _id }).toArray();
    if (!user.length) {
      return null;
    }
    return user[0];
  }

  async userExist(email) {
    const user = await this.getUser(email);
    if (user) {
      return true;
    }
    return false;
  }
}

const dbClient = new DBClient();

module.exports = dbClient;
