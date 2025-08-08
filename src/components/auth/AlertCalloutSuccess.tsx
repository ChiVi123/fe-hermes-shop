import { CircleCheckBigIcon } from 'lucide-react';
import React from 'react';
import { Alert, AlertTitle } from '~/components/ui/alert';
import { cn } from '~/lib/utils';

export default function AlertCalloutSuccess({
  icon = <CircleCheckBigIcon size={16} className='!text-emerald-500' />,
  className,
  children,
  ...props
}: React.ComponentProps<typeof Alert> & { icon?: React.ReactNode }) {
  return (
    <Alert
      className={cn(
        'mb-4 bg-emerald-500/10 dark:bg-emerald-600/30 border-0 border-l-[10px] border-l-emerald-600',
        className
      )}
      {...props}
    >
      {icon}
      <AlertTitle>{children}</AlertTitle>
    </Alert>
  );
}
