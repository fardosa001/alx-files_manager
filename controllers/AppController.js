const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

class AppController {
  static async getStatus(_request, response) {
    response.status(200).json({
      redis: await redisClient.isAlive(),
      db: await dbClient.isAlive(),
    });
  }

  static async getStats(_request, response) {
    const usersNum = await dbClient.nbUsers();
    const filesNum = await dbClient.nbFiles();
    response.status(200).json({ users: usersNum, files: filesNum });
  }
}

module.exports = AppController;
