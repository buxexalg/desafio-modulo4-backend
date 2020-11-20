const jwt = require('jsonwebtoken');
const { falhaRequisicao } = require('../controllers/response');

require('dotenv').config();

/**
 * Função responsável por verificar se o token existe e, caso exista, se o mesmo é válido.
 */
const verify = async (ctx, next) => {
	try {
		const [bearer, token] = ctx.headers.authorization.split(' ');
		const verification = await jwt.verify(token, process.env.JWT_SECRET);
		ctx.state.userId = verification.id;
		ctx.state.email = verification.email;
		ctx.state.nome = verification.nome;
	} catch (err) {
		falhaRequisicao(ctx, 'Ação proibida', 403);
	}
	return next();
};

module.exports = { verify };
