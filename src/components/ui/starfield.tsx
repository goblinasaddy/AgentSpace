"use client";

import { useEffect, useRef } from "react";

interface Star {
    x: number;
    y: number;
    radius: number;
    alpha: number;
    alphaDir: number;
    vx: number;
    vy: number;
    layer: number; // 0=far, 1=mid, 2=near
}

interface ShootingStar {
    x: number;
    y: number;
    vx: number;
    vy: number;
    length: number;
    alpha: number;
    life: number;
    maxLife: number;
}

interface Particle {
    x: number;
    y: number;
    radius: number;
    color: string;
    alpha: number;
    vx: number;
    vy: number;
}

export function Starfield() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let rafId: number;
        let stars: Star[] = [];
        let shootingStars: ShootingStar[] = [];
        let particles: Particle[] = [];
        let frame = 0;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            buildScene();
        };

        const rand = (min: number, max: number) => Math.random() * (max - min) + min;

        const buildScene = () => {
            // --- Stars across 3 depth layers ---
            stars = [];
            const totalStars = Math.min(200, Math.max(120, Math.floor((canvas.width * canvas.height) / 5000)));
            for (let i = 0; i < totalStars; i++) {
                const layer = Math.floor(Math.random() * 3);
                const speed = layer === 0 ? 0.04 : layer === 1 ? 0.10 : 0.20;
                stars.push({
                    x: rand(0, canvas.width),
                    y: rand(0, canvas.height),
                    radius: layer === 0 ? rand(0.3, 0.8) : layer === 1 ? rand(0.6, 1.2) : rand(0.9, 1.8),
                    alpha: rand(0.2, 0.9),
                    alphaDir: Math.random() > 0.5 ? 1 : -1,
                    vx: rand(-speed, speed),
                    vy: rand(-speed * 0.4, speed * 0.4),
                    layer,
                });
            }

            // --- Nebula dust particles ---
            particles = [];
            const nebulaColors = [
                "100,80,200",   // purple
                "60,100,220",   // blue
                "140,60,220",   // violet
                "80,160,255",   // light blue
            ];
            for (let i = 0; i < 12; i++) {
                particles.push({
                    x: rand(0, canvas.width),
                    y: rand(0, canvas.height),
                    radius: rand(60, 180),
                    color: nebulaColors[Math.floor(Math.random() * nebulaColors.length)],
                    alpha: rand(0.015, 0.045),
                    vx: rand(-0.04, 0.04),
                    vy: rand(-0.02, 0.02),
                });
            }
        };

        const spawnShootingStar = () => {
            const x = rand(0, canvas.width * 0.8);
            const y = rand(0, canvas.height * 0.4);
            const angle = rand(20, 45) * (Math.PI / 180);
            const speed = rand(6, 12);
            shootingStars.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                length: rand(80, 180),
                alpha: 1,
                life: 0,
                maxLife: rand(40, 70),
            });
        };

        const drawNebula = () => {
            for (const p of particles) {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < -p.radius) p.x = canvas.width + p.radius;
                if (p.x > canvas.width + p.radius) p.x = -p.radius;
                if (p.y < -p.radius) p.y = canvas.height + p.radius;
                if (p.y > canvas.height + p.radius) p.y = -p.radius;

                const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
                grd.addColorStop(0, `rgba(${p.color},${p.alpha})`);
                grd.addColorStop(1, `rgba(${p.color},0)`);
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = grd;
                ctx.fill();
            }
        };

        const drawStars = () => {
            for (const s of stars) {
                // Twinkle
                s.alpha += s.alphaDir * rand(0.001, 0.005);
                if (s.alpha >= 0.95) { s.alpha = 0.95; s.alphaDir = -1; }
                if (s.alpha <= 0.08) { s.alpha = 0.08; s.alphaDir = 1; }

                // Drift
                s.x += s.vx;
                s.y += s.vy;
                if (s.x < 0) s.x = canvas.width;
                if (s.x > canvas.width) s.x = 0;
                if (s.y < 0) s.y = canvas.height;
                if (s.y > canvas.height) s.y = 0;

                // Glow — larger glow for nearer stars
                const glowSize = s.radius * (s.layer === 2 ? 3.5 : s.layer === 1 ? 2.5 : 1.5);
                const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowSize);
                const brightness = s.layer === 2 ? 255 : s.layer === 1 ? 230 : 200;
                grd.addColorStop(0, `rgba(${brightness},${brightness},255,${s.alpha})`);
                grd.addColorStop(0.4, `rgba(${brightness},${brightness},255,${s.alpha * 0.4})`);
                grd.addColorStop(1, `rgba(${brightness},${brightness},255,0)`);

                ctx.beginPath();
                ctx.arc(s.x, s.y, glowSize, 0, Math.PI * 2);
                ctx.fillStyle = grd;
                ctx.fill();

                // Hard core dot
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
                ctx.fill();
            }
        };

        const drawShootingStars = () => {
            for (let i = shootingStars.length - 1; i >= 0; i--) {
                const s = shootingStars[i];
                s.life++;
                s.x += s.vx;
                s.y += s.vy;
                s.alpha = 1 - s.life / s.maxLife;

                const tailX = s.x - s.vx * (s.length / 10);
                const tailY = s.y - s.vy * (s.length / 10);

                const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
                grad.addColorStop(0, `rgba(255,255,255,0)`);
                grad.addColorStop(1, `rgba(255,255,255,${s.alpha * 0.9})`);

                ctx.beginPath();
                ctx.moveTo(tailX, tailY);
                ctx.lineTo(s.x, s.y);
                ctx.strokeStyle = grad;
                ctx.lineWidth = 1.5;
                ctx.stroke();

                // Bright head glow
                const headGrd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 6);
                headGrd.addColorStop(0, `rgba(200,220,255,${s.alpha})`);
                headGrd.addColorStop(1, `rgba(200,220,255,0)`);
                ctx.beginPath();
                ctx.arc(s.x, s.y, 6, 0, Math.PI * 2);
                ctx.fillStyle = headGrd;
                ctx.fill();

                if (s.life >= s.maxLife) shootingStars.splice(i, 1);
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Nebula clouds (lowest)
            drawNebula();

            // Stars (middle)
            drawStars();

            // Shooting stars (top)
            drawShootingStars();

            // Spawn shooting star occasionally
            frame++;
            if (frame % 220 === 0 && Math.random() > 0.3) {
                spawnShootingStar();
            }

            rafId = requestAnimationFrame(draw);
        };

        const ro = new ResizeObserver(resize);
        ro.observe(canvas);
        resize();
        draw();

        return () => {
            cancelAnimationFrame(rafId);
            ro.disconnect();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 2 }}
        />
    );
}
