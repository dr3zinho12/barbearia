import { createApp } from './app.js';
import { business } from './config/business.js';
import { env } from './config/env.js';

const app = createApp();

app.listen(env.port, () => {
  console.log(`${business.name} API rodando em http://localhost:${env.port}`);
});
