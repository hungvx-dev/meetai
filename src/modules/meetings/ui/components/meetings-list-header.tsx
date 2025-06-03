'use client';

import { useState } from 'react';
import { PlusIcon, XCircleIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { DEFAULT_PAGE } from '@/constants';
import { useMeetingsFilter } from '../../hooks/use-meeting-filter';
import AgentIdFilter from './agent-id-filter';
import { MeetingSearchFilter } from './meeting-search-filter';
import { NewMeetingDialog } from './new-meeting-dialog';
import { StatusFilter } from './status-filter';

export function MeetingsListHeader() {
  const [filters, setFilters] = useMeetingsFilter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isAnyFilterModidified = !!filters.search || !!filters.agentId || !!filters.status;

  const onClearFilter = () => {
    setFilters({
      search: '',
      page: DEFAULT_PAGE,
      status: null,
      agentId: null,
    });
  };

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
        <ScrollArea>
          <div className="item-center flex gap-x-2 p-1">
            <MeetingSearchFilter />
            <StatusFilter />
            <AgentIdFilter />
            {isAnyFilterModidified && (
              <Button variant="outline" onClick={onClearFilter}>
                <XCircleIcon />
                Clear
              </Button>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
}
