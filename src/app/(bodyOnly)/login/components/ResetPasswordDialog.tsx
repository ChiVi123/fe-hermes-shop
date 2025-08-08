'use client';

import { SendIcon, ShieldCheckIcon, ShieldUserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { StepItem, Stepper, useStepper } from '~/components/ui/stepper';
import { getLoginPath, LoginStatus } from '~/lib/route';
import ChangePasswordForm from './ChangePasswordForm';
import RetryPasswordForm from './RetryPasswordForm';

const items: StepItem[] = [
  {
    title: 'Send mail',
    icon: <SendIcon />,
  },
  {
    title: 'Change password',
    icon: <ShieldUserIcon />,
  },
  {
    title: 'Done',
    icon: <ShieldCheckIcon />,
  },
];
const enum StepInfo {
  SendMail = 0,
  ChangePassword = 1,
  Done = 2,
}

export default function ResetPasswordDialog() {
  const { step, handleNext, handleReset } = useStepper(items);
  const [userId, setUserId] = useState<string>();
  const router = useRouter();

  const handleDialogOpenChange = () => {
    handleReset();
  };
  const handleResendSuccess = (id: string) => {
    setUserId(id);
    handleNext();
  };
  const handleDone = () => {
    router.push(getLoginPath({ status: LoginStatus.PasswordChanged }));
  };

  return (
    <Dialog onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button variant='link' size='sm'>
          Forgot your password?
        </Button>
      </DialogTrigger>

      <DialogContent ignoreOutsideClickSelector='[data-sonner-toaster]' className='sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle>Forgot password</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Stepper current={step} items={items} />

        {step === StepInfo.SendMail && <RetryPasswordForm onSuccess={handleResendSuccess} />}
        {step === StepInfo.ChangePassword && <ChangePasswordForm userId={userId} onSuccess={handleNext} />}
        {step === StepInfo.Done && (
          <p className='my-1 text-muted-foreground text-sm'>Your password was changed, login again.</p>
        )}

        <DialogFooter>
          {step === StepInfo.Done && (
            <DialogClose asChild>
              <Button type='button' variant='secondary' onClick={handleDone}>
                Done
              </Button>
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
