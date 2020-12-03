require('dotenv').config();

const cors = require('@koa/cors');
const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const router = require('./src/routes');

const server = new Koa();

const port = process.env.PORT || 8081;

server.use(cors());
server.use(bodyparser());
server.use(router.routes());

server.listen(port, () => console.log('Rodando!'));
