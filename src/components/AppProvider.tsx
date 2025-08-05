'use client';

import { useState } from 'react';
import { clientSessionToken } from '~/lib/requests';
import { isClient } from '~/lib/utils';

interface Props extends Readonly<{ children: React.ReactNode }> {
  initialSessionToken?: string;
}

export default function AppProvider({ initialSessionToken = '', children }: Props) {
  useState(() => {
    if (isClient()) {
      clientSessionToken.value = initialSessionToken;
    }
  });

  return children;
}
