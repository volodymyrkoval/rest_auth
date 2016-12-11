import config from 'config'

class MongodbModel {
  constructor() {
    this.mongoUrl = `${config.db.mongo.scheme}://${config.db.mongo.host}:${config.db.mongo.port}/${config.db.mongo.database}`;
  }
}

export default MongodbModel;