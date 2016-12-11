import MongoClient from 'mongodb'
import MongodbModel from './MongodbModel'
import _ from 'lodash'

class User extends MongodbModel {

  async createUser(id, password, type) {
    let params = _.omitBy({id, password, type}, _.isNil);
    return new Promise((resolve, reject) => MongoClient.connect(this.mongoUrl, (err, db) => {
      if (err) reject(err);
      db.collection('users').insertOne(params, (err, res) => {
        if (err) return reject(err);
        resolve(res);
        db.close();
      });
    }));
  }

  async findUser(id, password) {
    let params = _.omitBy({id, password}, _.isNil);
    return new Promise((resolve, reject) => MongoClient.connect(this.mongoUrl, (err, db) => {
      if (err) reject(err);
      db.collection('users').find(params).toArray((err, res) => {
        if (err) return reject(err);
        resolve(_.first(res));
        db.close();
      });
    }));
  }
}

export default User;