import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import type { SearchParams } from 'nuqs';

import { ErrorState } from '@/components/error-state';
import { LoadingState } from '@/components/loading-state';
import { auth } from '@/lib/auth';
import { loadSearchParams } from '@/modules/meetings/params';
import { MeetingsListHeader } from '@/modules/meetings/ui/components/meetings-list-header';
import { MeetingsView } from '@/modules/meetings/ui/view/meetings-view';
import { getQueryClient, trpc } from '@/trpc/server';

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function Page({ searchParams }: Props) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/sign-in');
  }

  const filters = await loadSearchParams(searchParams);
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.meetings.getMany.queryOptions(filters));

  return (
    <>
      <MeetingsListHeader />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense
          fallback={
            <LoadingState title="Loading Meetings" description="This may take a few seconds" />
          }
        >
          <ErrorBoundary
            fallback={<ErrorState title="Failed to loading" description="Please try again later" />}
          >
            <MeetingsView />
          </ErrorBoundary>
        </Suspense>
      </HydrationBoundary>
    </>
  );
}
