'use client';

import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';

type ResendInfo = {
  email?: string;
  open: boolean;
};
type ResendEmailContextType = {
  value: ResendInfo;
  setValue: Dispatch<SetStateAction<ResendInfo>>;
};

const ResendEmailContext = createContext<ResendEmailContextType>({ value: { open: false }, setValue() {} });

export function ResendEmailProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [value, setValue] = useState<ResendInfo>({ open: false });
  return <ResendEmailContext.Provider value={{ value, setValue }}>{children}</ResendEmailContext.Provider>;
}
export const useResendEmailContext = () => useContext(ResendEmailContext);
