import {
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const applications = pgTable('applications', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 256 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const users = pgTable(
  'users',
  {
    id: uuid('id').notNull().defaultRandom(),
    email: varchar('email', { length: 256 }).notNull(),
    name: varchar('name', { length: 256 }).notNull(),
    applicationId: uuid('application_id')
      .references(() => applications.id)
      .notNull(),
    password: varchar('password', { length: 256 }).notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (users) => {
    return {
      // we need to add a composite primary key, because email is not unique, but the combination of email and applicationId is
      cpk: primaryKey(users.email, users.applicationId),
      // because id is not a primary key, we need to add a unique index
      idIndex: uniqueIndex('users_id_index').on(users.id),
    };
  }
);

export const roles = pgTable(
  'roles',
  {
    id: uuid('id').notNull().defaultRandom(),
    name: varchar('name', { length: 256 }).notNull(),
    applicationId: uuid('application_id').references(() => applications.id),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    permissions: text('permissions').array().$type<Array<string>>(),
  },
  (roles) => {
    return {
      // we need to add a composite primary key, because email is not unique, but the combination of email and applicationId is
      cpk: primaryKey(roles.name, roles.applicationId),
      // because id is not a primary key, we need to add a unique index
      idIndex: uniqueIndex('roles_id_index').on(roles.id),
    };
  }
);

export const usersToRoles = pgTable(
  'users_to_roles',
  {
    applicationId: uuid('application_id')
      .references(() => applications.id)
      .notNull(),
    roleId: uuid('role_id')
      .references(() => roles.id)
      .notNull(),
    userId: uuid('user_id')
      .references(() => users.id)
      .notNull(),
  },
  (usersToRoles) => {
    return {
      cpk: primaryKey(
        usersToRoles.applicationId,
        usersToRoles.roleId,
        usersToRoles.userId
      ),
    };
  }
);
