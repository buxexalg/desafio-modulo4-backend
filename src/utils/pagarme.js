const axios = require('axios');

require('dotenv').config();

/* Função responsável por gerar o boleto */

const gerarBoleto = async (jsonDadosUsuario) => {
	try {
		const boleto = await axios.post('https://api.pagar.me/1/transactions', {
			api_key: process.env.PAGARME_APIKEY,
			amount: jsonDadosUsuario.valor,
			payment_method: 'boleto',
			soft_descriptor: jsonDadosUsuario.descricao,
			boleto_expiration_date: jsonDadosUsuario.vencimento,
			customer: {
				external_id: jsonDadosUsuario.idCliente,
				name: jsonDadosUsuario.nome,
				email: jsonDadosUsuario.email,
				country: 'br',
				type: 'individual',
				documents: [{ type: 'cpf', number: jsonDadosUsuario.cpf }],
				phone_numbers: [jsonDadosUsuario.celular],
			},
		});

		return boleto;
	} catch (err) {
		return err.response.data.errors;
	}
};

module.exports = { gerarBoleto };
