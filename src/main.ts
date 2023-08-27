import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { env } from './config/env';
import { db } from './db';
import { logger } from './utils/logger';
import { buildServer } from './utils/server';

async function gracefulShutdown({
  app,
}: {
  app: Awaited<ReturnType<typeof buildServer>>;
}) {
  await app.close();
}

async function main() {
  const app = await buildServer();

  await app.listen({
    port: env.PORT,
    host: env.HOST,
  });

  await migrate(db, { migrationsFolder: './migrations' });

  const signals = ['SIGINT', 'SIGTERM'];
  logger.debug(env, 'Environment variables');

  for (const signal of signals) {
    process.on(signal, () => {
      console.log('Got signal', signal);
      gracefulShutdown({ app });
    });
  }
}

main();
