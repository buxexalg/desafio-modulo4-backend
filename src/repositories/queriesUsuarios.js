const Database = require('../utils/database');

/* Query responsável por inserir um usuario */
const inserirNovoUsuario = async (jsonUsuario) => {
	const query = {
		text: `insert into usuarios 
		(nome, email, senha)
		values
		($1, $2, $3)
		
		returning *`,
		values: [jsonUsuario.nome, jsonUsuario.email, jsonUsuario.senha],
	};

	return Database.query(query);
};

/* Query responsável por retornar um usuario */
const retornaUsuario = async (email) => {
	const query = {
		text: `select * from usuarios where email = $1`,
		values: [email],
	};
	const result = await Database.query(query);

	return result.rows.shift();
};

module.exports = { inserirNovoUsuario, retornaUsuario };
