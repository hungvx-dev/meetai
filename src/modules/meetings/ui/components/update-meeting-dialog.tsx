import { ResponsiveDialog } from '@/components/responsive-dialog';
import { MeetingGetOne } from '../../types';
import { MeetingForm } from './meeting-form';

type Props = {
  open: boolean;
  meeting: MeetingGetOne;
  onOpenAction: (open: boolean) => void;
};

export function UpdateMeetingDialog({ open, meeting, onOpenAction }: Props) {
  return (
    <ResponsiveDialog
      title="Edit Meeting"
      description="Edit the meeting detail"
      open={open}
      onOpenAction={onOpenAction}
    >
      <MeetingForm
        onSuccess={() => onOpenAction(false)}
        onCancel={() => onOpenAction(false)}
        initialValues={meeting}
      />
    </ResponsiveDialog>
  );
}
