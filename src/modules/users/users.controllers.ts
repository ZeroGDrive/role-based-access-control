import { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';
import { SYSTEM_ROLES } from '../../config/permissions';
import { getRoleByName } from '../roles/roles.services';
import { CreateUserBody, LoginBody } from './users.schemas';
import {
  assignRoleToUser,
  createUser,
  getUserByEmail,
  getUsersByApplication,
} from './users.services';

export async function createUserHandler(
  request: FastifyRequest<{
    Body: CreateUserBody;
  }>,
  reply: FastifyReply
) {
  const { initialUser, ...data } = request.body;
  const roleName = initialUser
    ? SYSTEM_ROLES.SUPER_ADMIN
    : SYSTEM_ROLES.APPLICATION_USER;

  if (roleName === SYSTEM_ROLES.SUPER_ADMIN) {
    const appUsers = await getUsersByApplication(data.applicationId);

    if (appUsers.length > 0) {
      return reply.code(400).send({
        message: 'Application already has a super admin',
        extensions: {
          code: 'APPLICATION_ALREADY_HAS_SUPER_ADMIN',
          applicationId: data.applicationId,
        },
      });
    }
  }

  const role = await getRoleByName(roleName, data.applicationId);

  if (!role) {
    return reply.code(404).send({
      message: 'Role does not exist',
      extensions: {
        code: 'ROLE_DOES_NOT_EXIST',
        roleName,
      },
    });
  }

  try {
    const user = await createUser(data);

    await assignRoleToUser({
      applicationId: data.applicationId,
      roleId: role.id,
      userId: user.id,
    });

    return user;
  } catch (e) {}
}

export async function loginHandler(
  request: FastifyRequest<{
    Body: LoginBody;
  }>,
  reply: FastifyReply
) {
  const { applicationId, email, password } = request.body;

  const user = await getUserByEmail({ email, applicationId });

  if (!user) {
    return reply.code(404).send({
      message: 'User does not exist',
    });
  }

  const token = jwt.sign(
    {
      id: user.id,
      applicationId,
      email,
      scopes: user.permissions,
    },
    'secret'
  ); // change this secret or signing method

  return { token };
}
