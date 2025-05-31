'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { ResponsiveDialog } from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';
// import { ErrorState } from '@/components/error-state';
// import { LoadingState } from '@/components/loading-state';
import { useTRPC } from '@/trpc/client';

export function AgentsView() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

  return (
    <div>
      {/* <ResponsiveDialog title="test" description="test" open onOpenAction={() => ({})}> */}
      {/*   <Button> action</Button> */}
      {/* </ResponsiveDialog> */}
      {JSON.stringify(data, null, 2)}
    </div>
  );
}
