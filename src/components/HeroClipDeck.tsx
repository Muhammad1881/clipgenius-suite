import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { Trophy } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import clip1Video from "@/assets/clip-9.mp4.asset.json";
import clip2Video from "@/assets/cristiano-saudi.mp4.asset.json";

type DeckCard = {
  label: string;
  title: string;
  score: string;
  video?: string;
  /** resting rotation + offset for the fanned-out deck */
  rotate: number;
  x: string;
  y: string;
  z: number;
};

const cards: DeckCard[] = [
  { label: "Clip 01", title: "Alternative terms for early risers", score: "94%", video: clip1Video.url, rotate: -8, x: "-118%", y: "7%", z: -120 },
  { label: "Clip 02", title: "Cristiano on life in Saudi Arabia", score: "97%", video: clip2Video.url, rotate: 0, x: "0%", y: "0%", z: 40 },
  { label: "Clip 03", title: "\"You won't believe what happened next…\"", score: "91%", rotate: 8, x: "118%", y: "7%", z: -120 },
];

/**
 * GPU-only 3D clip deck: pointer parallax drives motion values (no React re-renders),
 * tilt is disabled on touch/small screens and when the user prefers reduced motion.
 */
export function HeroClipDeck() {
  const reduce = useReducedMotion();
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px) and (hover: hover) and (pointer: fine)");
    const update = () => setInteractive(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 90, damping: 18, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 90, damping: 18, mass: 0.6 });

  const rotateY = useTransform(sx, [-1, 1], [14, -14]);
  const rotateX = useTransform(sy, [-1, 1], [-10, 10]);

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!interactive || reduce) return;
      const r = e.currentTarget.getBoundingClientRect();
      px.set(((e.clientX - r.left) / r.width) * 2 - 1);
      py.set(((e.clientY - r.top) / r.height) * 2 - 1);
    },
    [interactive, reduce, px, py],
  );

  const onLeave = useCallback(() => {
    px.set(0);
    py.set(0);
  }, [px, py]);

  const enable3d = interactive && !reduce;

  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="mt-14 sm:mt-20 relative mx-auto w-full max-w-4xl [perspective:1400px]"
    >
      {/* ambient glow behind the deck */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[70%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-vivid opacity-25 blur-[90px]"
      />

      <motion.div
        style={enable3d ? { rotateX, rotateY, transformStyle: "preserve-3d" } : { transformStyle: "preserve-3d" }}
        className="relative mx-auto flex h-[320px] w-full items-center justify-center sm:h-[420px]"
      >
        {cards.map((c, i) => (
          <motion.article
            key={c.label}
            initial={{ opacity: 0, y: "40%", x: "0%", z: 0, rotate: 0 }}
            animate={{ opacity: 1, y: c.y, x: c.x, z: c.z, rotate: c.rotate }}
            transition={{ duration: 0.8, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ zIndex: c.z > 0 ? 2 : 1, transformStyle: "preserve-3d" }}
            className="absolute aspect-[9/16] h-full max-h-[420px] overflow-hidden rounded-[1.4rem] glass-strong border-gradient shadow-elevated transition-transform duration-500 will-change-transform hover:!scale-[1.04] deck-card"
          >
            {c.video ? (
              <video
                src={c.video}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="absolute inset-0 h-full w-full object-cover opacity-90"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-accent/15 to-transparent" />
            )}

            {/* moving sheen */}
            <div aria-hidden className="deck-sheen pointer-events-none absolute inset-0" />
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent" />

            <div className="relative flex h-full flex-col justify-between p-3 sm:p-4">
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{c.label}</span>
              <div>
                <p className="line-clamp-2 text-[11px] font-medium leading-tight text-foreground sm:text-xs">{c.title}</p>
                <div className="mt-2 flex items-center gap-1 text-[10px] text-accent">
                  <Trophy className="size-3" /> {c.score} viral score
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </div>
  );
}
