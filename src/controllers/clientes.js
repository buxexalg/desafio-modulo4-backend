const Query = require('../repositories/queriesClientes');
const { sucessoRequisicao, falhaRequisicao } = require('./response');

const criarCliente = async (ctx) => {
	if (!ctx.state.idUsuario) {
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
	const { idUsuario } = ctx.state;

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

	const novoCliente = { nome, cpf, email, tel, idUsuario };
	const clienteBd = await Query.inserirNovoCliente(novoCliente);
	return sucessoRequisicao(ctx, { id: clienteBd.rows[0].idcliente }, 201);
};

const editarCliente = async (ctx) => {
	if (!ctx.state.idUsuario) {
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
		id = null,
	} = ctx.request.body;
	const { idUsuario } = ctx.state;

	if (!nome || !cpf || !email || !id) {
		falhaRequisicao(
			ctx,
			'Insira corretamente todos os dados necessários',
			400
		);
	}

	const jsonIds = { idCliente: id, idUsuario };
	const dadosAEditar = { idCliente: id, nome, email, cpf };

	const verificarId = await Query.verificaSeClienteEstaAssociadoAoUsuario(
		jsonIds
	);

	if (!verificarId) {
		return falhaRequisicao(
			ctx,
			'O cliente não está associado a este usuário.',
			403
		);
	}
	await Query.editaCliente(dadosAEditar);

	return sucessoRequisicao(ctx, dadosAEditar);
};

const listarEBuscarClientes = async (ctx) => {
	const { clientesPorPagina = null, offset = null, busca = null } = ctx.query;

	if (!ctx.state.idUsuario) {
		return falhaRequisicao(
			ctx,
			'Faça login antes de cadastrar um cliente.',
			400
		);
	}

	const { idUsuario } = ctx.state;

	if (clientesPorPagina && offset && !busca) {
		const listaDeClientes = await Query.listarClientes({
			clientesPorPagina,
			offset,
			idUsuario,
		});

		sucessoRequisicao(ctx, listaDeClientes);
	} else if (clientesPorPagina && offset && busca) {
		const listaDeClientes = await Query.buscarClientes({
			clientesPorPagina,
			offset,
			idUsuario,
			busca,
		});

		sucessoRequisicao(ctx, listaDeClientes);
	} else {
		return falhaRequisicao(
			ctx,
			'Insira corretamente todos os dados necessários',
			400
		);
	}
};

const buscarClientePorId = async (id) => {
	const informacoesClientes = await Query.buscarClientePorIdDoCliente(id);

	return informacoesClientes;
};

module.exports = {
	criarCliente,
	editarCliente,
	listarEBuscarClientes,
	buscarClientePorId,
};
