import MongodbModel from './MongodbModel'
import MongoClient from 'mongodb'
import _ from 'lodash'
import {createTokenHash} from '../helpers/cryptoHelper'

class Token extends MongodbModel {
  async createToken(id) {
    let token = createTokenHash(id),
        isTokenStored = new Promise((resolve, reject) => MongoClient.connect(this.mongoUrl, (err, db) => {
          if (err) return reject(err);
          db.collection('tokens').insertOne({id: id, token: token, createdAt: new Date()}, (err, res) => {
            if (err) return reject(err);
            resolve(true);
            db.close();
          });
        })).catch(e => false);
    if (await isTokenStored) {
      return token;
    }
    throw new Error({msg: 'Token creation error'});
  }

  async getToken(id, token) {
    let params = _.omitBy({id, token}, _.isNil);
    return new Promise((resolve, reject) => MongoClient.connect(this.mongoUrl, (err, db) => {
      if (err) return reject(err);
      db.collection('tokens').find(params).toArray((err, res) => {
        if (err) return reject(err);
        if (token) res = _.first(res);
        resolve(res);
        db.close();
      });
    }));
  }

  async removeTokens(id, token) {
    let params = _.omitBy({id, token}, _.isNil);
    return new Promise((resolve, reject) => MongoClient.connect(this.mongoUrl, (err, db) => {
      if (err) return reject(err);
      db.collection('tokens').deleteMany(params, (err, res) => {
        if (err) return reject(err);
        resolve(res);
        db.close();
      });
    }));
  }

  async updateToken(token, data) {
    return new Promise((resolve, reject) => MongoClient.connect(this.mongoUrl, (err, db) => {
      if (err) return reject(err);
      db.collection('tokens').updateOne({token: token}, {$set: data}, (err, res) => {
        if (err) return reject(err);
        resolve(res);
        db.close();
      });
    }));
  }
}

export default Token;