const Router = require('koa-router');
const Usuarios = require('./controllers/usuarios');
const Clientes = require('./controllers/clientes');
const Cobrancas = require('./controllers/cobrancas');
const Relatorios = require('./controllers/relatorios');
const Password = require('./middlewares/encrypt');
const Auth = require('./controllers/auth');
const Session = require('./middlewares/session');

const router = new Router();
/* Rota de autenticação */
router.post('/auth', Auth.auth);

/* Cria um usuário no banco de dados */
router.post('/usuarios', Password.encrypt, Usuarios.criarUsuario);

/* Cria um cliente no banco de dados */
router.post('/clientes', Session.verify, Clientes.criarCliente);

/* Edita um cliente no banco de dados */
router.put('/clientes', Session.verify, Clientes.editarCliente);

/* Lista e busca clientes de acordo com os querystrings */
router.get('/clientes', Session.verify, Clientes.listarEBuscarClientes);

/* Cria uma cobrança no banco de dados */
router.post('/cobrancas', Session.verify, Cobrancas.criarCobranca);

/* Lista e busca cobranaçs de acordo com os querystrings */
router.get('/cobrancas', Session.verify, Cobrancas.listarCobrancas);

/* Paga uma cobrança */
router.put('/cobrancas', Session.verify, Cobrancas.pagaCobranca);

/* Gera relatório de clientes e cobranças */
router.get('/relatorios', Session.verify, Relatorios.geraRelatorio);

module.exports = router;
