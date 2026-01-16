import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

// Fade in from bottom
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
};

// Stagger children
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Stagger children (faster)
export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

// Card hover effect
export const cardHover: Variants = {
  rest: { scale: 1, y: 0 },
  hover: { 
    scale: 1.02, 
    y: -4,
    transition: { duration: 0.2, ease: "easeOut" }
  },
};

// Message bubble animation
export const messageBubble: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: "spring", damping: 20, stiffness: 300 }
  },
};

// Hero text reveal
export const heroTextReveal: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  },
};

// Slide in for sidebars
export const slideInLeft: Variants = {
  hidden: { x: "-100%", opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { type: "spring", damping: 25, stiffness: 200 }
  },
};

// Wrapper components
interface MotionWrapperProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export const FadeInUp = ({ children, delay = 0, className }: MotionWrapperProps) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.5, delay, ease: "easeOut" }
      },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerContainer = ({ children, className }: MotionWrapperProps) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-50px" }}
    variants={staggerContainer}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, className }: MotionWrapperProps) => (
  <motion.div variants={fadeInUp} className={className}>
    {children}
  </motion.div>
);
