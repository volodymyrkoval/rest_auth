import Router from 'koa-router'
import MainController from './controllers/mainController'

let router = new Router();

router.post('/signin', MainController.signInAction);
router.post('/signup', MainController.signUpAction);
router.get('/info', MainController.infoAction);
router.get('/latency', MainController.latencyAction);
router.get('/logout', MainController.logoutAction);

export {router};
