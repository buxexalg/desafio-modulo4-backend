const Database = require('../utils/database');

const inserirNovaCobranca = async (jsonCobranca) => {
	const query = {
		text: `insert into cobrancas
		(id_cliente, valorcobranca, descricaocobranca, vencimento, status, linkdoboleto)
		values
		($1, $2, $3, $4, $5, $6)
		`,
		values: [
			jsonCobranca.idCliente,
			jsonCobranca.valor,
			jsonCobranca.descricao,
			jsonCobranca.vencimento,
			jsonCobranca.status,
			jsonCobranca.linkDoBoleto,
		],
	};

	console.log(jsonCobranca);

	return Database.query(query);
};

const listarCobranças = async (id) => {
	const query = {
		text: `SELECT
				idcobranca, id_cliente, descricaocobranca, valorcobranca, vencimento, linkdoboleto, status 
			from cobrancas 
			inner join clientes 
			on idcliente = id_cliente 
			where 
				idusuario = $1`,
		values: [id],
	};

	const result = await Database.query(query);

	return result.rows;
};

const pagaCobranca = async (idCobranca) => {
	const query = {
		text: `UPDATE cobrancas
		SET
			status = $1
		where idcobranca = $2`,
		values: ['PAGO', idCobranca],
	};

	await Database.query(query);
};

module.exports = { inserirNovaCobranca, listarCobranças, pagaCobranca };
