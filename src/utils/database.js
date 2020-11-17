require('dotenv').config();

const { Client } = require('pg');

/**
 * Dados de acesso ao banco de dados devem ser colocados no arquivo .env
 */

const database = new Client({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	password: process.env.DB_PW,
	user: process.env.DB_USER,
	database: process.env.DB_NAME,
	ssl: {
		rejectUnauthorized: false,
	},
});

database.connect((err) => {
	if (err) {
		console.error('connection error', err.stack);
	} else {
		console.log('connected');
	}
});

module.exports = database;
