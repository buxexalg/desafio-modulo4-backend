const Database = require('../utils/database');

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

const retornaCliente = async (email) => {
	const query = {
		text: `select * from clientes where email = $1`,
		values: [email],
	};
	const result = await Database.query(query);

	return result.rows.shift();
};

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

const listarClientes = async (jsonQuerystring) => {
	const query = {
		text: `SELECT * from clientes
			where
				idusuario = $1
			limit $2
			offset $3`,
		values: [
			jsonQuerystring.idUsuario,
			jsonQuerystring.clientesPorPagina,
			jsonQuerystring.offset,
		],
	};

	const result = await Database.query(query);

	return result.rows;
};

const buscarClientes = async (jsonQuerystring) => {
	const query = {
		text: `SELECT * from clientes
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

module.exports = {
	inserirNovoCliente,
	retornaCliente,
	editaCliente,
	verificaSeClienteEstaAssociadoAoUsuario,
	listarClientes,
	buscarClientes,
};
