import {
  CircleArrowUpIcon,
  CircleCheckIcon,
  CircleXIcon,
  LoaderIcon,
  VideoIcon,
} from 'lucide-react';

import { CommandSelect } from '@/components/command-select';
import { useMeetingsFilter } from '../../hooks/use-meeting-filter';
import { MeetingStatus } from '../../types';

const options = [
  {
    id: MeetingStatus.Upcoming,
    value: MeetingStatus.Upcoming,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <CircleArrowUpIcon />
        {MeetingStatus.Upcoming}
      </div>
    ),
  },
  {
    id: MeetingStatus.Processing,
    value: MeetingStatus.Processing,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <LoaderIcon />
        {MeetingStatus.Processing}
      </div>
    ),
  },
  {
    id: MeetingStatus.Active,
    value: MeetingStatus.Active,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <VideoIcon />
        {MeetingStatus.Active}
      </div>
    ),
  },
  {
    id: MeetingStatus.Completed,
    value: MeetingStatus.Completed,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <CircleCheckIcon />
        {MeetingStatus.Completed}
      </div>
    ),
  },
  {
    id: MeetingStatus.Cancelled,
    value: MeetingStatus.Cancelled,
    children: (
      <div className="flex items-center gap-x-2 capitalize">
        <CircleXIcon />
        {MeetingStatus.Cancelled}
      </div>
    ),
  },
];

export function StatusFilter() {
  const [filters, setFilters] = useMeetingsFilter();

  return (
    <CommandSelect
      placeholder="Status"
      className="h-9"
      options={options}
      value={filters.status ?? ''}
      onSelect={(value) => setFilters({ status: value as MeetingStatus })}
    />
  );
}
