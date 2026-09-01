# Funcionalidades e Regras de Negócio

## Área pública

- Home institucional com apresentação da barbearia, serviços em destaque e barbeiros em destaque (dados reais vindos
  da API, não fixos no código).
- Listagem completa de serviços com preço e duração.
- Listagem completa de barbeiros com especialidades.
- Listagem de planos com benefícios e opção de assinatura.
- Cadastro de conta (cliente) com validação de nome, e-mail, telefone e senha.
- Login com JWT.
- Recuperação de senha (fluxo completo, com token de demonstração retornado pela API na ausência de servidor de
  e-mail).

## Área do barbeiro (`/barbeiro`)

Papel `BARBER`, com login próprio concedido pelo administrador (um barbeiro cadastrado só tem acesso ao painel depois
que um administrador cria as credenciais dele em Barbeiros → "Conceder acesso").

- **Minha agenda**: lista os próprios agendamentos por data, com opção de atualizar o status (confirmar, concluir,
  marcar não comparecimento) diretamente — restrito aos próprios atendimentos.
- **Horário de almoço / indisponibilidade**: o barbeiro pode bloquear um intervalo de horário (ex.: almoço), o que
  remove esses horários da disponibilidade de agendamento imediatamente, e removê-lo quando quiser voltar a ficar
  disponível.
- **Meu perfil**: o barbeiro edita sua própria descrição e especialidades/diferenciais (exibidas publicamente na
  página de barbeiros do site) e altera sua senha. Nome e status ativo/inativo continuam sob controle do
  administrador.

## Área do cliente (`/cliente`)

- **Dashboard**: saudação personalizada, próximo atendimento agendado, atalhos para agendamento, histórico e plano
  atual.
- **Novo agendamento** (`/cliente/agendamento`): fluxo guiado em 4 etapas — serviço → barbeiro → data/horário →
  confirmação — com cálculo de horários disponíveis em tempo real.
- **Meus agendamentos**: lista de atendimentos futuros, com ações de **cancelar** e **remarcar**.
- **Histórico**: atendimentos concluídos, cancelados ou não comparecidos.
- **Planos**: visualização do plano atual, troca de plano e cancelamento de assinatura.
- **Perfil**: edição de nome/telefone e alteração de senha.

### Regras de agendamento

- Não é possível agendar em uma data passada.
- Não é possível agendar além do horizonte configurado (60 dias por padrão).
- Os horários exibidos respeitam o expediente do barbeiro (ou o expediente padrão da barbearia, na ausência de um
  expediente próprio) e excluem horários já ocupados ou bloqueados.
- Cancelamento e remarcação por parte do cliente exigem uma antecedência mínima (2 horas por padrão, configurável em
  `backend/src/config/business.ts`).
- Um administrador pode cancelar/alterar o status de qualquer agendamento sem a restrição de antecedência mínima.

## Área administrativa (`/admin`)

- **Dashboard**: total de clientes e barbeiros ativos, agendamentos do dia e da semana, cancelamentos da semana,
  assinaturas ativas, faturamento estimado (soma dos atendimentos concluídos) e ranking dos serviços mais agendados.
- **Clientes**: busca, paginação, visualização de detalhes (histórico completo e plano contratado), edição de dados e
  desativação/reativação de conta.
- **Barbeiros**: CRUD completo, especialidades, foto (URL), configuração individual do expediente semanal e concessão
  de acesso de login (papel `BARBER`) para que o barbeiro use sua própria área.
- **Serviços**: CRUD completo com nome, descrição, preço, duração e status.
- **Agendamentos**: listagem com filtros (data, barbeiro, cliente, serviço, status), paginação e alteração manual de
  status.
- **Planos**: CRUD completo, visualização da lista de assinantes de cada plano.
- **Horários de funcionamento**: configuração do expediente padrão semanal da barbearia e criação/remoção de
  bloqueios pontuais (folgas, feriados, manutenção), por barbeiro específico ou para toda a barbearia.
- **Administradores**: listagem dos administradores cadastrados e criação de novos administradores (nome, e-mail,
  telefone e senha) — acesso restrito a quem já é administrador; não existe cadastro público desse papel.
- **Configurações**: dados da própria conta de administrador (perfil e senha) e indicação de onde alterar a
  identidade/nome do sistema.

## Autenticação e segurança

- Senhas armazenadas com hash bcrypt (nunca em texto puro, nunca retornadas pela API).
- Autenticação stateless via JWT (7 dias de validade por padrão).
- Autorização por papel (`CLIENT` / `ADMIN`) verificada no back-end em cada rota sensível — a proteção de rota no
  Front-End é apenas uma camada de experiência do usuário, não de segurança.
- Validação de entrada com Zod em todas as rotas que recebem dados do cliente.
- CORS restrito à origem configurada em `CORS_ORIGIN`.

## Tratamento de estados na interface

- **Carregamento**: indicadores de carregamento (spinners) em todas as telas que buscam dados da API.
- **Erros**: mensagens de erro específicas via toast, extraídas da resposta da API.
- **Sucesso**: confirmação visual (toast) após operações de escrita.
- **Vazio**: telas de estado vazio (com ação sugerida) quando uma lista não possui itens.
- **Confirmação**: modais de confirmação antes de ações destrutivas (cancelar agendamento, excluir serviço/barbeiro/plano,
  desativar cliente).
