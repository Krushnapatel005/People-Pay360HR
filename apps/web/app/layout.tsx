import type { Metadata } from 'next';
import './globals.css';
import { AppProviders } from '../components/app-providers';

export const metadata: Metadata = {
  title: { default: 'PeoplePay360', template: '%s | PeoplePay360' },
  description: 'Modern HR & Payroll operations platform — manage employees, contracts, attendance, time off and payroll in one place.',
  keywords: ['HR', 'payroll', 'employees', 'attendance', 'time off', 'contracts'],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
