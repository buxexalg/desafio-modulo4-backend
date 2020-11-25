const Query = require('../repositories/queriesCobrancas');
const Pagarme = require('../utils/pagarme');
const Clientes = require('./clientes');
const { sucessoRequisicao, falhaRequisicao } = require('./response');

const criarCobranca = async (ctx) => {
	if (!ctx.state.idUsuario) {
		return falhaRequisicao(
			ctx,
			'Faça login antes de cadastrar um cliente.',
			400
		);
	}

	const {
		idDoCliente = null,
		descricao = null,
		valor = null,
		vencimento = null,
	} = ctx.request.body;
	const idUsuarioLogado = ctx.state.idUsuario;

	const {
		nome,
		email,
		cpf,
		celular,
		idusuario,
	} = await Clientes.buscarClientePorId(idDoCliente);

	if (idUsuarioLogado !== idusuario) {
		return falhaRequisicao(
			ctx,
			'Não é possivel adicionar uma cobraça a um cliente que não faz parte do seu cadastro.',
			403
		);
	}

	const boleto = await Pagarme.gerarBoleto({
		idCliente: idDoCliente,
		valor,
		descricao,
		vencimento,
		nome,
		email,
		cpf,
		celular,
	});

	if (boleto[0]) {
		falhaRequisicao(ctx, boleto, 400);
	} else {
		await Query.inserirNovaCobranca({
			idCliente: idDoCliente,
			valor,
			descricao,
			vencimento,
			linkDoBoleto: boleto.data.boleto_url,
			status: 'AGUARDANDO',
		});

		const cobranca = {
			cobranca: {
				idDoCliente,
				descricao,
				valor,
				vencimento,
				linkDoBoleto: boleto.data.boleto_url,
				status: 'AGUARDANDO',
			},
		};

		//Enviar email

		return sucessoRequisicao(ctx, cobranca, 201);
	}
};

const listarCobrancas = async (ctx) => {
	const { cobrancasPorPagina = null, offset = null } = ctx.query;

	if (!ctx.state.idUsuario) {
		return falhaRequisicao(
			ctx,
			'Faça login antes de cadastrar um cliente.',
			400
		);
	}

	const { idUsuario } = ctx.state;

	if (cobrancasPorPagina && offset) {
		const listaDeCobrancas = await Query.listarCobranças(idUsuario);
		sucessoRequisicao(ctx, listaDeCobrancas);
	} else {
		return falhaRequisicao(
			ctx,
			'Insira corretamente todos os dados necessários',
			400
		);
	}
};

const pagaCobranca = async (ctx) => {
	if (!ctx.state.idUsuario) {
		return falhaRequisicao(
			ctx,
			'Faça login antes de cadastrar um cliente.',
			400
		);
	}

	const { idDaCobranca = null } = ctx.request.body;

	if (idDaCobranca) {
		Query.pagaCobranca(idDaCobranca);
		sucessoRequisicao(ctx, 'Cobrança paga com sucesso');
	} else {
		return falhaRequisicao(
			ctx,
			'Insira corretamente todos os dados necessários',
			400
		);
	}
};

module.exports = { criarCobranca, listarCobrancas, pagaCobranca };
