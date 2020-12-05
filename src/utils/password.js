const bcrypt = require('bcrypt');

/* Checa hash de senha com base no JWT */
const check = async (password, hash) => {
	const comparison = await bcrypt.compare(password, hash);
	return comparison;
};

/* Cria hash de senha com base no JWT */
const encrypt = async (password) => {
	const hash = await bcrypt.hash(password, 10);
	return hash;
};

module.exports = { check, encrypt };
