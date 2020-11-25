const Database = require('../utils/database');

const inserirNovaCobranca = async (jsonCobranca) => {
	const query = {
		text: `insert into cobrancas
		(id_cliente, valor_cobranca, descricao_cobranca, vencimento, status)
		values
		($1, $2, $3, $4, $5)
		`,
		values: [
			jsonCobranca.idCliente,
			jsonCobranca.valor,
			jsonCobranca.descricao,
			jsonCobranca.vencimento,
			jsonCobranca.status,
		],
	};

	return Database.query(query);
};


module.exports = { inserirNovaCobranca };
