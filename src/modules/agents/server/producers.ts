import { eq, getTableColumns, sql } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/db';
import { agents } from '@/db/schema';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { agentsInsertSchema } from '../schemas';

export const agentsRouter = createTRPCRouter({
  getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    const [existingAgent] = await db
      .select({
        ...getTableColumns(agents),
        meetingCount: db.$count(agents, eq(agents.userId, ctx.auth.session.userId)),
      })
      .from(agents)
      .where(eq(agents.id, input.id));

    return existingAgent;
  }),
  getMany: protectedProcedure.query(async ({ ctx }) => {
    const data = await db
      .select({
        ...getTableColumns(agents),
        meetingCount: db.$count(agents, eq(agents.userId, ctx.auth.session.userId)),
      })
      .from(agents);

    return data;
  }),
  create: protectedProcedure.input(agentsInsertSchema).mutation(async ({ input, ctx }) => {
    const [createdAgent] = await db
      .insert(agents)
      .values({ ...input, userId: ctx.auth.user.id })
      .returning();
    return createdAgent;
  }),
});
