import { useRouter } from 'next/navigation';

import { ResponsiveDialog } from '@/components/responsive-dialog';
import { MeetingForm } from './meeting-form';

type Props = {
  open: boolean;
  onOpenAction: (open: boolean) => void;
};

export function NewMeetingDialog({ open, onOpenAction }: Props) {
  const router = useRouter();
  return (
    <ResponsiveDialog
      title="New Meeting"
      description="Create new meeting"
      open={open}
      onOpenAction={onOpenAction}
    >
      <MeetingForm
        onSuccess={(id) => {
          onOpenAction(false);
          router.push(`/meetings/${id}`);
        }}
        onCancel={() => onOpenAction(false)}
      />
    </ResponsiveDialog>
  );
}
