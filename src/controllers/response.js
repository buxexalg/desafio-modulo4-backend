/**
 * Função de padronização de resposta de sucesso de requisição.
 */
const sucessoRequisicao = (ctx, conteudo, codigoREST = 200) => {
	ctx.status = codigoREST;
	ctx.body = {
		status: 'sucesso',
		dados: conteudo,
	};
};

/**
 * Função de padronização de resposta de falha de requisição.
 */
const falhaRequisicao = (ctx, mensagem, codigoREST = 404) => {
	ctx.status = codigoREST;
	ctx.body = {
		status: 'erro',
		dados: {
			message: mensagem,
		},
	};
};

module.exports = { sucessoRequisicao, falhaRequisicao };
