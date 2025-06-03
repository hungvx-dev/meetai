import { useState } from 'react';
import { ChevronsUpDownIcon } from 'lucide-react';

import {
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandResponsiveDialog,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

type Props = {
  options: Array<{
    id: string;
    value: string;
    children: React.ReactNode;
  }>;
  value: string;
  placeholder?: string;
  isSearchable?: boolean;
  className?: string;
  onSelect: (value: string) => void;
  onSearch?: (value: string) => void;
};
export function CommandSelect({
  options,
  value,
  placeholder,
  // isSearchable,
  className,
  onSearch,
  onSelect,
}: Props) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  const handleOpenChange = (open: boolean) => {
    onSearch?.('');
    setOpen(open);
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className={cn(
          'h-9 justify-between px-2 font-normal',
          !selectedOption && 'text-muted-foreground',
          className,
        )}
        onClick={() => setOpen(true)}
      >
        <div>{selectedOption?.children ?? placeholder}</div>
        <ChevronsUpDownIcon />
      </Button>
      <CommandResponsiveDialog shouldFilter={!onSearch} open={open} onOpenChange={handleOpenChange}>
        <CommandInput placeholder="Search..." onValueChange={onSearch} />

        <CommandList>
          <CommandEmpty>
            <span className="text-muted-foreground text-sm">No options found</span>
          </CommandEmpty>
          {options.map((option) => (
            <CommandItem
              key={option.id}
              onSelect={() => {
                onSelect(option.value);
                setOpen(false);
              }}
            >
              {option.children}
            </CommandItem>
          ))}
        </CommandList>
      </CommandResponsiveDialog>
    </>
  );
}
