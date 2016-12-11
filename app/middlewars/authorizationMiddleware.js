import Token from '../managers/tokenManager'
import logToConsole from '../helpers/logToConsole'

export default async function authorizationMiddleware(ctx, next) {
  ctx = Object.assign(ctx, {
    auth: {
      authorized: false,
      id: null,
      token: undefined
    }
  });
  const token = ctx.request.body.token || ctx.request.query.token;
  if (token) {
    let tokenManager = new Token(),
        tokenData = await tokenManager.getToken(null, token).catch(e => {
          logToConsole(e);
          return false;
        });
    if (tokenData) {
      await tokenManager.updateToken(token, {createdAt: new Date()}).catch(e => {
        logToConsole(e);
        return false;
      });
      ctx.auth.authorized = true;
      ctx.auth.id = tokenData.id;
      ctx.auth.token = token;
    }
  }
  await next();
};