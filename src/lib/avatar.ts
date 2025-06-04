import { botttsNeutral, initials } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';

type Props = {
  seed: string;
  variant: 'botttsNeutral' | 'initials';
};

export function generateAvatarUri({ variant, seed }: Props) {
  let avatar;
  if (variant === 'botttsNeutral') {
    avatar = createAvatar(botttsNeutral, { seed });
  } else {
    avatar = createAvatar(initials, { seed });
  }
  return avatar.toDataUri();
}
