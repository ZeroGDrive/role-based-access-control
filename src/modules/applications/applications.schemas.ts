import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { applications } from '../../db/schema';

export const insertApplicationSchema = createInsertSchema(applications).pick({
  name: true,
});
export type CreateApplicationBody = z.infer<typeof insertApplicationSchema>;
export const createApplicationJsonSchema = {
  body: zodToJsonSchema(insertApplicationSchema),
};
