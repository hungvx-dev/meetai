'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { VideoIcon } from 'lucide-react';

import { GenerateAvatar } from '@/components/generate-avatar';
import { Badge } from '@/components/ui/badge';
import { useTRPC } from '@/trpc/client';
import { AgentIdViewHeader } from '../components/agent-id-view-header';

type Props = {
  agentId: string;
};

export function AgentIdView({ agentId }: Props) {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.agents.getOne.queryOptions({ id: agentId }));

  return (
    <div className="flex flex-1 flex-col gap-y-4 overflow-hidden p-4 md:px-8">
      <AgentIdViewHeader
        agentId={agentId}
        agentName={data.name}
        onEdit={() => {}}
        onRemove={() => {}}
      />
      <div className="rounded-lg border bg-white">
        <div className="col-span-5 flex flex-col gap-y-5 p-4">
          <div className="flex items-center gap-x-3">
            <GenerateAvatar variant="botttsNeutral" seed={data.name} className="size-10" />
            <h2 className="text-2xl font-medium">{data.name}</h2>
          </div>
          <Badge variant="outline" className="flex items-center gap-x-2 [&>svg]:size-4">
            <VideoIcon className="text-blue-700" />
            {data.meetingCount} {data.meetingCount === 1 ? 'meeting' : 'meetings'}
          </Badge>
          <div className="flex flex-col gap-y-4">
            <p className="text-lg font-medium">Instructions</p>
            <p className="text-neutral-800">{data.instructions}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
