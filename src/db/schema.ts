import {
  pgTable,
  primaryKey,
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
    applicationId: uuid('application_id').references(() => applications.id),
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
