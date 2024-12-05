'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface MatrixLetterProps {
  letter: string
  index: number
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
const ANIMATION_DURATION = 50;
const ITERATIONS = 20;
const RESTART_DELAY = 3000;

function MatrixLetter({ letter, index }: MatrixLetterProps) {
  const [displayChar, setDisplayChar] = useState(letter);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (!isAnimating) return;

    let iterations = 0;
    const interval = setInterval(() => {
      if (iterations < ITERATIONS) {
        setDisplayChar(CHARS[Math.floor(Math.random() * CHARS.length)]);
        iterations++;
      } else {
        clearInterval(interval);
        setDisplayChar(letter);
        
        const timeout = setTimeout(() => {
          setIsAnimating(true);
        }, RESTART_DELAY);
        
        return () => clearTimeout(timeout);
      }
    }, ANIMATION_DURATION);

    return () => clearInterval(interval);
  }, [letter, isAnimating]);

  return (
    <motion.span
      className="inline-block"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {displayChar}
    </motion.span>
  );
}

export function MatrixHeader() {
  const title = "PassGenZ";

  return (
    <div className="flex items-center gap-2">
      <h1 className="font-display text-4xl sm:text-5xl relative flex items-center">
        <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
          {title.split('').map((letter, index) => (
            <MatrixLetter key={index} letter={letter} index={index} />
          ))}
        </span>
        {/* <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          className={cn(
            "ml-4 font-sans text-lg sm:text-2xl font-light text-muted-foreground",
            "hidden md:inline-block"
          )}
        >
          Advanced Password Generator
        </motion.span> */}
      </h1>
    </div>
  );
} 