import { TRPCError } from '@trpc/server';
import { and, count, desc, eq, getTableColumns, ilike } from 'drizzle-orm';
import { z } from 'zod';

import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from '@/constants';
import { db } from '@/db';
import { meetings } from '@/db/schema';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';

export const meetingsRouter = createTRPCRouter({
  getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
    const [existingMeeting] = await db
      .select({
        ...getTableColumns(meetings),
      })
      .from(meetings)
      .where(and(eq(meetings.id, input.id), eq(meetings.userId, ctx.auth.user.id)));

    if (!existingMeeting) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Meeting not fount' });
    }

    return existingMeeting;
  }),
  getMany: protectedProcedure
    .input(
      z
        .object({
          page: z.number().default(DEFAULT_PAGE),
          pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
          search: z.string().nullish(),
        })
        .default({}),
    )
    .query(async ({ input, ctx }) => {
      const { page, pageSize, search } = input;
      const data = await db
        .select({
          ...getTableColumns(meetings),
        })
        .from(meetings)
        .where(
          and(
            eq(meetings.userId, ctx.auth.session.userId),
            search ? ilike(meetings.name, `%${search}%`) : undefined,
          ),
        )
        .orderBy(desc(meetings.createAt), desc(meetings.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [total] = await db
        .select({ count: count() })
        .from(meetings)
        .where(
          and(
            eq(meetings.userId, ctx.auth.session.userId),
            search ? ilike(meetings.name, `%${search}%`) : undefined,
          ),
        );
      const totalPages = Math.ceil(total.count / pageSize);

      return {
        totalPages,
        total: total.count,
        items: data,
      };
    }),
  // create: protectedProcedure.input(agentsInsertSchema).mutation(async ({ input, ctx }) => {
  //   const [createdAgent] = await db
  //     .insert(agents)
  //     .values({ ...input, userId: ctx.auth.user.id })
  //     .returning();
  //   return createdAgent;
  // }),
  // update: protectedProcedure.input(agentsUpdateSchema).mutation(async ({ input, ctx }) => {
  //   const [updatedAgent] = await db
  //     .update(agents)
  //     .set(input)
  //     .where(and(eq(agents.id, input.id), eq(agents.userId, ctx.auth.user.id)))
  //     .returning();
  //   if (!updatedAgent) {
  //     throw new TRPCError({ code: 'NOT_FOUND', message: 'Agent not found' });
  //   }
  //   return updatedAgent;
  // }),
  // remove: protectedProcedure
  //   .input(z.object({ id: z.string() }))
  //   .mutation(async ({ input, ctx }) => {
  //     const [removedAgent] = await db
  //       .delete(agents)
  //       .where(and(eq(agents.id, input.id), eq(agents.userId, ctx.auth.user.id)))
  //       .returning();
  //     if (!removedAgent) {
  //       throw new TRPCError({ code: 'NOT_FOUND', message: 'Agent not found' });
  //     }
  //     return removedAgent;
  //   }),
});
