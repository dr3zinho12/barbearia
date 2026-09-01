# Esqueleto da Monografia (ABNT NBR 14724)

Este documento é um **esqueleto de apoio** para a redação da monografia do TCC, seguindo a estrutura exigida pela
NBR 14724. Ele não substitui o documento final em PDF — serve como guia de seções e como ponto de partida para o
conteúdo, que deve ser redigido e formatado por completo em um editor de texto (Word, LibreOffice Writer ou LaTeX)
antes da entrega.

## Elementos pré-textuais

- **Capa**: instituição, curso, título do trabalho ("Black Blue Barber: Sistema Web de Agendamento e Gestão para
  Barbearia"), autor(es), cidade e ano.
- **Folha de rosto**: título, natureza do trabalho (TCC do curso técnico em Desenvolvimento de Sistemas), autor(es),
  orientador(a), instituição, cidade e ano.
- **Sumário**: gerado automaticamente pelo editor de texto a partir dos títulos de seção.

## Elementos textuais

### 1. Introdução

Contextualizar o problema (agendamento manual em barbearias), apresentar brevemente a solução proposta e a
organização do restante do documento.

### 2. Justificativa

Explicar por que um sistema de agendamento digital é relevante: redução de conflitos de horário, melhor experiência
do cliente, gestão centralizada para o proprietário, aplicação prática dos conhecimentos do curso técnico.

### 3. Objetivos

- **Objetivo geral**: desenvolver um sistema web completo de agendamento e gestão para uma barbearia.
- **Objetivos específicos**:
  - Implementar cadastro e autenticação segura de clientes.
  - Implementar um fluxo de agendamento que previna conflitos de horário.
  - Implementar uma área administrativa completa para gestão do negócio.
  - Implementar um sistema de planos de assinatura.
  - Validar o sistema por meio de testes automatizados.

### 4. Metodologia

Descrever o processo de desenvolvimento adotado: levantamento de requisitos, modelagem de dados, desenvolvimento
incremental (back-end → front-end → integração), uso de controle de versão (Git) com commits organizados por etapa,
e validação por meio de testes manuais e automatizados. Referenciar `docs/cronograma.md`.

### 5. Referencial teórico

Sugestões de tópicos a desenvolver (com citações de fontes bibliográficas adequadas):

- Arquitetura cliente-servidor e APIs REST.
- Bancos de dados relacionais e modelagem entidade-relacionamento.
- Autenticação e autorização em aplicações web (JWT, hashing de senhas).
- O ecossistema JavaScript moderno (Node.js, React, módulos ES).
- ORMs e mapeamento objeto-relacional (Prisma).

### 6. Desenvolvimento do trabalho

Descrever a arquitetura (referenciar `docs/arquitetura.md`), o modelo de dados (referenciar `docs/banco-de-dados.md`),
as funcionalidades implementadas (referenciar `docs/funcionalidades.md`) e a API (referenciar `docs/api.md`). Incluir
capturas de tela do sistema em funcionamento.

### 7. Cronograma de desenvolvimento

Referenciar e detalhar `docs/cronograma.md`.

### 8. Conclusão

Retomar os objetivos propostos, avaliar se foram alcançados, discutir dificuldades encontradas durante o
desenvolvimento e propor melhorias futuras (ver seção correspondente em `docs/apresentacao.md`).

## Elementos pós-textuais

- **Referências**: listar, em ordem alfabética e conforme ABNT NBR 6023, toda a bibliografia e documentação técnica
  utilizada (documentação oficial do React, Node.js, Express, Prisma, PostgreSQL, JWT, etc.).
- **Anexos/Apêndices**: sugere-se incluir como apêndice o modelo de dados completo (`docs/banco-de-dados.md`), a
  referência de endpoints (`docs/api.md`) e capturas de tela das principais telas do sistema.

## Observações finais

- Verifique com a instituição a formatação exigida (fonte, espaçamento, margens) conforme a NBR 14724 vigente.
- Mantenha a coerência entre o que é descrito na monografia e o que está de fato implementado no código — utilize
  este repositório como fonte da verdade para a seção de desenvolvimento.
