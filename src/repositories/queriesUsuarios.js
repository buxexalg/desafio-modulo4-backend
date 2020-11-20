const Database = require('../utils/database');

const inserirNovoUsuario = async (jsonUsuario) => {
	const query = {
		text: `insert into usuarios 
		(nome, email, senha)
		values
		($1, $2, $3)`,
		values: [jsonUsuario.nome, jsonUsuario.email, jsonUsuario.senha],
	};

	await Database.query(query);
};

const retornaUsuario = async (email) => {
	const query = {
		text: `select * from usuarios where email = $1`,
		values: [email],
	};
	const result = await Database.query(query);

	return result.rows.shift();
};

module.exports = { inserirNovoUsuario, retornaUsuario };
