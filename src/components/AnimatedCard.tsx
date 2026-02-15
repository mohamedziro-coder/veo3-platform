import { motion } from 'framer-motion';
import React, { ReactNode } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
}

export function AnimatedCard({ children }: AnimatedCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255,0,128,0.6)' }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 bg-white/5 rounded-2xl backdrop-blur-lg"
    >
      {children}
    </motion.div>
  );
}
