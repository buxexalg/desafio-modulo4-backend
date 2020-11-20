const Database = require('../utils/database');

const inserirNovoCliente = async (jsonCliente) => {
	const query = {
		text: `insert into clientes
		(id_usuario, nome, email, cpf, celular)
		values
		($1, $2, $3, $4, $5)`,
		values: [
			jsonCliente.userId,
			jsonCliente.nome,
			jsonCliente.email,
			jsonCliente.cpf,
			jsonCliente.tel,
		],
	};

	await Database.query(query);
};

const retornaCliente = async (email) => {
	const query = {
		text: `select * from clientes where email = $1`,
		values: [email],
	};
	const result = await Database.query(query);

	return result.rows.shift();
};

module.exports = { inserirNovoCliente, retornaCliente };
