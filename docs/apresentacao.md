# Roteiro de Apresentação (15–20 minutos)

Sugestão de estrutura para a defesa do TCC. Os tempos são aproximados.

## 1. Abertura e problema (2 min)

- Barbearias tradicionalmente dependem de agendamento por telefone/WhatsApp, o que gera conflitos de horário, falta
  de histórico organizado e dificuldade de gestão para o proprietário.

## 2. Justificativa (1 min)

- Um sistema web de agendamento resolve esses problemas oferecendo autoatendimento ao cliente e visibilidade completa
  ao administrador, com baixo custo de operação.

## 3. Objetivo (1 min)

- Geral: desenvolver um sistema web completo de agendamento e gestão para uma barbearia.
- Específicos: autenticação segura, agendamento sem conflitos, área administrativa completa, planos de assinatura.

## 4. Público-alvo (1 min)

- Clientes da barbearia (agendamento) e o proprietário/administrador (gestão do negócio).

## 5. Solução proposta (2 min)

- Apresentar a Home e explicar o fluxo geral: cliente se cadastra, agenda, acompanha; administrador gerencia tudo.

## 6. Tecnologias utilizadas (2 min)

- Front-End: React, TypeScript, Vite, Tailwind CSS, React Router, React Hook Form.
- Back-End: Node.js, Express, TypeScript, Prisma, Zod, JWT, bcrypt.
- Banco de dados: PostgreSQL.

## 7. Arquitetura (2 min)

- Mostrar o diagrama de `docs/arquitetura.md`: Front-End ⇄ API REST ⇄ PostgreSQL, arquitetura em camadas no back-end.

## 8. Banco de dados (1–2 min)

- Mostrar o diagrama de entidades de `docs/banco-de-dados.md`, destacando o relacionamento entre agendamento,
  cliente, barbeiro e serviço.

## 9. Demonstração do sistema (6–8 min) — parte central da apresentação

Roteiro sugerido de demonstração ao vivo:

1. **Área pública**: navegar pela Home, Serviços, Barbeiros e Planos.
2. **Cadastro e login**: criar uma conta nova de cliente.
3. **Área do cliente**: mostrar o dashboard, realizar um agendamento completo (as 4 etapas), mostrar o agendamento
   criado em "Meus agendamentos".
4. **Conflito de horário**: tentar agendar o mesmo horário já ocupado (em outra aba/usuário) e mostrar o bloqueio.
5. **Cancelamento/remarcação**: cancelar ou remarcar o agendamento criado.
6. **Planos**: assinar um plano e visualizar o plano ativo.
7. **Login como administrador**: mostrar o dashboard com estatísticas reais.
8. **Gestão administrativa**: criar/editar um serviço ou barbeiro, mostrar a listagem de agendamentos com filtros.
9. **Horários de funcionamento**: mostrar a configuração do expediente e um bloqueio de horário.

## 10. Diferenciais do projeto (1 min)

- Cálculo de disponibilidade em tempo real, com prevenção de conflitos validada no back-end.
- Separação clara entre área pública, do cliente e administrativa, cada uma com sua própria proteção de acesso.
- Dashboard com estatísticas reais calculadas a partir do banco de dados (não valores fixos).
- Testes automatizados cobrindo as regras de negócio mais críticas.

## 11. Resultados (1 min)

- Sistema funcional de ponta a ponta, com banco de dados real, autenticação segura e todas as funcionalidades
  descritas no escopo implementadas e testadas.

## 12. Melhorias futuras (1 min)

- Notificações por e-mail/SMS para confirmação e lembrete de agendamento.
- Pagamento online integrado para os planos de assinatura.
- Aplicativo mobile nativo.
- Sistema de avaliações de atendimento pelos clientes.

## 13. Conclusão (1 min)

- Retomar o objetivo alcançado e agradecer a banca.

## Dicas práticas para a demonstração

- Execute o `npm run seed` pouco antes da apresentação para garantir dados de demonstração atualizados (datas
  futuras coerentes).
- Tenha duas janelas/abas abertas (uma logada como cliente, outra como administrador) para alternar rapidamente.
- Teste a demonstração completa ao menos uma vez antes da apresentação real, incluindo a rede/Wi-Fi do local.
