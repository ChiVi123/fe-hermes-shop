import { Fragment } from 'react';
import Header from '~/components/layout/Header';

export default function HeaderOnlyLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <Fragment>
      <Header />
      {children}
    </Fragment>
  );
}
