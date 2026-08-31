# Requisitos do Sistema

## Requisitos funcionais

| Código | Descrição |
|---|---|
| RF01 | O sistema deve permitir que um visitante crie uma conta de cliente |
| RF02 | O sistema deve permitir que um usuário cadastrado faça login |
| RF03 | O sistema deve permitir a recuperação de senha |
| RF04 | O sistema deve exibir os serviços oferecidos, com preço e duração |
| RF05 | O sistema deve exibir os barbeiros disponíveis, com especialidades |
| RF06 | O sistema deve exibir os planos de assinatura disponíveis |
| RF07 | O cliente deve poder agendar um atendimento escolhendo serviço, barbeiro, data e horário |
| RF08 | O sistema deve exibir apenas horários realmente disponíveis, considerando expediente e agendamentos existentes |
| RF09 | O sistema deve impedir dois agendamentos conflitantes para o mesmo barbeiro e horário |
| RF10 | O cliente deve poder visualizar, cancelar e remarcar seus próprios agendamentos |
| RF11 | O cliente deve poder visualizar seu histórico de atendimentos |
| RF12 | O cliente deve poder assinar, trocar e cancelar um plano |
| RF13 | O cliente deve poder editar seus dados e alterar sua senha |
| RF14 | O administrador deve possuir uma área exclusiva, protegida por autenticação e autorização |
| RF15 | O administrador deve poder gerenciar clientes (listar, buscar, visualizar, editar, desativar) |
| RF16 | O administrador deve poder gerenciar barbeiros (CRUD completo + horários de trabalho) |
| RF17 | O administrador deve poder gerenciar serviços (CRUD completo) |
| RF18 | O administrador deve poder gerenciar planos (CRUD completo + visualização de assinantes) |
| RF19 | O administrador deve poder visualizar e filtrar todos os agendamentos, alterando seu status |
| RF20 | O administrador deve poder configurar o horário de funcionamento e bloquear horários específicos |
| RF21 | O administrador deve visualizar um dashboard com estatísticas do negócio |

## Requisitos não funcionais

| Código | Descrição |
|---|---|
| RNF01 | A interface deve ser responsiva (mobile first), funcionando em celular, tablet e desktop |
| RNF02 | As senhas devem ser armazenadas com hash (bcrypt), nunca em texto puro |
| RNF03 | A autenticação deve utilizar tokens JWT |
| RNF04 | A autorização por papel deve ser validada no back-end, não apenas na interface |
| RNF05 | Toda entrada de dados deve ser validada no back-end, independentemente da validação no Front-End |
| RNF06 | O sistema deve tratar e exibir erros de forma clara ao usuário |
| RNF07 | O sistema deve fornecer feedback visual de carregamento, sucesso e erro |
| RNF08 | O código deve ser organizado em camadas (rotas, controllers, services) e por funcionalidade no Front-End |
| RNF09 | O sistema deve ser executável localmente com um roteiro de instalação documentado |
| RNF10 | O sistema deve possuir testes automatizados cobrindo as regras mais críticas |

## Público-alvo

- **Clientes finais** da barbearia: pessoas que desejam agendar serviços de barbearia de forma prática, sem
  depender de contato telefônico.
- **Proprietário/administrador** da barbearia: precisa de visibilidade sobre agenda, clientes e desempenho do
  negócio, além de controle total sobre preços, equipe e horários.

## Escopo e limitações assumidas

- Não há integração com gateway de pagamento real; a "assinatura" de planos registra a intenção no sistema.
- Não há envio real de e-mail; o fluxo de recuperação de senha retorna o token diretamente na resposta da API para
  fins de demonstração acadêmica.
- O sistema assume fuso horário único (o do servidor onde a API é executada).
