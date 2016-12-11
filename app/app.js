import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import config from 'config'
import {router} from './routes'
import authorization from './middlewars/authorizationMiddleware'

const app = new Koa();
app.use(bodyParser());
app.use(authorization);
app.use(router.routes()).use(router.allowedMethods());

app.listen(config.app.port, () => {
  console.log(`Service "${config.app.name}" started at http://127.0.0.1:${config.app.port}`);
});