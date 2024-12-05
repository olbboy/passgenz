'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const LanguageSwitcher = () => {
  const router = useRouter();
  const [locale, setLocale] = useState('en');

  const changeLanguage = () => {
    const newLocale = locale === 'en' ? 'vi' : 'en';
    setLocale(newLocale);
    router.push(`/${newLocale}`);
  };

  return (
    <button 
      onClick={changeLanguage} 
      className="flex items-center justify-center w-9 h-9 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition duration-200"
    >
      {locale === 'en' ? 'VI' : 'EN'}
    </button>
  );
};

export default LanguageSwitcher; 