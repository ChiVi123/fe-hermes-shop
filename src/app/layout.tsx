import './globals.css';

import type { Metadata } from 'next';
import { Nunito_Sans } from 'next/font/google';
import { cookies } from 'next/headers';
import AppProvider from '~/components/AppProvider';
import { ThemeProvider } from '~/components/ThemeProvider';
import { Toaster } from '~/components/ui/sonner';
import { TokenName } from '~/constants';

const nunitoSans = Nunito_Sans({
  variable: '--font-nunito-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Hermes Shop',
  description:
    "Hermes: The world's most comfortable shoes, flats, and clothing made with natural materials like merino wool and eucalyptus.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const accessToken = (await cookies()).get(TokenName.ACCESS_TOKEN);

  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${nunitoSans.variable} antialiased`}>
        {/* TODO: toggle theme */}
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
          <AppProvider initialSessionToken={accessToken?.value}>{children}</AppProvider>
        </ThemeProvider>
        <Toaster richColors toastOptions={{ closeButton: true }} />
      </body>
    </html>
  );
}
