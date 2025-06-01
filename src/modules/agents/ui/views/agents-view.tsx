'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { EmptyState } from '@/components/empty-state';
import { useTRPC } from '@/trpc/client';
import { columns } from '../components/columns';
import { DataTable } from '../components/data-table';

export function AgentsView() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

  return (
    <div className="flex flex-1 flex-col gap-y-4 px-4 md:px-8">
      <DataTable data={data} columns={columns} />
      {data.length === 0 && (
        <EmptyState
          title="Create your first agent"
          description="Create a agent to join your meeting. Each agent will follow your instructions and can interact with participants during the call."
        />
      )}
    </div>
  );
}
