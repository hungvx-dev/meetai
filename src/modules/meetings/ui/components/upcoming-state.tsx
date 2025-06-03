import Link from 'next/link';
import { BanIcon, VideoIcon } from 'lucide-react';

import { EmptyState } from '@/components/empty-state';
import { Button } from '@/components/ui/button';

type Props = {
  meetingId: string;
  isCancelling: boolean;
  onCancelMeeting: () => void;
};

export function UpcomingState({ meetingId, isCancelling, onCancelMeeting }: Props) {
  return (
    <div className="flex flex-col items-center justify-center gap-y-8 rounded-lg bg-white px-4 py-5">
      <EmptyState
        title="Not started yet"
        description="Once you start this meeting, a summary will appear here"
        image="/upcoming.svg"
      />
      <div className="flex w-full flex-col items-center gap-2 lg:flex-row lg:justify-center">
        <Button asChild className="w-full lg:w-auto" disabled={isCancelling}>
          <Link href={`/call/${meetingId}`}>
            <VideoIcon />
            Start meeting
          </Link>
        </Button>
        <Button
          variant="secondary"
          className="w-full lg:w-auto"
          disabled={isCancelling}
          onClick={onCancelMeeting}
        >
          <BanIcon />
          Cancel meeting
        </Button>
      </div>
    </div>
  );
}
