import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';

import { CommandSelect } from '@/components/command-select';
import { GenerateAvatar } from '@/components/generate-avatar';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { NewAgentDialog } from '@/modules/agents/ui/components/new-agent-dialog';
import { useTRPC } from '@/trpc/client';
import { meetingsInsertSchema } from '../../schema';
import type { MeetingGetOne } from '../../types';

type Props = {
  onSuccess?: (id: string) => void;
  onCancel?: () => void;
  initialValues?: MeetingGetOne;
};

export function MeetingForm({ onSuccess, onCancel, initialValues }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [openNewAgentDialog, setOpenNewAgentDialog] = useState(false);
  const [agentSearch, setAgentSearch] = useState('');

  const agents = useQuery(trpc.agents.getMany.queryOptions({ pageSize: 100, search: agentSearch }));

  const createMeeting = useMutation(
    trpc.meetings.create.mutationOptions({
      async onSuccess(data) {
        await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions());
        onSuccess?.(data.id);
      },
      onError(error) {
        toast.error(error.message);
        // TODO: check if error code is "Forbidden", redirect to "/upgrade"
      },
    }),
  );
  const updateMeeting = useMutation(
    trpc.meetings.update.mutationOptions({
      async onSuccess(data) {
        await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions());

        if (initialValues?.id) {
          await queryClient.invalidateQueries(
            trpc.meetings.getOne.queryOptions({ id: initialValues.id }),
          );
        }
        onSuccess?.(data.id);
      },
      onError(error) {
        toast.error(error.message);
        // TODO: check if error code is "Forbidden", redirect to "/upgrade"
      },
    }),
  );

  const form = useForm<z.infer<typeof meetingsInsertSchema>>({
    resolver: zodResolver(meetingsInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      agentId: initialValues?.agentId ?? '',
    },
  });

  const isEdit = !!initialValues?.id;
  const isPending = createMeeting.isPending || updateMeeting.isPending;

  const onSubmit = async (values: z.infer<typeof meetingsInsertSchema>) => {
    if (isEdit) {
      updateMeeting.mutate({ ...values, id: initialValues.id });
    } else {
      createMeeting.mutate(values);
    }
  };

  return (
    <>
      <NewAgentDialog open={openNewAgentDialog} onOpenAction={setOpenNewAgentDialog} />
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. Math Consultation" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="agentId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agent</FormLabel>
                <FormControl>
                  <CommandSelect
                    options={(agents.data?.items ?? []).map((agent) => ({
                      id: agent.id,
                      value: agent.id,
                      children: (
                        <div className="flex items-center gap-x-2">
                          <GenerateAvatar
                            seed={agent.name}
                            variant="botttsNeutral"
                            className="size6 border"
                          />
                          <span>{agent.name}</span>
                        </div>
                      ),
                    }))}
                    onSelect={field.onChange}
                    onSearch={setAgentSearch}
                    value={field.value}
                    placeholder="Search an agent"
                  />
                </FormControl>
                <FormDescription>
                  Not found what your&apos;re looking for?{' '}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => setOpenNewAgentDialog(true)}
                  >
                    Create new agent
                  </button>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between gap-x-2">
            {onCancel && (
              <Button variant="ghost" disabled={isPending} type="button" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button disabled={isPending} type="submit">
              {isEdit ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
