const calculaNumeroDePaginas = async (listaDeClientes, clientesPorPagina) => {
	const lista = await listaDeClientes;
	const tamanhoListaDeClientes = await lista.length;
	let paginas = 0;
	if (tamanhoListaDeClientes % clientesPorPagina === 0) {
		paginas = tamanhoListaDeClientes / clientesPorPagina;
	} else {
		paginas =
			(tamanhoListaDeClientes -
				(tamanhoListaDeClientes % clientesPorPagina)) /
				clientesPorPagina +
			1;
	}

	return paginas;
};

const calculaPaginaAtual = (offset) => {
	const paginaAtual = offset / 10 + 1;

	return paginaAtual;
};

module.exports = { calculaNumeroDePaginas, calculaPaginaAtual };
