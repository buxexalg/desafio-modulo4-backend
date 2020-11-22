const Database = require('../utils/database');

const inserirNovoCliente = async (jsonCliente) => {
	const query = {
		text: `insert into clientes
		(id_usuario, nome, email, cpf, celular)
		values
		($1, $2, $3, $4, $5)
		
		returning *`,
		values: [
			jsonCliente.userId,
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
			idCliente = $1
			and
			idUsuario = $2`,
		values: [jsonIds.idCliente, jsonIds.idUsuario],
	};

	const result = await Database.query(query);

	return result;
};

module.exports = {
	inserirNovoCliente,
	retornaCliente,
	editaCliente,
	verificaSeClienteEstaAssociadoAoUsuario,
};
