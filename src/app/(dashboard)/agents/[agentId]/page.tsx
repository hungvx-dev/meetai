import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { AgentIdView } from '@/modules/agents/ui/views/agent-id-view';
import { getQueryClient, trpc } from '@/trpc/server';

type Props = {
  params: Promise<{ agentId: string }>;
};

export default async function Page({ params }: Props) {
  const { agentId } = await params;

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.agents.getOne.queryOptions({ id: agentId }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={<LoadingState title="Loading Agent" description="This may take a few seconds" />}
      >
        <ErrorBoundary
          fallback={<ErrorState title="Error Loading Agent" description="Please try again later" />}
        >
          <AgentIdView agentId={agentId} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
}
