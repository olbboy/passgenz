'use client';

import { useRouter, usePathname } from 'next/navigation';
import { getLocale } from '@/app/i18n/settings';
import { Button } from "@/components/ui/button";

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = getLocale(pathname);

  const changeLanguage = () => {
    const newLocale = currentLocale === 'en' ? 'vi' : 'en';
    const newPathname = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPathname);
    router.refresh();
  };

  return (
    <Button 
      onClick={changeLanguage} 
      variant="outline"
      size="icon"
      className="w-9 h-9"
    >
      {currentLocale === 'en' ? 'VI' : 'EN'}
    </Button>
  );
};

export default LanguageSwitcher; 