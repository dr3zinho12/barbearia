import cors from 'cors';
import express, { Express } from 'express';
import { business } from './config/business';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import routes from './routes';

export function createApp(): Express {
  const app = express();

  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json());

  app.get('/', (_req, res) => {
    res.status(200).json({ name: `${business.name} API`, status: 'online' });
  });

  app.use('/api', routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
