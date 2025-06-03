'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { DataTable } from '@/components/data-table';
import { EmptyState } from '@/components/empty-state';
import { DataPagination } from '@/modules/agents/ui/components/data-pagination';
import { useTRPC } from '@/trpc/client';
import { columns } from '../components/columns';

export function MeetingsView() {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions());

  return (
    <div className="flex flex-1 flex-col gap-y-4 overflow-auto px-4 pb-4 md:px-8">
      <DataTable data={data.items} columns={columns} />
      {data.items.length === 0 && (
        <EmptyState
          title="Create your first meeting"
          description="Schedule a meeting to connect with others. Each meeting lets you collaborate, share ideas, and interact with participants real time."
        />
      )}
    </div>
  );
}
