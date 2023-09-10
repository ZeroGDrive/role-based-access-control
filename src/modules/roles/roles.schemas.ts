import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';
import { ALL_PERMISSIONS } from '../../config/permissions';
import { roles } from '../../db/schema';

const createRoleSchema = createInsertSchema(roles, {
  permissions: z.array(z.enum(ALL_PERMISSIONS)),
}).pick({
  name: true,
  permissions: true,
});

export type CreateRoleBody = z.infer<typeof createRoleSchema>;
export const createRoleJsonSchema = {
  body: zodToJsonSchema(createRoleSchema),
};
