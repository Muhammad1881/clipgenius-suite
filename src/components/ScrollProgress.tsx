import { motion, useScroll, useSpring } from "framer-motion";

/** Thin aurora progress bar pinned to the very top of the page. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-cyan-glow via-primary to-purple-glow shadow-[0_0_12px_hsl(var(--primary)/0.6)]"
    />
  );
}
