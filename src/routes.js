const Router = require('koa-router');
const Usuarios = require('./controllers/usuarios');
const Clientes = require('./controllers/clientes');
const Cobrancas = require('./controllers/cobrancas');
const Password = require('./middlewares/encrypt');
const Auth = require('./controllers/auth');
const Session = require('./middlewares/session');

const router = new Router();

router.post('/auth', Auth.auth);

router.post('/usuarios', Password.encrypt, Usuarios.criarUsuario);

router.post('/clientes', Session.verify, Clientes.criarCliente);
router.put('/clientes', Session.verify, Clientes.editarCliente);
router.get('/clientes', Session.verify, Clientes.listarEBuscarClientes);

router.post('/cobrancas', Session.verify, Cobrancas.criarCobranca);


module.exports = router;
