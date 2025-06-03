'use client';

import { useRouter } from 'next/navigation';
import { useSuspenseQuery } from '@tanstack/react-query';

import { DataTable } from '@/components/data-table';
import { EmptyState } from '@/components/empty-state';
import { DataPagination } from '@/modules/agents/ui/components/data-pagination';
import { useTRPC } from '@/trpc/client';
import { useMeetingsFilter } from '../../hooks/use-meeting-filter';
import { columns } from '../components/columns';

export function MeetingsView() {
  const router = useRouter();
  const [filters, setFilters] = useMeetingsFilter();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions(filters));

  return (
    <div className="flex flex-1 flex-col gap-y-4 overflow-auto px-4 pb-4 md:px-8">
      <DataTable
        data={data.items}
        columns={columns}
        onClickRow={(row) => router.push(`/meetings/${row.id}`)}
      />
      <DataPagination
        page={filters.page}
        totalPages={data.totalPages}
        onPageChange={(page) => setFilters({ page })}
      />
      {data.items.length === 0 && (
        <EmptyState
          title="Create your first meeting"
          description="Schedule a meeting to connect with others. Each meeting lets you collaborate, share ideas, and interact with participants real time."
        />
      )}
    </div>
  );
}
