import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { LocaleInitializer } from '@/components/LocaleInitializer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SmartSell - AI-Powered E-Commerce Platform',
  description: 'Create beautiful, high-converting online stores with AI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={inter.className}>
        <LocaleInitializer />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
