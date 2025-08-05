import { $ZodFlattenedError } from 'zod/v4/core';
import { cn } from '~/lib/utils';

interface Props<T> {
  errorId: keyof $ZodFlattenedError<T>['fieldErrors'];
  error?: $ZodFlattenedError<T>['fieldErrors'];
}

export default function FormMessage<T>({ errorId, error, className, ...props }: React.ComponentProps<'p'> & Props<T>) {
  const body = error ? error[errorId] : props.children;
  if (!body) {
    return null;
  }
  return (
    <p className={cn('text-destructive text-sm', className)} {...props}>
      {Array.isArray(body) ? body[0] : body}
    </p>
  );
}
