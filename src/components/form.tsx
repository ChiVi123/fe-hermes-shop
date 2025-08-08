import { $ZodFlattenedError } from 'zod/v4/core';
import { Label } from '~/components/ui/label';
import { cn } from '~/lib/utils';

export function Form({ action, className, children, ...props }: React.ComponentProps<'form'>) {
  return (
    <form action={action} noValidate className={cn('space-y-6', className)} {...props}>
      {children}
    </form>
  );
}

export function FormItem({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('grid gap-2', className)} {...props} />;
}

interface FormLabelProps extends React.ComponentProps<typeof Label> {
  error?: string[] | undefined;
  required?: boolean;
}

export function FormLabel({ required, error, children, className, ...props }: FormLabelProps) {
  return (
    <Label {...props} className={cn({ 'text-destructive': error }, className)}>
      {children}
      {required && <span className='text-destructive'>*</span>}
    </Label>
  );
}

interface FormMessageProps<T> extends React.ComponentProps<'p'> {
  name: keyof $ZodFlattenedError<T>['fieldErrors'];
  errors?: $ZodFlattenedError<T>['fieldErrors'];
}

export function FormMessage<T>({ name, errors, className, ...props }: FormMessageProps<T>) {
  const body = errors ? errors[name] : props.children;
  if (!body) return null;

  return (
    <p className={cn('text-destructive text-sm', className)} {...props}>
      {Array.isArray(body) ? body[0] : body}
    </p>
  );
}
