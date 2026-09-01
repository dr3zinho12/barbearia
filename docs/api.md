# Referência da API

URL base local: `http://localhost:3333/api`

Todas as respostas são em JSON. Rotas autenticadas exigem o header:

```
Authorization: Bearer <token>
```

Erros seguem o formato:

```json
{ "message": "Descrição do erro" }
```

Erros de validação (Zod) incluem também a lista de campos:

```json
{ "message": "Dados inválidos", "errors": [{ "path": "email", "message": "E-mail inválido" }] }
```

## Autenticação — `/auth`

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/auth/register` | Público | Cria uma conta de cliente e retorna `{ user, token }` |
| POST | `/auth/login` | Público | Autentica e retorna `{ user, token }` |
| POST | `/auth/forgot-password` | Público | Gera um token de redefinição de senha (ver observação abaixo) |
| POST | `/auth/reset-password` | Público | Redefine a senha a partir do token |
| GET | `/auth/me` | Autenticado | Retorna os dados do usuário logado |
| PUT | `/auth/me` | Autenticado | Atualiza nome/telefone do usuário logado |
| PUT | `/auth/me/password` | Autenticado | Altera a senha (exige senha atual) |

> **Recuperação de senha**: como este é um projeto acadêmico sem serviço de e-mail configurado, o endpoint
> `/auth/forgot-password` retorna o `resetToken` diretamente na resposta (em produção, seria enviado por e-mail).

## Serviços — `/services`

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/services` | Público | Lista serviços (visitantes veem apenas ativos; administradores autenticados veem todos) |
| GET | `/services/:id` | Público | Detalhe de um serviço |
| POST | `/services` | Admin | Cria um serviço |
| PUT | `/services/:id` | Admin | Atualiza um serviço |
| DELETE | `/services/:id` | Admin | Remove um serviço (ou desativa, se houver agendamentos vinculados) |

## Barbeiros — `/barbers`

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/barbers` | Público | Lista barbeiros (mesma regra de ativos/inativos dos serviços) |
| GET | `/barbers/:id` | Público | Detalhe de um barbeiro, incluindo horários de trabalho |
| POST | `/barbers` | Admin | Cadastra um barbeiro |
| PUT | `/barbers/:id` | Admin | Atualiza um barbeiro |
| DELETE | `/barbers/:id` | Admin | Remove um barbeiro (ou desativa, se houver agendamentos vinculados) |
| PUT | `/barbers/:id/working-hours` | Admin | Define os 7 dias de expediente do barbeiro |
| POST | `/barbers/:id/login` | Admin | Concede acesso de login (papel `BARBER`) a um barbeiro existente |
| GET | `/barbers/me` | Barbeiro | Retorna o próprio perfil de barbeiro |
| PUT | `/barbers/me` | Barbeiro | Atualiza a própria descrição, especialidades e foto |
| GET | `/barbers/me/breaks` | Barbeiro | Lista os próprios bloqueios de horário (ex.: almoço) |
| POST | `/barbers/me/breaks` | Barbeiro | Cria um bloqueio de horário próprio |
| DELETE | `/barbers/me/breaks/:id` | Barbeiro | Remove um bloqueio de horário próprio |
| PUT | `/barbers/me/working-hours` | Barbeiro | Define o próprio expediente semanal (substitui o horário padrão da barbearia) |

## Agendamentos — `/appointments`

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/appointments/availability` | Autenticado | Query `barberId`, `serviceId`, `date`; retorna horários livres |
| POST | `/appointments` | Cliente | Cria um agendamento |
| GET | `/appointments/mine` | Cliente | Lista os agendamentos do cliente logado |
| GET | `/appointments` | Admin, Barbeiro | Lista agendamentos, com filtros e paginação (barbeiro só vê os próprios) |
| GET | `/appointments/:id` | Autenticado | Detalhe de um agendamento |
| PUT | `/appointments/:id/cancel` | Cliente, Admin | Cancela (cliente só cancela o próprio, respeitando antecedência mínima) |
| PUT | `/appointments/:id/reschedule` | Cliente, Admin | Remarca para nova data/horário |
| PUT | `/appointments/:id/status` | Admin, Barbeiro | Atualiza o status manualmente (barbeiro só nos próprios agendamentos) |

Filtros de `GET /appointments`: `date`, `barberId`, `clientId`, `serviceId`, `status`, `page`, `pageSize` (para o
papel Barbeiro, `barberId` é sempre forçado ao próprio barbeiro, ignorando o valor enviado).

## Planos — `/plans`

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/plans` | Público | Lista planos (ativos para visitantes, todos para admin) |
| GET | `/plans/:id` | Público | Detalhe de um plano |
| POST | `/plans` | Admin | Cria um plano |
| PUT | `/plans/:id` | Admin | Atualiza um plano |
| DELETE | `/plans/:id` | Admin | Remove um plano (ou desativa, se houver assinantes) |
| GET | `/plans/:id/subscribers` | Admin | Lista assinantes de um plano |
| POST | `/plans/:id/subscribe` | Cliente | Assina o plano (cancela assinatura ativa anterior, se houver) |
| GET | `/plans/subscriptions/me` | Cliente | Retorna a assinatura ativa do cliente logado |
| DELETE | `/plans/subscriptions/me` | Cliente | Cancela a assinatura ativa do cliente logado |

## Horários de funcionamento — `/business-hours`

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/business-hours` | Público | Retorna o horário padrão semanal da barbearia |
| PUT | `/business-hours` | Admin | Define o horário padrão semanal (7 dias) |
| GET | `/business-hours/blocked` | Admin | Lista bloqueios de horário |
| POST | `/business-hours/blocked` | Admin | Cria um bloqueio (para um barbeiro específico ou toda a barbearia) |
| DELETE | `/business-hours/blocked/:id` | Admin | Remove um bloqueio |

## Administração — `/admin`

Todas as rotas abaixo exigem `role === 'ADMIN'`.

| Método | Rota | Descrição |
|---|---|---|
| GET | `/admin/dashboard` | Estatísticas: clientes, barbeiros, agendamentos do dia/semana, cancelamentos, assinaturas ativas, faturamento estimado, próximos horários, ranking de serviços |
| GET | `/admin/users` | Lista clientes com busca (`search`), filtro `active` e paginação |
| GET | `/admin/users/:id` | Detalhe de um cliente: dados, histórico de agendamentos e assinatura |
| PUT | `/admin/users/:id` | Atualiza nome/telefone/status de um cliente |
| GET | `/admin/admins` | Lista os administradores cadastrados |
| POST | `/admin/admins` | Cadastra um novo administrador (nome, e-mail, telefone, senha) |
