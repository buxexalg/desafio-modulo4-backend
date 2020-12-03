/* eslint-disable consistent-return */
/* eslint-disable no-restricted-syntax */
const QueryClientes = require('../repositories/queriesClientes');
const QueryCobrancas = require('../repositories/queriesCobrancas');
const { sucessoRequisicao, falhaRequisicao } = require('./response');

const contaAdimplentesEInadimplentesESaldo = async (idUsuario) => {
	const clientesInadimplentes = await QueryClientes.buscaClientesInadimplentes();
	let inadimplentes = 0;
	let adimplentes = 0;
	let saldo = 0;

	const listaDeClientes = await QueryClientes.listarClientes({
		clientesPorPagina: null,
		offset: null,
		idUsuario,
	});

	listaDeClientes.forEach((cliente) => {
		saldo += parseInt(cliente.cobrancasrecebidas, 10);
		for (const item of clientesInadimplentes) {
			if (item.id_cliente === cliente.idcliente && item.count > 0) {
				inadimplentes += 1;
			} else {
				adimplentes += 1;
			}
		}
	});

	return {
		inadimplentes,
		adimplentes,
		saldo,
	};
};

const qtdDeCobrancas = async (idUsuario) => {
	let pagas = 0;
	let vencidas = 0;
	let aguardando = 0;
	const listaDeCobrancas = await QueryCobrancas.listarCobranças(idUsuario);

	for (const cobranca of listaDeCobrancas) {
		if (cobranca.status === 'AGUARDANDO') {
			aguardando += 1;
		} else if (cobranca.status === 'PAGO') {
			vencidas += 1;
		} else if (cobranca.status === 'VENCIDO') {
			pagas += 1;
		}
	}

	return {
		aguardando,
		vencidas,
		pagas,
	};
};

const geraRelatorio = async (ctx) => {
	if (!ctx.state.idUsuario) {
		return falhaRequisicao(
			ctx,
			'Faça login antes de cadastrar um cliente.',
			400
		);
	}

	const { idUsuario } = ctx.state;

	const {
		adimplentes,
		inadimplentes,
		saldo,
	} = await contaAdimplentesEInadimplentesESaldo(idUsuario);

	const { pagas, vencidas, aguardando } = await qtdDeCobrancas(idUsuario);
	const response = {
		relatorio: {
			qtdClientesAdimplentes: adimplentes,
			qtdClientesInadimplentes: inadimplentes,
			qtdCobrancasPrevistas: aguardando,
			qtdCobrancasPagas: pagas,
			qtdCobrancasVencidas: vencidas,
			saldoEmConta: saldo,
		},
	};

	sucessoRequisicao(ctx, response);
};

module.exports = { geraRelatorio };
