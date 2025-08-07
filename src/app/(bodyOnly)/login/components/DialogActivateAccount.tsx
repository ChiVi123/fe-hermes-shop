'use client';

import { SendIcon, ShieldCheckIcon, ShieldEllipsisIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useResendEmailContext } from '~/app/(bodyOnly)/login/components/ResendEmailProvider';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog';
import { StepItem, Stepper, useStepper } from '~/components/ui/stepper';
import { getLoginAfterActivateAgain } from '~/lib/route';
import ResendMailForm from './ResendMailForm';
import VerifyForm from './VerifyForm';

const items: StepItem[] = [
  {
    title: 'Send mail',
    icon: <SendIcon />,
  },
  {
    title: 'Verify',
    icon: <ShieldEllipsisIcon />,
  },
  {
    title: 'Done',
    icon: <ShieldCheckIcon />,
  },
];
const enum StepInfo {
  SendMail = 0,
  Verify = 1,
  Done = 2,
}

export default function DialogActivateAccount() {
  const {
    value: { open, email },
    setValue,
  } = useResendEmailContext();
  const { step, handleNext, handleReset } = useStepper(items);
  const [userId, setUserId] = useState<string>();
  const router = useRouter();

  const handleDialogOpenChange = (v: boolean) => {
    setValue((prev) => ({ ...prev, open: v }));
    handleReset();
  };
  const handleResendSuccess = (id: string) => {
    setUserId(id);
    handleNext();
  };
  const handleDone = () => {
    router.push(getLoginAfterActivateAgain());
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogContent ignoreOutsideClickSelector='[data-sonner-toaster]' className='sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle>Activate account</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Stepper current={step} items={items} />

        {step === StepInfo.SendMail && <ResendMailForm email={email} onSuccess={handleResendSuccess} />}
        {/* TODO: may server change dto property name, should change for readable code */}
        {step === StepInfo.Verify && <VerifyForm id={userId} onSuccess={handleNext} />}
        {step === StepInfo.Done && (
          <p className='my-1 text-muted-foreground text-sm'>Your account is activate, login again.</p>
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
