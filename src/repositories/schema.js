/* eslint-disable no-unused-vars */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
const Database = require('../utils/database');

const schema = {
	1: `CREATE TABLE IF NOT EXISTS usuarios (
		id_usuario serial,
		nome varchar(255),
		email varchar(255),
		senha varchar(255)
	);`,
	2: `CREATE TABLE IF NOT EXISTS clientes (
		id_cliente serial,
		id_usuario integer,
		nome varchar(255),
		email varchar(255),
		cpf varchar(255),
		celular varchar(255)
	);`,
	3: `CREATE TABLE IF NOT EXISTS cobrancas (
		id_cobranca serial,
		id_cliente integer,
		valor_cobranca integer,
		descricao_cobranca varchar(255),
		vencimento date,
		status varchar(255)
	);`,
};

/**
 * Função executa a query DROP TABLE tabela
 */
const drop = async (tabela) => {
	if (tabela) {
		await Database.query(`drop table ${tabela}`);
	}
};

/**
 * Função responsável pelas queries CREATE TABLE e ALTET TABLE do BD. Utilize um número como parâmetro para rodar um schema específico ou deixe em branco para todos.
 */
const up = async (numeroSchema = null) => {
	if (!numeroSchema) {
		for (const valor in schema) {
			await Database.query({ text: schema[valor] });
		}
	} else {
		await Database.query({ text: schema[numeroSchema] });
	}
};

/* drop(); */

/* up(); */
