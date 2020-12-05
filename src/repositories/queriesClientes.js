const Database = require('../utils/database');

/* Query responsável por inserir um novo cliente */
const inserirNovoCliente = async (jsonCliente) => {
	const query = {
		text: `insert into clientes
		(idusuario, nome, email, cpf, celular)
		values
		($1, $2, $3, $4, $5)
		
		returning *`,
		values: [
			jsonCliente.idUsuario,
			jsonCliente.nome,
			jsonCliente.email,
			jsonCliente.cpf,
			jsonCliente.tel,
		],
	};

	return Database.query(query);
};

/* Query responsável por retornar os dados de um cliente */
const retornaCliente = async (email) => {
	const query = {
		text: `select * from clientes where email = $1`,
		values: [email],
	};
	const result = await Database.query(query);

	return result.rows.shift();
};

/* Query responsável por editar um cliente */
const editaCliente = async (jsonCliente) => {
	const query = {
		text: `UPDATE clientes
		SET 
			nome = $1,
			email = $2,
			cpf = $3
		where idCliente = $4`,
		values: [
			jsonCliente.nome,
			jsonCliente.email,
			jsonCliente.cpf,
			jsonCliente.idCliente,
		],
	};

	await Database.query(query);
};

/* Query responsável por verificar se o cliente está associado ao usuário */
const verificaSeClienteEstaAssociadoAoUsuario = async (jsonIds) => {
	const query = {
		text: `SELECT * from clientes
		where
			idcliente = $1
			and
			idusuario = $2`,
		values: [jsonIds.idCliente, jsonIds.idUsuario],
	};

	const result = await Database.query(query);

	return result.rows;
};

/* Query responsável por listar clientes */
const listarClientes = async (jsonQuerystring) => {
	const query = {
		text: `
		SELECT recebidas.idcliente,
		recebidas.nome,
        recebidas.cpf,
        COALESCE(recebidas.cobrancasrecebidas, 0) as cobrancasrecebidas,
        COALESCE(feitas.cobrancasfeitas, 0) as cobrancasfeitas
			FROM
			(SELECT *
			FROM clientes
			LEFT JOIN
				(SELECT id_cliente,
						sum(valorcobranca) AS cobrancasrecebidas
				FROM cobrancas
				WHERE status = 'AGUARDANDO'
				GROUP BY id_cliente) AS tabelaFeitas ON idcliente = id_cliente) AS recebidas
			LEFT JOIN
			(SELECT id_cliente,
					sum(valorcobranca) AS cobrancasFeitas
			FROM cobrancas
			WHERE status = 'PAGO'
			GROUP BY id_cliente) AS feitas ON recebidas.idcliente = feitas.id_cliente
			WHERE idusuario = $1
			LIMIT $2
			OFFSET $3;
		`,
		values: [
			jsonQuerystring.idUsuario,
			jsonQuerystring.clientesPorPagina,
			jsonQuerystring.offset,
		],
	};

	const result = await Database.query(query);

	return result.rows;
};

/* Query responsável por listar todos os clientes */
const listarTodosClientes = async (idUsuario) => {
	const query = {
		text: `SELECT * from clientes
			where
				idusuario = $1
			`,
		values: [idUsuario],
	};

	const result = await Database.query(query);
	return result.rows;
};

/* Query responsável por buscar  clientes */
const buscarClientes = async (jsonQuerystring) => {
	const query = {
		text: `
		SELECT recebidas.idcliente,
		recebidas.nome,
        recebidas.cpf,
        COALESCE(recebidas.cobrancasrecebidas, 0) as cobrancasrecebidas,
        COALESCE(feitas.cobrancasfeitas, 0) as cobrancasfeitas
			FROM
			(SELECT *
			FROM clientes
			LEFT JOIN
				(SELECT id_cliente,
						sum(valorcobranca) AS cobrancasrecebidas
				FROM cobrancas
				WHERE status = 'AGUARDANDO'
				GROUP BY id_cliente) AS tabelaFeitas ON idcliente = id_cliente) AS recebidas
			LEFT JOIN
			(SELECT id_cliente,
					sum(valorcobranca) AS cobrancasFeitas
			FROM cobrancas
			WHERE status = 'PAGO'
			GROUP BY id_cliente) AS feitas ON recebidas.idcliente = feitas.id_cliente
		where 
			idusuario = $1 AND
			(nome LIKE $2 or email LIKE $2 or cpf LIKE $2)
		limit $3
		offset $4`,
		values: [
			jsonQuerystring.idUsuario,
			`%${jsonQuerystring.busca}%`,
			jsonQuerystring.clientesPorPagina,
			jsonQuerystring.offset,
		],
	};

	const result = await Database.query(query);

	return result.rows;
};

/* Query responsável por listar clientes de acordo com o ID do usuário */
const buscarClientePorIdDoCliente = async (id) => {
	const query = {
		text: `SELECT * 
		FROM 
			clientes 
		where 
			idcliente = $1`,
		values: [id],
	};

	const result = await Database.query(query);
	return result.rows[0];
};

/* Query responsável por buscar clientes inadimplentes */
const buscaClientesInadimplentes = async () => {
	const query = {
		text: `
		SELECT id_cliente,
		count(CASE
			WHEN estaInadimplente THEN 1
		END)
    
FROM
(SELECT *,
	    (vencimento > now()
	    AND status = $1) AS estaInadimplente
FROM cobrancas) AS inadimplentes
GROUP BY id_cliente`,
		values: ['AGUARDANDO'],
	};

	const result = await Database.query(query);

	return result.rows;
};

module.exports = {
	inserirNovoCliente,
	retornaCliente,
	editaCliente,
	verificaSeClienteEstaAssociadoAoUsuario,
	listarClientes,
	buscarClientes,
	buscarClientePorIdDoCliente,
	listarTodosClientes,
	buscaClientesInadimplentes,
};
