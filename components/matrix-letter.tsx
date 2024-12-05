'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface MatrixLetterProps {
  letter: string
  index: number
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
const ANIMATION_DURATION = 50;
const ITERATIONS = 20;
const RESTART_DELAY = 3000;

export function MatrixLetter({ letter, index }: MatrixLetterProps) {
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