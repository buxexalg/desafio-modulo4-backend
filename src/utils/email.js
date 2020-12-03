const nodemailer = require('nodemailer');

require('dotenv').config();

const config = {
	host: process.env.MAILTRAP_HOST,
	port: process.env.MAILTRAP_PORT,
	secure: false,
	auth: {
		user: process.env.MAILTRAP_USER,
		pass: process.env.MAILTRAP_PASS,
	},
};

const transport = nodemailer.createTransport(config);

const enviarEmail = async (email, boleto) => {
	let emailEnviado = await transport.sendMail({
		from: 'Cubos Finanças" <financas@cubos.academy>',
		to: email,
		subject: 'O seu boleto chegou!',
		text: 'Chegou a segunda via do seu boleto!',
		html: `<h1>Boleto massa para ser pago!</h1>
				<a href=${boleto}>Boleto!</a>`,
	});

	return emailEnviado;
};

module.exports = { enviarEmail };
