'use client'

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MatrixLetter } from '@/components/matrix-letter';

export function MatrixHeader() {
  const t = useTranslations('HomePage');
  const title = "PassGenZ";

  return (
    <div className="flex items-center gap-2">
      <h1 className="font-display text-4xl sm:text-5xl relative flex items-center">
        <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
          {title.split('').map((letter, index) => (
            <MatrixLetter key={index} letter={letter} index={index} />
          ))}
        </span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className={cn(
            "ml-4 font-sans text-lg sm:text-2xl font-light text-muted-foreground",
            "hidden md:inline-block"
          )}
        >
          {t('title')}
        </motion.span>
      </h1>
    </div>
  );
} 