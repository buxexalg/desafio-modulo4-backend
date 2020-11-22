/* eslint-disable no-unused-vars */
const jwt = require('jsonwebtoken');
const { falhaRequisicao } = require('../controllers/response');

require('dotenv').config();

/**
 * Função responsável por verificar se o token existe e, caso exista, se o mesmo é válido.
 */
const verify = async (ctx, next) => {
	const { authorization = null } = ctx.headers;
	if (authorization) {
		const [bearer, token] = authorization.split(' ');
		if (token !== undefined) {
			try {
				const verification = jwt.verify(token, process.env.JWT_SECRET);
				ctx.state.idUsuario = verification.idUsuario;
				ctx.state.email = verification.email;
				ctx.state.nome = verification.nome;
				return next();
			} catch (err) {
				falhaRequisicao(ctx, 'Ação proibida', 403);
			}
		}
	}

	return falhaRequisicao(ctx, 'Ação proibida', 403);
};

module.exports = { verify };
