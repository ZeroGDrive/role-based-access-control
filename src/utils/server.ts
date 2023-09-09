import fastify from 'fastify';
import { applicationsRoutes } from '../modules/applications/applications.routes';
import { usersRoutes } from '../modules/users/users.routes';
import { logger } from './logger';

export async function buildServer() {
  const app = fastify({
    logger,
  });

  // register plugins

  // register routes
  app.register(applicationsRoutes, { prefix: '/api/applications' });
  app.register(usersRoutes, { prefix: '/api/users' });

  return app;
}
