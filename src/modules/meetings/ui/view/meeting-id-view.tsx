'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { VideoIcon } from 'lucide-react';
import { toast } from 'sonner';

import { GenerateAvatar } from '@/components/generate-avatar';
import { Badge } from '@/components/ui/badge';
import { useConfirm } from '@/hooks/use-confirm';
import { ActiveState } from '@/modules/meetings/ui/components/active-state';
import { UpcomingState } from '@/modules/meetings/ui/components/upcoming-state';
import { useTRPC } from '@/trpc/client';
import { MeetingStatus } from '../../types';
import { CancelledState } from '../components/cancelled-state';
import { MeetingIdViewHeader } from '../components/meeting-id-view-header';
import { ProcessingState } from '../components/processing-state';
import { UpdateMeetingDialog } from '../components/update-meeting-dialog';

type Props = {
  meetingId: string;
};

export function MeetingIdView({ meetingId }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const [updateMeetingUpdate, setUpdateMeetingUpdate] = useState(false);

  const { data } = useSuspenseQuery(trpc.meetings.getOne.queryOptions({ id: meetingId }));
  const [RemoveConfirmationDialog, confirmRemove] = useConfirm(
    'Are you sure?',
    `The following action will remove this meeting`,
  );

  const isUpcoming = data.status === MeetingStatus.Upcoming;
  const isActive = data.status === MeetingStatus.Active;
  const isCancelled = data.status === MeetingStatus.Cancelled;
  const isProcessing = data.status === MeetingStatus.Processing;
  const isCompleted = data.status === MeetingStatus.Completed;

  const removeMeeting = useMutation(
    trpc.meetings.remove.mutationOptions({
      async onSuccess() {
        await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions());
        router.push('/meetings');
      },
      onError(error) {
        toast.error(error.message);
      },
    }),
  );

  const handleRemoveMeeting = async () => {
    const ok = await confirmRemove();

    if (!ok) return;

    await removeMeeting.mutateAsync({ id: meetingId });
  };

  return (
    <>
      <RemoveConfirmationDialog />
      <UpdateMeetingDialog
        open={updateMeetingUpdate}
        onOpenAction={setUpdateMeetingUpdate}
        meeting={data}
      />
      <div className="flex flex-1 flex-col gap-y-4 overflow-hidden p-4 md:px-8">
        <MeetingIdViewHeader
          meetingId={meetingId}
          meetingName={data.name}
          onEdit={() => setUpdateMeetingUpdate(true)}
          onRemove={handleRemoveMeeting}
        />
        {isUpcoming && (
          <UpcomingState meetingId={data.id} isCancelling={false} onCancelMeeting={() => {}} />
        )}
        {isActive && <ActiveState meetingId={data.id} />}
        {isProcessing && <ProcessingState />}
        {isCompleted && <ProcessingState />}
        {isCancelled && <CancelledState />}

        <div className="rounded-lg border bg-white">
          <div className="col-span-5 flex flex-col gap-y-5 p-4">
            <div className="flex items-center gap-x-3">
              <GenerateAvatar variant="botttsNeutral" seed={data.name} className="size-10" />
              <h2 className="text-2xl font-medium">{data.name}</h2>
            </div>
            {/* <Badge variant="outline" className="flex items-center gap-x-2 [&>svg]:size-4"> */}
            {/*   <VideoIcon className="text-blue-700" /> */}
            {/*   {data.meetingCount} {data.meetingCount === 1 ? 'meeting' : 'meetings'} */}
            {/* </Badge> */}
            {/* <div className="flex flex-col gap-y-4"> */}
            {/*   <p className="text-lg font-medium">Instructions</p> */}
            {/*   <p className="text-neutral-800">{data.instructions}</p> */}
            {/* </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
