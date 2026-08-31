/**
 * Pure-CSS aurora light streaks. GPU-only (transform/opacity), no JS per frame,
 * paused entirely when the user prefers reduced motion.
 */
export function AuroraStreaks() {
  return (
    <div aria-hidden className="aurora-streaks pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <span className="aurora-streak aurora-streak-1" />
      <span className="aurora-streak aurora-streak-2" />
      <span className="aurora-streak aurora-streak-3" />
      <span className="aurora-streak aurora-streak-4" />
    </div>
  );
}
