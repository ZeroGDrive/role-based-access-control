import { FastifyInstance } from 'fastify';
import { PERMISSIONS } from '../../config/permissions';
import { createRoleHandler } from './roles.controllers';
import { CreateRoleBody, createRoleJsonSchema } from './roles.schemas';

export async function roleRoutes(app: FastifyInstance) {
  app.post<{
    Body: CreateRoleBody;
  }>(
    '/',
    {
      schema: createRoleJsonSchema,
      preHandler: app.guard.scope(PERMISSIONS['roles:write']),
    },
    createRoleHandler
  );
}
