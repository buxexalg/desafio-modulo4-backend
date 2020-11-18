const Query = require('../repositories/queriesUsuarios');
const { falhaRequisicao, sucessoRequisicao } = require('./response');

const criarUsuario = async (ctx) => {
	const { email = null, nome = null } = ctx.request.body;
	const { hash } = ctx.state;
	const cadastroUsuario = await Query.retornaUsuario(email);
	if (!email || !nome) {
		falhaRequisicao(
			ctx,
			'Insira corretamente todos os dados necessários',
			400
		);
	} else if (cadastroUsuario) {
		console.log(cadastroUsuario);
		return falhaRequisicao(ctx, 'Email já cadastrado.', 400);
	}
	const senha = hash;
	const novoUsuario = { nome, email, senha };
	await Query.inserirNovoUsuario(nome, email, senha);
	return sucessoRequisicao(ctx, novoUsuario);
};

module.exports = { criarUsuario };
