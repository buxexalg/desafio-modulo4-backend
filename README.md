# Desafio Módulo 4 de Back-end - Cubos Academy

## API de gerenciamento de pagamentos.

Repositório referente a uma API REST que tem como função administrar um sistema de cadastro e gerenciamento de pagamentos irá alimentar a página do [Desafio de Front-end](https://github.com/buxexalg/desafio-modulo4-frontend) assim como autenticar o login da mesma.

# Conteúdos

-   Endpoints
    -   Requisição de autenticação
    -   Requisições de clientes e usuários
    -   Requisições de cobranças
    -   Requisição de relatório
-   Banco de Dados
-   Instalação
-   Variáveis de Ambiente
-   Dependências

## Endpoints

### Requisição de autenticação

#### Autenticar

POST `/auth`\
Recebe um JSON como entrada contendo email e senha e retorna um token de autenticação. O mesmo é válido por 1 hora.

##### Exemplo de JSON

```JS
{
	"email": "xxxx@xxxxx.com",
	"password": "123456"
}
```

### Requisições de clientes e usuários

#### Criar usuário

POST `/usuarios`\
Recebe um JSON como entrada contendo email, senha e nome e faz a adição de usuário no banco de dados. Todos os um campos são obrigatórios.

##### Exemplo de JSON

```JS
{
	"email": "exemplo@email.com",
    "senha": "minhasenha",
    "nome": "Nome do Usuario"
}
```

#### Criar cliente

POST `/clientes`\
Recebe um JSON como entrada contendo nome, cpf, email e tel e faz a adição de cliente no banco de dados. É necessário um token de autenticação para enviar uma requisição para esse endpoint.

##### Exemplo de JSON

```JS
{
    "nome": "Nome do Cliente",
    "cpf": "000.000.000-21",
    "email": "exemplo@email.com",
    "tel": "+5571999996688"
}
```

#### Editar cliente

PUT `/clientes`\
Recebe um JSON como entrada contendo id, nome, cpf e email e faz uma alteração no cadastro de um cliente no banco de dados. É necessário um token de autenticação para enviar uma requisição para esse endpoint.

##### Exemplo de JSON

```JS
{
	"id": "id_do_cliente",
    "nome": "Nome do Cliente",
    "cpf": "000.000.000-21",
    "email": "exemplo@email.com",
}
```

#### Listar clientes

GET `/clientes?clientesPorPagina=10&offset=20`\
Retorna todos os clientes do usuário logado de acordo com os querystrings. É necessário um token de autenticação para enviar uma requisição para esse endpoint e todos os campos são obrigatórios.

#### Buscar clientes

GET `/busca=texto da busca&clientesPorPagina=10&offset=20`\
Retorna todos os clientes do usuário logado de acordo com os querystrings. É necessário um token de autenticação para enviar uma requisição para esse endpoint e todos os campos são obrigatórios.

### Requisições de clientes e usuários

#### Criar cobrança

POST `/cobrancas`\
Recebe um JSON como entrada contendo idDoCliente, descricao do pagamento, valor e vencimento e faz a adição de cobrança no banco de dados associado ao cliente. É necessário um token de autenticação para enviar uma requisição para esse endpoint e todos os campos são obrigatórios.

##### Exemplo de JSON

```JS
{
    "idDoCliente": "idDoCliente",
    "descricao": "descrição da cobrança",
    "valor": 120000,
    "vencimento": "data_de_vencimento",
}
```

#### Listar cobrancas

PUT `/cobrancas`\
Altera o status de uma cobrança para `PAGO` a partir do id da mesmoa. É necessário um token de autenticação para enviar uma requisição para esse endpoint e todos os campos são obrigatórios.

#### Pagar cobrancas

PUT `/cobrancas?cobrancasPorPagina=10&offset=20`\
Retorna todos as cobranças e seus clientes do usuário logado de acordo com os querystrings.

##### Exemplo de JSON

```JS
{
    "idDaCobranca": "id_da_cobranca"
}
```

### Requisição de relatório

#### Obter relatório

GET `/relatorios`\
Retorna os dados consolidados de cobranças e clientes do usuário.

## Instalação

Para rodar o projeto, você precisará ter o Node.js instalado na sua máquina.

### Node

#### Instalação do Node no Windows

Acesse a página oficial do Node.js (https://nodejs.org) e baixe o instalador. Tenha certeza também que tem o `git` disponível no seu PATH, você também pode precisar do `npm`.

#### Instalação do Node no Linux

Você pode instalar facilmente o nodejs e o npm com um apt install, basta seguir os seguintes comandos.

          $ sudo apt install nodejs
          $ sudo apt install npm

#### Outros sistemas operacionais

Você pode achar mais informações sobre a instalação no site oficial do Node.js (https://nodejs.org/) e no site oficial do NPM.

### Banco de Dados

A inicialização do banco de dados pode ser feita através da inicialização em node do arquivo `./src/repositories/schema.js` adicionando `up()` na última linha. Para cadastrar as informações de um banco de dados, o arquivo `.env` pode ser utilizado, adicionando as seguintes informações:

```
DB_HOST=
DB_NAME=
DB_USER=
DB_PORT=
DB_PW=
```

### Outras dependências

Após instalar o Node, execute `$ npm install` para instalar as seguintes dependências:

-   [Koa](https://koajs.com/)
-   [Koa-bodyparser](https://www.npmjs.com/package/koa-bodyparser)
-   [Koa-router](https://www.npmjs.com/package/koa-router)
-   [Jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
-   [Dotenv](https://www.npmjs.com/package/dotenv)
-   [Axios](https://www.npmjs.com/package/axios)
-   [Nodemailer](www.npmjs.com/package/nodemailer)
-   [Node-postgres](https://www.npmjs.com/package/pg)
-   [Eslint](https://www.npmjs.com/package/eslint)
-   [Prettier](https://www.npmjs.com/package/prettier)