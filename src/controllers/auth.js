const jwt = require('jsonwebtoken');
const { falhaRequisicao, sucessoRequisicao } = require('./response');
const Password = require('../utils/password');
const Query = require('../repositories/queriesUsuarios');

require('dotenv').config();

const auth = async (ctx) => {
	const { email = null, senha = null } = ctx.request.body;

	if (!email || !senha) {
		return falhaRequisicao(ctx, 'Pedido mal formatado.', 400);
	}

	const dadosUsuario = await Query.retornaUsuario(email);
	if (dadosUsuario) {
		const comparison = await Password.check(senha, dadosUsuario.senha);
		if (comparison) {
			const token = jwt.sign(
				{
					id: dadosUsuario.id,
					email: dadosUsuario.email,
					nome: dadosUsuario.nome,
				},
				process.env.JWT_SECRET,
				{
					expiresIn: '1h',
				}
			);
			return sucessoRequisicao(ctx, { token }, 201);
		}
	}

	return falhaRequisicao(ctx, 'Email ou senha incorretos.', 400);
};

module.exports = { auth };
