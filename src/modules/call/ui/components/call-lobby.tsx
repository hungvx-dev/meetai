import Link from 'next/link';
import {
  DefaultVideoPlaceholder,
  StreamVideoParticipant,
  ToggleAudioPreviewButton,
  ToggleVideoPreviewButton,
  VideoPreview,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import { LogInIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { generateAvatarUri } from '@/lib/avatar';

import '@stream-io/video-react-sdk/dist/css/styles.css';

type Props = {
  onJoin: () => void;
};

export function CallLobby({ onJoin }: Props) {
  const { useCameraState, useMicrophoneState } = useCallStateHooks();
  const { hasBrowserPermission: hasMicPermission } = useMicrophoneState();
  const { hasBrowserPermission: hasCameraPermission } = useCameraState();

  const hasBrowserMediaPermission = hasCameraPermission && hasMicPermission;

  return (
    <div className="from-sidebar-accent to-sidebar flex h-full flex-col items-center justify-center bg-radial">
      <div className="flex flex-1 items-center justify-center px-8 py-4">
        <div className="bg-background flex flex-col items-center justify-center gap-y-6 rounded-lg p-10 shadow-sm">
          <div className="flex flex-col gap-y-2 text-center">
            <h6 className="text-lg">Readly to join?</h6>
            <p className="text-sm">Set up your call before joining</p>
          </div>
          <VideoPreview
            DisabledVideoPreview={
              hasBrowserMediaPermission ? AllowBrowserPermission : DisabledVideoPreview
            }
          />
          <div className="flex gap-x-2">
            <ToggleAudioPreviewButton />
            <ToggleVideoPreviewButton />
          </div>
          <div className="flex w-full justify-between gap-x-2">
            <Button asChild variant="ghost">
              <Link href="/meetings">Cancel</Link>
            </Button>
            <Button onClick={onJoin}>
              <LogInIcon />
              Join Call
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DisabledVideoPreview() {
  const { data } = authClient.useSession();
  const { name = '', image = generateAvatarUri({ seed: name, variant: 'initials' }) } =
    data?.user || {};
  return (
    <DefaultVideoPlaceholder
      participant={
        {
          name,
          image,
        } as StreamVideoParticipant
      }
    />
  );
}

function AllowBrowserPermission() {
  return (
    <p className="px-4 text-sm">
      Please grant your browser a permission to access your camera and microphone
    </p>
  );
}
