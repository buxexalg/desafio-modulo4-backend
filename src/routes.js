const Router = require('koa-router');
const Usuarios = require('./controllers/usuarios');
const Password = require('./middlewares/encrypt');
const Auth = require('./controllers/auth');

const router = new Router();

router.post('/auth', Auth.auth);

router.post('/usuarios', Password.encrypt, Usuarios.criarUsuario);

module.exports = router;
