'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { ErrorState } from '@/components/error-state';
import { MeetingStatus } from '@/modules/meetings/types';
import { useTRPC } from '@/trpc/client';
import { CallProvider } from '../components/call-provider';

type Props = {
  meetingId: string;
};

export function CallMeetingView({ meetingId }: Props) {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.meetings.getOne.queryOptions({ id: meetingId }));

  if (data.status === MeetingStatus.Completed) {
    return (
      <div className="flex h-screen items-center justify-center">
        <ErrorState title="Meeting has end" description="You can no longer join this meeting" />
      </div>
    );
  }

  return <CallProvider meetingId={meetingId} meetingName={data.name} />;
}
