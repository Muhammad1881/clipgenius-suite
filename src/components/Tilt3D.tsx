import { useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

type Props = {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees */
  max?: number;
  /** Lift on hover, px */
  lift?: number;
  glare?: boolean;
};

/**
 * Lightweight 3D pointer tilt. Uses direct style writes (no React state per
 * mousemove for the transform) so it stays smooth without re-rendering.
 */
export function Tilt3D({ children, className = "", max = 9, lift = 8, glare = true }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const raf = useRef<number | null>(null);
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  const apply = (e: React.MouseEvent) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - py) * max * 2;
    const ry = (px - 0.5) * max * 2;
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-${lift}px) scale(1.02)`;
      el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
    });
  };

  const reset = () => {
    setHovered(false);
    const el = ref.current;
    if (!el) return;
    if (raf.current) cancelAnimationFrame(raf.current);
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)";
  };

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={apply}
      onMouseLeave={reset}
      style={{ transformStyle: "preserve-3d", transition: "transform 350ms cubic-bezier(0.22,1,0.36,1)" }}
      className={`relative will-change-transform ${className}`}
    >
      <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }} className="relative z-10">
        {children}
      </div>
      {glare && !reduce && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300"
          style={{
            opacity: hovered ? 1 : 0,
            background:
              "radial-gradient(500px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.10), transparent 45%)",
          }}
        />
      )}
    </div>
  );
}
