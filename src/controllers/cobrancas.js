/* eslint-disable consistent-return */
const Query = require('../repositories/queriesCobrancas');
const Pagarme = require('../utils/pagarme');
const Clientes = require('./clientes');
const Email = require('../utils/email');
const {
	calculaNumeroDePaginas,
	calculaPaginaAtual,
} = require('../utils/contadorPaginas');
const { sucessoRequisicao, falhaRequisicao } = require('./response');

/* Função responsável por criar uma cobrança */
const criarCobranca = async (ctx) => {
	if (!ctx.state.idUsuario) {
		return falhaRequisicao(
			ctx,
			'Faça login antes de cadastrar um cliente.',
			400
		);
	}
	const dataVencimento = new Date();

	dataVencimento.setDate(dataVencimento.getDate() + 2);

	const {
		idDoCliente = null,
		descricao = null,
		valor = null,
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
		dataVencimento,
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
			dataVencimento,
			linkDoBoleto: boleto.data.boleto_url,
			status: 'AGUARDANDO',
		});

		const cobranca = {
			cobranca: {
				idDoCliente,
				descricao,
				valor,
				dataVencimento,
				linkDoBoleto: boleto.data.boleto_url,
				status: 'AGUARDANDO',
			},
		};

		Email.enviarEmail(email, boleto.data.boleto_url);

		return sucessoRequisicao(ctx, cobranca, 201);
	}
};

/* Função responsável por listar uma cobrança */
const listarCobrancas = async (ctx) => {
	const {
		cobrancasPorPagina = null,
		offset = null,
		busca = null,
	} = ctx.query;

	if (!ctx.state.idUsuario) {
		return falhaRequisicao(
			ctx,
			'Faça login antes de cadastrar um cliente.',
			400
		);
	}

	const { idUsuario } = ctx.state;

	const listaTodasAsCobranças = await Query.listarCobranças(idUsuario);

	if (cobrancasPorPagina && offset && !busca) {
		const listaDeCobrancas = await Query.listarCobrançasOffset({
			idUsuario,
			cobrancasPorPagina,
			offset,
		});
		const paginaAtual = calculaPaginaAtual(offset);
		const totalDePaginas = await calculaNumeroDePaginas(
			listaTodasAsCobranças,
			cobrancasPorPagina
		);

		sucessoRequisicao(ctx, {
			paginaAtual,
			totalDePaginas,
			cobrancas: listaDeCobrancas,
		});
	} else if (cobrancasPorPagina && offset && busca) {
		const listaDeCobrancas = await Query.listarCobrançasOffsetBusca({
			idUsuario,
			cobrancasPorPagina,
			offset,
		});
		const paginaAtual = calculaPaginaAtual(offset);
		const totalDePaginas = await calculaNumeroDePaginas(
			listaDeCobrancas,
			cobrancasPorPagina
		);

		sucessoRequisicao(ctx, {
			paginaAtual,
			totalDePaginas,
			cobrancas: listaDeCobrancas,
		});
	} else {
		return falhaRequisicao(
			ctx,
			'Insira corretamente todos os dados necessários',
			400
		);
	}
};

/* Função responsável por pagar uma cobrança */
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
