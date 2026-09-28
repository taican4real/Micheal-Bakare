import React from 'react';
import { motion } from 'motion/react';

const easeCurve = [0.22, 1, 0.36, 1];

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  yOffset?: number;
  margin?: string;
}

export function ScrollReveal({ 
  children, 
  className = "", 
  delay = 0,
  yOffset = 40,
  margin = "-100px"
}: ScrollRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: margin as any }}
      transition={{ duration: 1, delay, ease: easeCurve }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const StaggerContainer: React.FC<{ 
  children: React.ReactNode, 
  className?: string,
  delay?: number,
  margin?: string
}> = ({ 
  children, 
  className = "", 
  delay = 0,
  margin = "-100px"
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: margin as any }}
      variants={{
        visible: {
          transition: { staggerChildren: 0.1, delayChildren: delay }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const StaggerItem: React.FC<{ 
  children: React.ReactNode, 
  className?: string, 
  yOffset?: number,
  delay?: number
}> = ({ 
  children, 
  className = "", 
  yOffset = 40, 
  delay 
}) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: yOffset },
        visible: { 
          opacity: 1, 
          y: 0, 
          transition: { duration: 1, ease: easeCurve } 
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
