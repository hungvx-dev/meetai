import { useState } from 'react';
import { StreamTheme, useCall } from '@stream-io/video-react-sdk';

import { CallActive } from './call-active';
import { CallEnded } from './call-ended';
import { CallLobby } from './call-lobby';

type Props = {
  meetingName: string;
};

export function CallUI({ meetingName }: Props) {
  const call = useCall();
  const [show, setShow] = useState<'lobby' | 'call' | 'ended'>('lobby');

  const handleJoin = async () => {
    if (!call) return;
    await call.join();
    setShow('call');
  };

  const handlLeave = () => {
    if (!call) return;
    call.endCall();
    setShow('ended');
  };

  return (
    <StreamTheme className="h-full">
      {show === 'lobby' && <CallLobby onJoin={handleJoin} />}
      {show === 'call' && <CallActive meetingName={meetingName} onLeave={handlLeave} />}
      {show === 'ended' && <CallEnded />}
    </StreamTheme>
  );
}
