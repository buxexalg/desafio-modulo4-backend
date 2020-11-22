const Router = require('koa-router');
const Usuarios = require('./controllers/usuarios');
const Clientes = require('./controllers/clientes');
const Password = require('./middlewares/encrypt');
const Auth = require('./controllers/auth');
const Session = require('./middlewares/session');

const router = new Router();

router.post('/auth', Auth.auth);

router.post('/usuarios', Password.encrypt, Usuarios.criarUsuario);

router.post('/clientes', Session.verify, Clientes.criarCliente);
router.put('/clientes', Session.verify, Clientes.editarCliente);

module.exports = router;
