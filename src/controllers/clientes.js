const Query = require('../repositories/queriesClientes');
const { sucessoRequisicao, falhaRequisicao } = require('./response');

const criarCliente = async (ctx) => {
	if (!ctx.state.userId) {
		return falhaRequisicao(
			ctx,
			'Faça login antes de cadastrar um cliente.',
			400
		);
	}

	const {
		nome = null,
		cpf = null,
		email = null,
		tel = null,
	} = ctx.request.body;
	const { userId } = ctx.state;

	const cadastroCliente = await Query.retornaCliente(email);
	if (!nome || !cpf || !email || !tel) {
		falhaRequisicao(
			ctx,
			'Insira corretamente todos os dados necessários',
			400
		);
	} else if (cadastroCliente) {
		return falhaRequisicao(ctx, 'Cliente já cadastrado', 400);
	}

	const novoCliente = { nome, cpf, email, tel, userId };
	await Query.inserirNovoCliente(novoCliente);
	const clienteBd = await Query.retornaCliente(email);
	return sucessoRequisicao(ctx, { id: clienteBd.id_cliente }, 201);
};

module.exports = { criarCliente };
