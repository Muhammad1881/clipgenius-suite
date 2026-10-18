import { useEffect, useRef } from "react";

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const mouse = { x: null as number | null, y: null as number | null, radius: 140 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;

      constructor(x: number, y: number, vx: number, vy: number, size: number, color: string) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.size = size;
        this.color = color;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x > width) this.x = 0;
        if (this.x < 0) this.x = width;
        if (this.y > height) this.y = 0;
        if (this.y < 0) this.y = height;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;
            this.x -= (dx / distance) * force * 2.5;
            this.y -= (dy / distance) * force * 2.5;
          }
        }
        this.draw();
      }
    }

    let particles: Particle[] = [];
    const colors = [
      "rgba(139, 92, 246, 0.45)",
      "rgba(6, 182, 212, 0.45)",
      "rgba(255, 255, 255, 0.25)",
    ];

    function initParticles() {
      particles = [];
      const count = Math.min((width * height) / 16000, 80);
      for (let i = 0; i < count; i++) {
        particles.push(
          new Particle(
            Math.random() * width,
            Math.random() * height,
            (Math.random() - 0.5) * 0.4,
            (Math.random() - 0.5) * 0.4,
            Math.random() * 2 + 0.5,
            colors[Math.floor(Math.random() * colors.length)]
          )
        );
      }
    }

    initParticles();
    let animationFrameId: number;

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
      }
      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} id="particle-canvas" />
      <div className="noise-overlay" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[85vw] h-[550px] blur-[130px] opacity-25 pointer-events-none rounded-full z-[-1]"
        style={{
          background:
            "conic-gradient(from 180deg at 50% 50%, rgba(139, 92, 246, 0.13) 0deg, rgba(6, 182, 212, 0.13) 180deg, rgba(139, 92, 246, 0.13) 360deg)",
        }}
      />
    </>
  );
}
