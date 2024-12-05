import {NextIntlClientProvider} from 'next-intl';
import {notFound} from 'next/navigation';
import {locales} from '../i18n/settings';
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import { Inter, JetBrains_Mono, Outfit } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-cal-sans',
});

async function getMessages(locale: string) {
  try {
    return (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as any)) notFound();
  
  const messages = await getMessages(locale);

  return (
    <html lang={locale}>
      <body className={`${inter.variable} ${jetbrainsMono.variable} ${outfit.variable} font-sans antialiased`}>
        <NextIntlClientProvider 
          messages={messages} 
          locale={locale}
          timeZone="Asia/Ho_Chi_Minh"
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              <GoogleAnalytics gaId="G-E6RGNPR8L3" />
              <GoogleTagManager gtmId="GTM-NJVMX8WH" />
              {children}
              <Toaster />
            </TooltipProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
} 