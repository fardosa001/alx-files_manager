const { MongoClient } = require('mongodb');


class DBClient {
    constructor() {
        const host = process.env.DB_HOST || 'localhost';
        const port = process.env.DB_PORT || 27017;
        const database = process.env.DB_DATABASE || 'files_manager';
        
        const url = `mongodb://${host}:${port}`;
        this.client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    async connect() {
        try {
            await this.client.connect();
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error(error);
        }
    }

    async isAlive() {
        return this.client.isConnected();
    }

    async nbUsers() {
        const usersCollection = this.client.db().collection('users');
        return usersCollection.countDocuments();
    }

    async nbFiles() {
        const filesCollection = this.client.db().collection('files');
        return filesCollection.countDocuments();
    }
}

const dbClient = new DBClient();
dbClient.connect();

module.exports = dbClient;