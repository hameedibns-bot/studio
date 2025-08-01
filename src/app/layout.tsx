import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Belleza, Alegreya } from 'next/font/google';

const belleza = Belleza({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-belleza',
});

const alegreya = Alegreya({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-alegreya',
});


export const metadata: Metadata = {
  title: 'ProLife+ AI Coach',
  description: 'Your personal AI-powered productivity and lifestyle coach.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${belleza.variable} ${alegreya.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
