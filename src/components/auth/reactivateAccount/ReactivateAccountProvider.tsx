'use client';

import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';

type ReactivateAccountValue = {
  email?: string;
  open: boolean;
};
type ReactivateAccountContextType = {
  value: ReactivateAccountValue;
  setValue: Dispatch<SetStateAction<ReactivateAccountValue>>;
};

const ReactivateAccountContext = createContext<ReactivateAccountContextType>({ value: { open: false }, setValue() {} });

export function ReactivateAccountProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [value, setValue] = useState<ReactivateAccountValue>({ open: false });
  return <ReactivateAccountContext.Provider value={{ value, setValue }}>{children}</ReactivateAccountContext.Provider>;
}
export const useReactivateAccountContext = () => useContext(ReactivateAccountContext);
