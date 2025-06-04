'use client';

import { LoaderIcon } from 'lucide-react';

import { authClient } from '@/lib/auth-client';
import { generateAvatarUri } from '@/lib/avatar';
import CallConnect from './call-connect';

type Props = {
  meetingId: string;
  meetingName: string;
};

export function CallProvider({ meetingId, meetingName }: Props) {
  const { data, isPending } = authClient.useSession();

  if (!data || isPending) {
    return (
      <div className="from-sidebar-accent to-sidebar flex h-screen items-center justify-center bg-radial">
        <LoaderIcon className="size-6 animate-spin text-white" />
      </div>
    );
  }

  const { id, name, image } = data.user;

  return (
    <CallConnect
      meetingId={meetingId}
      meetingName={meetingName}
      userId={id}
      userName={name}
      userImage={image ?? generateAvatarUri({ seed: name, variant: 'initials' })}
    />
  );
}
