import fastify from 'fastify';
import guard from 'fastify-guard';
import jwt from 'jsonwebtoken';
import { applicationsRoutes } from '../modules/applications/applications.routes';
import { roleRoutes } from '../modules/roles/roles.routes';
import { usersRoutes } from '../modules/users/users.routes';
import { logger } from './logger';

type User = {
  id: string;
  scopes: string[];
  applicationId: string;
};

declare module 'fastify' {
  interface FastifyRequest {
    user: User;
  }
}

export async function buildServer() {
  const app = fastify({
    logger,
  });

  app.decorateRequest('user', null);

  app.addHook('onRequest', async (request, reply) => {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return;
    }

    try {
      const token = authHeader.replace('Bearer ', '');
      const decoded = (await jwt.verify(token, 'secret')) as User;

      request.user = decoded;
    } catch (e) {}
  });

  // register plugins
  app.register(guard, {
    requestProperty: 'user',
    scopeProperty: 'scopes',

    errorHandler: (result, request, reply) => {
      return reply.send('You are not allowed to access this resource');
    },
  });

  // register routes
  app.register(applicationsRoutes, { prefix: '/api/applications' });
  app.register(usersRoutes, { prefix: '/api/users' });
  app.register(roleRoutes, { prefix: '/api/roles' });

  return app;
}
