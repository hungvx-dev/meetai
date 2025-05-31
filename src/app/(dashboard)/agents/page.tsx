import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { AgentsView } from '@/modules/agents/ui/views/agents-view';
import { getQueryClient, trpc } from '@/trpc/server';

export default async function Page() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={<LoadingState title="Loading Agents" description="This may take a few seconds" />}
      >
        <ErrorBoundary
          fallback={<ErrorState title="Failed to loading" description="Please try again later" />}
        >
          <AgentsView />;
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
}
