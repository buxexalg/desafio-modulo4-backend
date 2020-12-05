const Password = require('../utils/password');
const { falhaRequisicao } = require('../controllers/response');

/* Função responsável por encriptar amsenha */
const encrypt = async (ctx, next) => {
	const { senha = null } = ctx.request.body;

	if (!senha) {
		return falhaRequisicao(
			ctx,
			'Insira corretamente todos os dados necessários',
			400
		);
	}

	const hash = await Password.encrypt(senha);

	ctx.state.hash = hash;

	return next();
};

module.exports = { encrypt };
