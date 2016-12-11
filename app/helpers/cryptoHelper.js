import crypto from 'crypto';
import config from 'config';

function createMD5Hash(string) {
  return crypto.createHash('md5').update(string + config.security.salt).digest('hex');
}

function createTokenHash(id) {
  return crypto.createHash('md5').update(new Date() + id + config.security.salt).digest('hex')
}

export {createTokenHash};
export default createMD5Hash;