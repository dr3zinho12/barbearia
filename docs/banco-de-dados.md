# Modelo de Banco de Dados

Banco de dados relacional **SQLite** (um único arquivo, `backend/prisma/dev.db`, sem instalar nenhum servidor de banco de dados), gerenciado pelo Prisma ORM (`backend/prisma/schema.prisma`).

## Diagrama de entidades e relacionamentos

```
User (CLIENT) ──1:N── Appointment ──N:1── Barber
     │                    │
     │                    └───N:1── Service
     │
     └──1:N── Subscription ──N:1── Plan

Barber ──1:N── WorkingHour        (barberId nulo = horário padrão da barbearia)
Barber ──1:N── BlockedSchedule    (barberId nulo = bloqueio para toda a barbearia)
Barber ──0:1── User (BARBER)      (login opcional do barbeiro, concedido pelo admin)
```

## Tabelas

### users

| Campo | Tipo | Observações |
|---|---|---|
| id | UUID (PK) | gerado automaticamente |
| name | String | |
| email | String | único |
| password | String | hash bcrypt, nunca retornado pela API |
| phone | String | apenas dígitos, DDD + número |
| role | String | `CLIENT` \| `ADMIN` \| `BARBER` (o SQLite não tem enum nativo; os valores são validados pelo Zod) |
| active | Boolean | permite desativar um cliente sem apagar seu histórico |
| createdAt / updatedAt | DateTime | |

### barbers

| Campo | Tipo | Observações |
|---|---|---|
| id | UUID (PK) | |
| userId | UUID? (FK → users, único) | vínculo opcional com uma conta de login (papel `BARBER`); nulo enquanto o admin não concede acesso |
| name | String | |
| description | String | |
| photoUrl | String? | opcional |
| specialties | String | lista de especialidades salva como texto JSON (o SQLite não tem um tipo nativo de lista); a API converte automaticamente para um array de verdade nas respostas |
| active | Boolean | |
| createdAt / updatedAt | DateTime | |

### services

| Campo | Tipo | Observações |
|---|---|---|
| id | UUID (PK) | |
| name | String | |
| description | String | |
| price | Float | |
| duration | Int | duração em minutos, usada no cálculo de disponibilidade |
| active | Boolean | |
| createdAt / updatedAt | DateTime | |

### appointments

| Campo | Tipo | Observações |
|---|---|---|
| id | UUID (PK) | |
| clientId | UUID (FK → users) | |
| barberId | UUID (FK → barbers) | |
| serviceId | UUID (FK → services) | |
| date | DateTime | horário sempre à meia-noite UTC; representa apenas a data |
| startTime / endTime | String (`HH:mm`) | horário calculado a partir da duração do serviço |
| status | String | `SCHEDULED` \| `CONFIRMED` \| `COMPLETED` \| `CANCELED` \| `NO_SHOW` (validado pelo Zod) |
| notes | String? | observações do cliente |
| createdAt / updatedAt | DateTime | |

Índice composto em `(barberId, date)` para acelerar o cálculo de disponibilidade.

### plans

| Campo | Tipo | Observações |
|---|---|---|
| id | UUID (PK) | |
| name | String | |
| description | String | |
| price | Float | valor mensal |
| benefits | String | lista de benefícios salva como texto JSON, convertida para array pela API (mesmo mecanismo de `specialties`) |
| active | Boolean | |
| createdAt / updatedAt | DateTime | |

### subscriptions

| Campo | Tipo | Observações |
|---|---|---|
| id | UUID (PK) | |
| clientId | UUID (FK → users) | |
| planId | UUID (FK → plans) | |
| startDate | DateTime | |
| endDate | DateTime? | preenchida ao cancelar |
| status | String | `ACTIVE` \| `CANCELED` \| `EXPIRED` (validado pelo Zod) |

Assinar um novo plano cancela automaticamente qualquer assinatura ativa anterior do mesmo cliente.

### working_hours

| Campo | Tipo | Observações |
|---|---|---|
| id | UUID (PK) | |
| barberId | UUID? (FK → barbers) | nulo = horário padrão da barbearia |
| dayOfWeek | Int | 0 (domingo) a 6 (sábado) |
| startTime / endTime | String (`HH:mm`) | |
| closed | Boolean | dia sem expediente |

### blocked_schedules

| Campo | Tipo | Observações |
|---|---|---|
| id | UUID (PK) | |
| barberId | UUID? (FK → barbers) | nulo = bloqueio para toda a barbearia |
| date | DateTime | horário sempre à meia-noite UTC; representa apenas a data |
| startTime / endTime | String (`HH:mm`) | |
| reason | String? | motivo do bloqueio (folga, feriado, manutenção) |
| createdAt | DateTime | |

## Regras de integridade aplicadas pela API

- Um serviço ou barbeiro com agendamentos vinculados não pode ser **excluído**; a API automaticamente o **desativa**
  para preservar o histórico de atendimentos.
- Um plano com assinaturas (ativas ou encerradas) segue a mesma regra de desativação em vez de exclusão.
- A disponibilidade de horários é sempre recalculada no momento da criação/remarcação de um agendamento, dentro de
  uma transação, para evitar conflitos de concorrência.

## Migrations

As migrations são geradas e versionadas pelo Prisma (`npx prisma migrate dev`), a partir do arquivo
`backend/prisma/schema.prisma`. O histórico de migrations fica em `backend/prisma/migrations/` (gerado ao rodar o
comando pela primeira vez em ambiente local).
