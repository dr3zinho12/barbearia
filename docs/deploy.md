# Publicar o Royal Cut na internet (plano B para a apresentação)

Este guia coloca o site no ar com um link público (ex: `https://royal-cut.vercel.app`), sem precisar instalar
nada no computador da escola. Usa dois serviços gratuitos:

- **Render** — hospeda o back-end (API) e o banco de dados PostgreSQL.
- **Vercel** — hospeda o front-end (o site que o usuário vê).

Ambos têm plano gratuito e login direto pela conta do GitHub que você já usa neste projeto.

> **Aviso sobre planos gratuitos:** os limites de cada serviço podem mudar com o tempo. Se algo na tela não bater
> exatamente com este guia, confira a página de preços/planos atual do Render ou da Vercel — o passo a passo
> geral (conectar o GitHub, configurar variáveis de ambiente) costuma ser o mesmo.

## Parte 1 — Back-end e banco de dados no Render

1. Crie uma conta em [render.com](https://render.com) usando "Sign in with GitHub" (mesma conta do repositório
   `barbearia`).
2. No painel do Render, clique em **New +** → **Blueprint**.
3. Selecione o repositório `Dr3zinho12/barbearia`. O Render vai encontrar automaticamente o arquivo
   `render.yaml` na raiz do projeto e propor a criação de:
   - um banco de dados PostgreSQL (`royal-cut-db`);
   - um serviço web para a API (`royal-cut-api`), já configurado para instalar dependências, gerar o Prisma e
     rodar as migrations sozinho.
4. Clique em **Apply** e aguarde o deploy terminar (aparece "Live" quando pronto). Isso pode levar alguns minutos.
5. Copie a URL pública gerada para a API, algo como `https://royal-cut-api.onrender.com`.
6. Popule o banco com os dados de demonstração (só uma vez): no painel do serviço `royal-cut-api`, abra a aba
   **Shell** e rode:
   ```bash
   npm run seed
   ```

## Parte 2 — Front-end na Vercel

1. Crie uma conta em [vercel.com](https://vercel.com) usando "Continue with GitHub".
2. Clique em **Add New** → **Project** e selecione o mesmo repositório `Dr3zinho12/barbearia`.
3. Em **Root Directory**, clique em "Edit" e escolha a pasta `frontend` (importante — sem isso a Vercel tenta
   buildar o projeto errado).
4. Em **Environment Variables**, adicione:
   | Nome | Valor |
   |---|---|
   | `VITE_API_URL` | `https://SUA-URL-DO-RENDER.onrender.com/api` (a URL copiada no passo 5 da Parte 1, com `/api` no final) |
5. Clique em **Deploy** e aguarde. Ao final, a Vercel te dá um link público, por exemplo
   `https://royal-cut.vercel.app`.

## Parte 3 — Liberar o CORS (última etapa, obrigatória)

Por segurança, a API só aceita pedidos vindos do endereço configurado em `CORS_ORIGIN`. Agora que você tem a URL
final da Vercel, volte no Render:

1. Abra o serviço `royal-cut-api` → aba **Environment**.
2. Edite a variável `CORS_ORIGIN` e troque o valor por `https://royal-cut.vercel.app` (a URL real da sua Vercel,
   sem barra `/` no final).
3. Salve — o Render reinicia a API automaticamente com o novo valor.

## Testando

Acesse o link da Vercel e faça login com as credenciais de demonstração (as mesmas do `README.md`):

| Perfil | E-mail | Senha |
|---|---|---|
| Administrador | admin@royalcut.com | Admin@123 |
| Barbeiro | andre@royalcut.com | Barbeiro@123 |
| Cliente | carlos.souza@example.com | Cliente@123 |

## Atenção para o dia da apresentação

No plano gratuito do Render, a API "dorme" depois de um tempo sem uso e demora cerca de 30-60 segundos para
"acordar" na primeira requisição. **Acesse o link uns 5 minutos antes de apresentar** para a API já estar
"acordada" e o site responder rápido na hora de mostrar para os professores.

## Atualizando o site depois de mudanças no código

Tanto o Render quanto a Vercel ficam "escutando" o repositório no GitHub: sempre que você der `git push` na
branch `main`, os dois serviços fazem um novo deploy automaticamente, sem precisar repetir esses passos.
