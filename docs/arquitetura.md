# Arquitetura do Sistema

## Visão geral

O Black Blue Barber é uma aplicação web full stack dividida em dois projetos independentes que se comunicam por uma
API REST:

```
┌─────────────────────┐        HTTPS / JSON        ┌──────────────────────┐        SQL (Prisma)       ┌──────────────┐
│   Front-End (SPA)    │ ─────────────────────────▶ │   Back-End (API)      │ ─────────────────────────▶ │  PostgreSQL  │
│  React + JavaScript  │ ◀───────────────────────── │  Node.js + Express    │ ◀───────────────────────── │              │
│  Vite + Tailwind CSS │        JWT no header        │  JavaScript + Prisma  │                            │              │
└─────────────────────┘                              └──────────────────────┘                            └──────────────┘
```

O Front-End nunca acessa o banco de dados diretamente: toda operação passa pela API, que aplica autenticação,
autorização, validação e regras de negócio antes de persistir ou retornar dados.

## Back-End: arquitetura em camadas

O back-end segue uma arquitetura em camadas, isolando responsabilidades:

```
Requisição HTTP
      │
      ▼
  routes/            → define os endpoints e encadeia os middlewares
      │
      ▼
  middlewares/        → autenticação (JWT), autorização por papel, validação (Zod)
      │
      ▼
  controllers/        → recebe a requisição, delega ao service, formata a resposta HTTP
      │
      ▼
  services/           → contém as regras de negócio (ex.: cálculo de disponibilidade,
      │                  prevenção de conflitos, regras de cancelamento)
      ▼
  Prisma Client        → executa as consultas SQL de forma tipada
      │
      ▼
  PostgreSQL
```

Cada camada só conhece a camada imediatamente abaixo, o que facilita testes, manutenção e substituição de partes do
sistema sem efeitos colaterais em outras camadas.

### Por que essa separação?

- **routes**: mantém o roteamento declarativo e legível, sem lógica de negócio.
- **middlewares**: centraliza autenticação/autorização/validação, evitando repetição em cada controller.
- **controllers**: fina camada de tradução HTTP ⇄ domínio (não deve conter regra de negócio).
- **services**: concentra as regras de negócio, tornando-as testáveis independentemente do Express.
- **utils**: funções puras reutilizáveis (hash de senha, JWT, manipulação de datas/horários, erros customizados).

## Front-End: arquitetura por funcionalidade

```
src/
├── pages/        → uma pasta por área (public, client, admin), um arquivo por tela
├── layouts/       → moldura visual de cada área (Navbar/Footer, Sidebar do cliente, Sidebar do admin)
├── components/    → componentes reutilizáveis e sem regra de negócio própria
├── contexts/      → estado global de autenticação (AuthContext)
├── services/      → camada de comunicação com a API (um arquivo por recurso)
├── hooks/         → hooks reutilizáveis
├── utils/         → formatação de moeda, data, telefone etc.
└── config/        → identidade visual/textual da marca (brand.js)
```

O roteamento usa `react-router-dom` com três grupos de rotas:

1. **Públicas** (`PublicLayout`): Home, Serviços, Planos, Barbeiros, Login, Cadastro, recuperação de senha.
2. **Cliente** (`ClientLayout`, protegida por `ProtectedRoute` exigindo papel `CLIENT`).
3. **Administrador** (`AdminLayout`, protegida por `ProtectedRoute` exigindo papel `ADMIN`).

O `ProtectedRoute` verifica o usuário autenticado (via `AuthContext`) e o papel exigido, redirecionando para `/login`
ou para a página inicial quando o acesso não é permitido — garantindo que um cliente nunca acesse rotas
administrativas mesmo alterando a URL diretamente no navegador (a proteção real, porém, está no back-end).

## Autenticação e autorização

- Login e cadastro retornam um **token JWT** assinado pelo back-end, armazenado no `localStorage` do navegador.
- Toda requisição autenticada envia o token no header `Authorization: Bearer <token>`.
- O middleware `authenticate` valida o token e popula `req.user` com `{ id, role }`.
- O middleware `authorize(...roles)` verifica se `req.user.role` está entre os papéis permitidos, retornando `403`
  caso contrário.
- Rotas administrativas (`/api/admin/*` e as operações de escrita de serviços, barbeiros, planos e horários) exigem
  `role === 'ADMIN'`. Isso é validado **no back-end**, portanto immutável por manipulação do Front-End.

## Prevenção de conflitos de agendamento

A regra mais crítica do sistema é impedir que dois agendamentos ocupem o mesmo horário do mesmo barbeiro. Isso é
resolvido em `appointment.service.js`:

1. Calcula-se o expediente do barbeiro para o dia da semana solicitado (horário próprio ou, na ausência dele, o
   horário padrão da barbearia).
2. Geram-se horários candidatos em intervalos configuráveis (`slotStepMinutes`) dentro do expediente.
3. Removem-se os horários que colidem com bloqueios (`BlockedSchedule`) ou com agendamentos já existentes
   (`SCHEDULED`, `CONFIRMED` ou `COMPLETED`) do mesmo barbeiro naquele dia.
4. Ao confirmar um novo agendamento, a disponibilidade é **recalculada dentro de uma transação Prisma** imediatamente
   antes da escrita, evitando que dois clientes garantam o mesmo horário em requisições quase simultâneas.

## Decisões técnicas relevantes

| Decisão | Motivo |
|---|---|
| Prisma como ORM | API de consultas simples e legível, migrations versionadas, produtividade em projeto de curso técnico |
| Zod para validação | Validação declarativa, reaproveitável entre criação/atualização, mensagens de erro claras |
| JWT sem refresh token | Simplicidade adequada ao escopo acadêmico; token de 7 dias é suficiente para demonstração |
| Token de redefinição de senha retornado pela API | Não há serviço de e-mail configurado no projeto; o token é devolvido diretamente na resposta, documentado como comportamento de demonstração |
| Tailwind CSS | Consistência visual rápida, fácil de manter uma identidade própria sem CSS customizado extenso |
| Um único banco relacional (PostgreSQL) | Todas as entidades são fortemente relacionadas (agendamento depende de cliente, barbeiro e serviço) |
