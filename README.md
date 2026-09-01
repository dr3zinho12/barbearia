# Royal Cut

Sistema web completo de agendamento e gestão para barbearia, desenvolvido como projeto de TCC do curso técnico em
Desenvolvimento de Sistemas.

> O nome "Royal Cut" é configurável. Para renomear, edite apenas dois arquivos:
> [`frontend/src/config/brand.js`](frontend/src/config/brand.js) (interface) e
> [`backend/src/config/business.js`](backend/src/config/business.js) (API).

## Sumário

- [Descrição](#descrição)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Instalação e execução](#instalação-e-execução)
- [Credenciais de demonstração](#credenciais-de-demonstração)
- [Principais endpoints da API](#principais-endpoints-da-api)
- [Funcionalidades](#funcionalidades)
- [Testes automatizados](#testes-automatizados)
- [Documentação complementar](#documentação-complementar)
- [Licença](#licença)

## Descrição

O sistema permite que clientes criem contas, agendem horários com o barbeiro e serviço de sua escolha, gerenciem seus
agendamentos (cancelamento e remarcação) e assinem planos de serviço; e que administradores gerenciem clientes,
barbeiros, serviços, planos, agendamentos e horários de funcionamento, além de acompanhar estatísticas do negócio em
um dashboard.

## Tecnologias

**Front-End**: React 18, JavaScript (JSX), Vite, Tailwind CSS, React Router, React Hook Form, Axios, React Hot Toast.

**Back-End**: Node.js, JavaScript (módulos ES nativos), Express, Prisma ORM, Zod (validação), JWT (autenticação), bcrypt (hash de senha).

**Banco de dados**: PostgreSQL.

**Testes**: Vitest + Supertest (back-end).

## Arquitetura

Ver detalhamento completo em [`docs/arquitetura.md`](docs/arquitetura.md).

```
Front-End (React/Vite) ⇄ API REST (Node.js/Express) ⇄ PostgreSQL (via Prisma)
```

O back-end segue arquitetura em camadas: `routes → controllers → services → Prisma → PostgreSQL`, com middlewares de
autenticação (JWT), autorização por papel (`CLIENT`/`ADMIN`), validação (Zod) e tratamento centralizado de erros.

## Estrutura de pastas

```
black-blue-barber/
├── backend/
│   ├── prisma/           # schema.prisma e seed.js
│   ├── src/
│   │   ├── config/       # env, prisma client, identidade do negócio
│   │   ├── controllers/  # camada HTTP
│   │   ├── routes/       # definição das rotas
│   │   ├── services/     # regras de negócio
│   │   ├── middlewares/  # auth, validação, tratamento de erros
│   │   ├── validators/   # schemas Zod
│   │   └── utils/        # helpers (JWT, hash, tempo, erros)
│   └── tests/            # testes automatizados (Vitest + Supertest)
├── frontend/
│   └── src/
│       ├── pages/        # public/ client/ admin/
│       ├── layouts/      # PublicLayout, ClientLayout, AdminLayout
│       ├── components/   # componentes reutilizáveis
│       ├── contexts/     # AuthContext
│       ├── services/     # camada de comunicação com a API
│       └── config/       # identidade de marca
├── docs/                 # documentação técnica e de apoio ao TCC
├── LICENSE
└── README.md
```

## Instalação e execução

> **Atalho para Windows**: depois de instalar tudo pela primeira vez (passos abaixo), basta dar duplo clique em
> [`Iniciar Site.bat`](Iniciar%20Site.bat), na raiz do projeto. Ele confere se o banco de dados está no ar, liga o
> back-end e o front-end automaticamente, e abre o site sozinho no navegador.

Guia completo e detalhado em [`docs/instalacao.md`](docs/instalacao.md). Resumo:

```bash
# 1. Banco de dados
createdb black_blue_barber   # ou crie manualmente via psql/pgAdmin

# 2. Back-End
cd backend
cp .env.example .env          # edite DATABASE_URL e JWT_SECRET
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev                   # http://localhost:3333

# 3. Front-End (em outro terminal)
cd frontend
cp .env.example .env
npm install
npm run dev                   # http://localhost:5173
```

## Credenciais de demonstração

Todos os dados abaixo são **fictícios**, criados pelo script de seed (`npm run seed`).

| Perfil | E-mail | Senha |
|---|---|---|
| Administrador | admin@royalcut.com | Admin@123 |
| Cliente (exemplo) | carlos.souza@example.com | Cliente@123 |
| Cliente (exemplo) | rafael.lima@example.com | Cliente@123 |
| Barbeiro (exemplo) | andre@royalcut.com | Barbeiro@123 |
| Barbeiro (exemplo) | davi@royalcut.com | Barbeiro@123 |
| Barbeiro (exemplo) | wendel.samuel@royalcut.com | Barbeiro@123 |

> ⚠️ Rodar `npm run seed` **apaga e recria todos os dados** do banco (volta ao estado fictício inicial). Use com
> cuidado se você já tiver personalizado clientes, planos, barbeiros ou contas de administrador além dos padrões.

## Principais endpoints da API

Documentação completa em [`docs/api.md`](docs/api.md).

```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me

GET  /api/services
POST /api/services            (admin)

GET  /api/barbers
POST /api/barbers             (admin)

GET  /api/appointments/availability
POST /api/appointments        (cliente)
GET  /api/appointments/mine   (cliente)
GET  /api/appointments        (admin)

GET  /api/plans
POST /api/plans/:id/subscribe (cliente)

GET  /api/admin/dashboard     (admin)
```

## Funcionalidades

Lista completa em [`docs/funcionalidades.md`](docs/funcionalidades.md). Destaques:

- Cadastro e login de clientes com JWT e senhas com hash bcrypt.
- Agendamento em 4 passos com cálculo de disponibilidade em tempo real.
- Prevenção automática de conflitos de horário entre agendamentos.
- Cancelamento e remarcação com regra de antecedência mínima.
- Assinatura, troca e cancelamento de planos.
- Painel administrativo completo: clientes, barbeiros, serviços, agendamentos, planos e horários de funcionamento.
- Dashboard administrativo com estatísticas reais do negócio.

## Testes automatizados

```bash
cd backend
npm run test
```

Cobrem: cadastro e login, autorização por papel, CRUD de serviços e a regra mais crítica do sistema — a prevenção de
conflitos de agendamento. Requer um banco de dados PostgreSQL configurado e o seed executado (para o usuário admin).

## Documentação complementar

| Arquivo | Conteúdo |
|---|---|
| [`docs/arquitetura.md`](docs/arquitetura.md) | Arquitetura em camadas, decisões técnicas |
| [`docs/banco-de-dados.md`](docs/banco-de-dados.md) | Modelo de dados completo |
| [`docs/api.md`](docs/api.md) | Referência de todos os endpoints |
| [`docs/funcionalidades.md`](docs/funcionalidades.md) | Lista de funcionalidades e regras de negócio |
| [`docs/requisitos.md`](docs/requisitos.md) | Requisitos funcionais e não funcionais |
| [`docs/instalacao.md`](docs/instalacao.md) | Passo a passo de instalação |
| [`docs/tcc-documentacao.md`](docs/tcc-documentacao.md) | Esqueleto da monografia (ABNT NBR 14724) |
| [`docs/cronograma.md`](docs/cronograma.md) | Cronograma de desenvolvimento e marcos de versionamento |
| [`docs/apresentacao.md`](docs/apresentacao.md) | Roteiro sugerido para a apresentação do TCC |

## Licença

Este projeto está licenciado sob a licença MIT — veja o arquivo [LICENSE](LICENSE) para mais detalhes.
