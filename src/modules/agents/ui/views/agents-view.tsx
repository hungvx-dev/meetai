'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

// import { ErrorState } from '@/components/error-state';
// import { LoadingState } from '@/components/loading-state';
import { useTRPC } from '@/trpc/client';

export function AgentsView() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

  // if (isLoading) {
  //   return <LoadingState title="Loading Agents" description="This may take a few seconds" />;
  // }
  //
  // if (error) {
  //   return <ErrorState title="Failed to loading" description="Please try again later" />;
  // }

  return <div>{JSON.stringify(data, null, 2)}</div>;
}
