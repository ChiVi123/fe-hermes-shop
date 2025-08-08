import { Loader2Icon } from 'lucide-react';
import { ComponentProps } from 'react';
import { Button } from '~/components/ui/button';

interface Props extends ComponentProps<typeof Button> {
  load?: boolean;
}

export default function LoadingButton({ load, children, ...props }: Props) {
  return (
    <Button disabled={load} {...props}>
      {load && <Loader2Icon className='animate-spin' />}
      {load ? 'Please wait' : children}
    </Button>
  );
}
