const Router = require('koa-router');
const Usuarios = require('./controllers/usuarios');
const Password = require('./middlewares/encrypt');

const router = new Router();

router.post('/usuarios', Password.encrypt, Usuarios.criarUsuario);

module.exports = router;
