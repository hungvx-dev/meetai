'use client';

import { useState } from 'react';
import { PlusIcon, XCircleIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DEFAULT_PAGE } from '@/constants';
import { NewMeetingDialog } from './new-meeting-dialog';

export function MeetingsListHeader() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <NewMeetingDialog open={isDialogOpen} onOpenAction={setIsDialogOpen} />
      <div className="flex flex-col gap-y-4 p-4 md:px-8">
        <div className="flex items-center justify-between">
          <h5 className="text-xl font-medium">My meetings</h5>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusIcon />
            New Meeting
          </Button>
        </div>
        <div className="item-center flex gap-x-2 p-1">{/* TODO: Filter */}</div>
      </div>
    </>
  );
}
