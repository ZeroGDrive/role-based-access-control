import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';
import { users, usersToRoles } from '../../db/schema';

export const usersInsertSchema = createInsertSchema(users, {
  password: z.string().min(6),
})
  .pick({
    name: true,
    email: true,
    password: true,
    applicationId: true,
  })
  .and(
    z.object({
      initialUser: z.boolean().optional(),
    })
  );
export type CreateUserBody = z.infer<typeof usersInsertSchema>;
export const createUserJsonSchema = {
  body: zodToJsonSchema(usersInsertSchema),
};

const loginSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  applicationId: true,
});
export type LoginBody = z.infer<typeof loginSchema>;
export const loginJsonSchema = {
  body: zodToJsonSchema(loginSchema),
};

const assignRoleToUserSchema = createInsertSchema(usersToRoles).pick({
  userId: true,
  roleId: true,
});
export type AssignRoleToUserBody = z.infer<typeof assignRoleToUserSchema>;
export const assignRoleToUserJsonSchema = {
  body: zodToJsonSchema(assignRoleToUserSchema),
};
