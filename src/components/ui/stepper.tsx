'use client';

import { CheckIcon } from 'lucide-react';
import { Fragment, ReactNode, useState } from 'react';
import { cn } from '~/lib/utils';

export interface StepItem {
  title: string;
  subTitle?: string;
  description?: ReactNode;
  icon?: ReactNode;
}

interface StepperProps {
  current: number;
  items: StepItem[];
}

export function Stepper({ current, items, ...props }: StepperProps) {
  return (
    <div className='flex items-center gap-4 mb-4' {...props}>
      {items.map((step, stepIndex) => (
        <Fragment key={stepIndex}>
          <div
            data-role='step-item'
            className={cn('flex-[0_0_auto] flex items-center gap-2', { 'items-start': step.description })}
          >
            <div
              data-role='step-status'
              className={cn('flex-[0_0_auto] flex items-center justify-center size-10 rounded-full text-sm font-bold', {
                'bg-primary text-primary-foreground': stepIndex <= current,
                'bg-secondary text-secondary-foreground': stepIndex > current,
              })}
            >
              {step.icon || (stepIndex < current ? <CheckIcon /> : stepIndex)}
            </div>

            <div>
              <div className='flex gap-2'>
                <div
                  className={cn('text-sm font-bold text-muted-foreground', {
                    'text-accent-foreground': stepIndex === current,
                  })}
                >
                  {step.title}
                </div>

                <div className='text-sm text-muted-foreground'>{step.subTitle}</div>
              </div>

              <div data-role='step-description' className='flex-[0_0_100%] '>
                {step.description}
              </div>
            </div>
          </div>

          {stepIndex < items.length - 1 && (
            <div className={cn('flex-1 relative')}>
              <div className='absolute top-1/2 right-0 left-0 -translate-y-1/2 h-0.5 bg-muted'></div>
              <div
                className={cn(
                  'absolute top-1/2 right-0 left-0 -translate-y-1/2 w-0 h-0.5 bg-primary transition-[width]',
                  {
                    'w-full': stepIndex < current,
                  }
                )}
              ></div>
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
}
/**
 *
 * @param stepItems Just pass length number, but we ensure length of stepItems
 * @param initial Set the initial step, counting from 0
 */
export const useStepper = ({ length }: StepItem[], initial: number = 0) => {
  const [step, setStep] = useState(initial);
  const handleNext = () => {
    if (step < length) {
      setStep(step + 1);
    }
  };
  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };
  const handleReset = () => {
    setStep(0);
  };
  const isHasNext = () => step < length;
  const isHasPrevious = () => step > 0;

  return { step, setStep, handleNext, handlePrevious, handleReset, isHasNext, isHasPrevious };
};
