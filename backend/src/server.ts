import { createApp } from './app';
import { env } from './config/env';

const app = createApp();

app.listen(env.port, () => {
  console.log(`Black Blue Barber API rodando em http://localhost:${env.port}`);
});
