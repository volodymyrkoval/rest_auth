import http from 'http'
import {isCredentialsValid, checkType} from '../helpers/validationHelper'
import User from '../managers/userManager'
import Token from '../managers/tokenManager'
import createMD5Hash from '../helpers/cryptoHelper'
import _ from 'lodash'
import getPingTime from '../managers/pingManager'
import logToConsole from '../helpers/logToConsole'

class MainController {
  /**
   * curl -XPOST "127.0.0.1:4000/signin" --data "id=example@example.com&password=mypass"
   * @param next
   */
  static async signInAction(next) {
    let id = this.request.body.id,
        password = this.request.body.password;

    let userManager = new User,
        credentialsAreRight = await userManager
            .findUser(id, createMD5Hash(password))
            .catch(e => {
              logToConsole(e);
              return false;
            });
    if (credentialsAreRight) {
      let tokenManager = new Token;
      let token = await tokenManager.createToken(id).catch(e => {
        logToConsole(e);
        return false;
      });
      this.status = 201;
      this.body = {token: token}
    } else {
      this.status = 400;
    }
    this.body = Object.assign(this.body || {}, {
      message: http.STATUS_CODES[this.status],
      status: this.status
    });
    await next;
  }

  /**
   * curl -XPOST "127.0.0.1:4000/signup" --data "email=example@example.com&password=mypass&phone=0432123456"
   * @param next
   */
  static async signUpAction(next) {
    let id = this.request.body.id,
        password = this.request.body.password,
        type = checkType(id);

    if (isCredentialsValid(id, type, password)) {
      let user = new User,
          userExists = await user.findUser(id).catch(e => {
            logToConsole(e);
            return false;
          });
      if (userExists) {
        this.status = 409;
      } else {
        let newUserCreated = await user.createUser(id, createMD5Hash(password), type).catch(e => {
          logToConsole(e);
          return false;
        });
        if (newUserCreated) {
          let tokenManager = new Token;
          this.status = 201;
          this.body = {
            token: await tokenManager.createToken(id).catch(e => {
              logToConsole(e);
              return false;
            })
          }
        } else {
          this.status = 500;
        }
      }
    } else {

      this.status = 400;
    }
    this.body = Object.assign(this.body || {}, {
      message: http.STATUS_CODES[this.status],
      status: this.status
    });
    await next;
  }

  /**
   * curl -XGET "127.0.0.1:4000/info/?token=4e5d76bb18cc8f8b202f9b412cb25c9a"
   * @param next
   */
  static async infoAction(next) {
    if (this.auth.authorized) {
      let user = new User,
          userData = await user.findUser(this.auth.id).catch(e => {
            logToConsole(e);
            return false;
          });
      if (userData) {
        this.body = _.pick(userData, ['id', 'type']);
      } else {
        this.status = 404;
      }
    } else {
      this.status = 401;
    }
    this.body = Object.assign(this.body || {}, {
      message: http.STATUS_CODES[this.status],
      status: this.status
    });
    await next;
  }

  /**
   * curl -XGET "127.0.0.1:4000/latency/?token=4e5d76bb18cc8f8b202f9b412cb25c9a"
   * @param next
   */
  static async latencyAction(next) {
    if (this.auth.authorized) {
      let pingTime = await getPingTime().catch(e => {
        logToConsole(e);
        return false;
      });
      if (pingTime) {
        this.body = {
          pingTime: pingTime
        };
        this.status = 200;
      } else {
        this.status = 503;
      }
    } else {
      this.status = 401;
    }
    this.body = Object.assign(this.body || {}, {
      message: http.STATUS_CODES[this.status],
      status: this.status
    });
    await next;
  }

  /**
   * curl -XGET "127.0.0.1:4000/logout/?token=4e5d76bb18cc8f8b202f9b412cb25c9a&all=true"
   * @param next
   */
  static async logoutAction(next) {
    let removeAllTokens = this.request.query.all === 'true';
    if (this.auth.authorized) {
      let tokenManager = new Token;
      if (removeAllTokens) {
        await tokenManager.removeTokens(this.auth.id).catch(e => {
          logToConsole(e);
          return false;
        });
      } else {
        await tokenManager.removeTokens(null, this.auth.token).catch(e => {
          logToConsole(e);
          return false;
        });
      }
      this.status = 201;
    } else {
      this.status = 401;
    }
    this.body = Object.assign(this.body || {}, {
      message: http.STATUS_CODES[this.status],
      status: this.status
    });
    await next;
  }
}

export default MainController;