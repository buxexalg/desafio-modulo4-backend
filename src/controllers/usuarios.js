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
		return falhaRequisicao(ctx, 'Usuário já cadastrado.', 400);
	}
	const senha = hash;
	const novoUsuario = { nome, email, senha };
	await Query.inserirNovoUsuario(novoUsuario);
	const usuarioBd = await Query.retornaUsuario(email);
	return sucessoRequisicao(ctx, { id: usuarioBd.id_usuario }, 201);
};

module.exports = { criarUsuario };
