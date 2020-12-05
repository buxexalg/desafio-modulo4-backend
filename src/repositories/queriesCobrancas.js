const Database = require('../utils/database');

/* Query responsável por verificar cobrancas vencidas */
const verificaCobrancasVencidas = async () => {
	const query = {
		text: `UPDATE cobrancas
	SET status = 'VENCIDO'
	WHERE vencimento < now() and status = $1`,
		values: ['AGUARDANDO'],
	};

	await Database.query(query);
};

/* Query responsável por inserir uma nova cobrança */
const inserirNovaCobranca = async (jsonCobranca) => {
	await verificaCobrancasVencidas();
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
			jsonCobranca.dataVencimento,
			jsonCobranca.status,
			jsonCobranca.linkDoBoleto,
		],
	};

	return Database.query(query);
};

/* Query responsável por listar cobrancas de acordo com a querystring */
const listarCobrançasOffset = async (jsonQuerystring) => {
	await verificaCobrancasVencidas();
	const query = {
		text: `SELECT
				nome, idcobranca, id_cliente, descricaocobranca, valorcobranca, vencimento, linkdoboleto, status 
			from cobrancas 
			inner join clientes 
			on idcliente = id_cliente 
			where 
				idusuario = $1
				LIMIT $2
				OFFSET $3`,
		values: [
			jsonQuerystring.idUsuario,
			jsonQuerystring.cobrancasPorPagina,
			jsonQuerystring.offset,
		],
	};

	const result = await Database.query(query);

	return result.rows;
};

/* Query responsável por listar cobrancas de acordo com busca e querystrings */
const listarCobrançasOffsetBusca = async (jsonQuerystring) => {
	await verificaCobrancasVencidas();
	const query = {
		text: `SELECT
		nome,email, cpf, idcobranca, id_cliente, descricaocobranca, valorcobranca, vencimento, linkdoboleto, status 
	from cobrancas 
	inner join clientes 
	on idcliente = id_cliente 
	where 
		idusuario = $1 and
		(nome LIKE $2 or email LIKE $2 or cpf LIKE $2)
		limit $3
		offset $4`,
		values: [
			jsonQuerystring.idUsuario,
			`%${jsonQuerystring.busca}%`,
			jsonQuerystring.cobrancasPorPagina,
			jsonQuerystring.offset,
		],
	};

	const result = await Database.query(query);

	return result.rows;
};

/* Query responsável por listar todas as cobranças */
const listarCobranças = async (id) => {
	await verificaCobrancasVencidas();
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

/* Query responsável por pagar a cobrança */
const pagaCobranca = async (idCobranca) => {
	await verificaCobrancasVencidas();
	const query = {
		text: `UPDATE cobrancas
		SET
			status = $1
		where idcobranca = $2 and status=$3`,
		values: ['PAGO', idCobranca, 'AGUARDANDO'],
	};

	await Database.query(query);
};

module.exports = {
	inserirNovaCobranca,
	listarCobranças,
	pagaCobranca,
	listarCobrançasOffset,
	listarCobrançasOffsetBusca,
};
