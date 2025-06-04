import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { generateAvatarUri } from '@/lib/avatar';

type GenerateAvatarProps = {
  seed: string;
  className?: string;
  variant: 'botttsNeutral' | 'initials';
};

export function GenerateAvatar(props: GenerateAvatarProps) {
  const avatar = generateAvatarUri(props);

  return (
    <Avatar className={props.className}>
      <AvatarImage src={avatar}></AvatarImage>
      <AvatarFallback>{props.seed.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}
