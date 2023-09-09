import { FastifyInstance } from 'fastify';
import { createUserHandler, loginHandler } from './users.controllers';
import { createUserJsonSchema, loginJsonSchema } from './users.schemas';

export async function usersRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      schema: createUserJsonSchema,
    },
    createUserHandler
  );

  app.post(
    '/login',
    {
      schema: loginJsonSchema,
    },
    loginHandler
  );
}
