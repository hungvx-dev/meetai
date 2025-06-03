import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { CommandSelect } from '@/components/command-select';
import { GenerateAvatar } from '@/components/generate-avatar';
import { useTRPC } from '@/trpc/client';
import { useMeetingsFilter } from '../../hooks/use-meeting-filter';

export default function AgentIdFilter() {
  const [filters, setFilters] = useMeetingsFilter();
  const trpc = useTRPC();
  const [agentSearch, setAgentSearch] = useState('');
  const { data } = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: 100,
      search: agentSearch,
    }),
  );

  return (
    <CommandSelect
      options={(data?.items ?? []).map((agent) => ({
        id: agent.id,
        value: agent.id,
        children: (
          <div className="flex items-center gap-x-2">
            <GenerateAvatar seed={agent.name} variant="botttsNeutral" className="size-6 border" />
            <span>{agent.name}</span>
          </div>
        ),
      }))}
      onSelect={(value) => setFilters({ agentId: value })}
      onSearch={setAgentSearch}
      value={filters.agentId}
      placeholder="Search an agent"
    />
  );
}
