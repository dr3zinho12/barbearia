# Guia de Instalação

## Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior (recomendado 20 LTS)
- npm (instalado junto com o Node.js)

Não é preciso instalar nenhum banco de dados separado: o projeto usa **SQLite**, um banco de dados que vive dentro
de um único arquivo (`backend/prisma/dev.db`), criado automaticamente pelo Prisma.

Verifique as versões instaladas:

```bash
node -v
npm -v
```

## 1. Obtenha o código

```bash
git clone <url-do-repositorio>
cd black-blue-barber
```

## 2. Configurar e iniciar o Back-End

```bash
cd backend
cp .env.example .env
```

Edite o arquivo `.env` e ajuste:

- `DATABASE_URL`: já vem pronta como `file:./dev.db` — não precisa alterar.
- `JWT_SECRET`: substitua por um valor aleatório e forte (nunca reutilize o valor de exemplo em produção).
- `CORS_ORIGIN`: mantenha `http://localhost:5173` para desenvolvimento local.

Instale as dependências e prepare o banco:

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
```

O comando `prisma:migrate` cria as tabelas no banco a partir de `prisma/schema.prisma` (na primeira execução, será
solicitado um nome para a migration — por exemplo, `init`). O comando `seed` popula o banco com dados fictícios,
incluindo o usuário administrador.

Inicie a API:

```bash
npm run dev
```

A API estará disponível em `http://localhost:3333`. Acesse `http://localhost:3333/` no navegador para confirmar que
está online (retorna um JSON simples de status).

## 3. Configurar e iniciar o Front-End

Em um novo terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Por padrão, `VITE_API_URL` em `.env` aponta para `http://localhost:3333/api`, compatível com o back-end iniciado no
passo anterior.

O Front-End estará disponível em `http://localhost:5173`.

## 4. Acessar o sistema

Utilize as credenciais de demonstração (criadas pelo seed):

| Perfil | E-mail | Senha |
|---|---|---|
| Administrador | admin@royalcut.com | Admin@123 |
| Cliente | carlos.souza@example.com | Cliente@123 |

## 5. Rodar os testes automatizados do back-end

Com o banco de dados configurado e o seed executado (necessário para os testes de autorização, que usam o
administrador de demonstração):

```bash
cd backend
npm run test
```

## Solução de problemas comuns

| Sintoma | Causa provável | Solução |
|---|---|---|
| `Erro: Variável de ambiente obrigatória não definida` | Arquivo `.env` não criado/configurado | Copie `.env.example` para `.env` e preencha os valores |
| Erro de conexão com o banco | `DATABASE_URL` incorreta, ou a pasta `backend/prisma` sem permissão de escrita | Confirme que `DATABASE_URL="file:./dev.db"` está no `.env` e rode `npm run prisma:migrate` novamente |
| Front-End não recebe dados da API | `VITE_API_URL` incorreta ou back-end não iniciado | Confirme que a API está rodando em `http://localhost:3333` |
| Erro de CORS no navegador | `CORS_ORIGIN` no back-end diferente da URL do Front-End | Ajuste `CORS_ORIGIN` em `backend/.env` |
