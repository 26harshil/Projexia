"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { SignInButton, SignUpButton, SignedOut } from "@clerk/nextjs";

// ─── CONFIGURATION ───────────────────────────────────────────────────────────
const TOTAL_FRAMES = 160;
const FRAME_PREFIX = "/ezgif-frame-";
const LERP_FACTOR = 0.08; // Lower = smoother/heavier scroll feel (0.05–0.15 range)

// ─── UTILITY ─────────────────────────────────────────────────────────────────
/** Linear interpolation: smoothly advance `current` toward `target` */
const lerp = (current: number, target: number, factor: number) =>
  current + (target - current) * factor;

/** Left-pads a number with zeros, e.g. 3 → "003" */
const pad = (n: number, digits = 3) => String(n).padStart(digits, "0");

export function HeroScrollSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Frame tracking (using refs to avoid React re-renders in rAF loop)
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0); // rendered frame
  const targetFrameRef = useRef(0); // desired frame from scroll position
  const rafRef = useRef<number>(0);
  const lerpProgressRef = useRef(0); // 0–1 scroll progress (lerped)

  // React state only for UI elements that need re-renders
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0); // 0–1

  // ─── CANVAS DRAW ─────────────────────────────────────────────────────────
  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[frameIndex];
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // DPR Scaling: multiply canvas internal resolution by device pixel ratio
    // This keeps the canvas crisp on Retina/4K displays.
    // We set css width/height to 100%, but the actual pixel buffer is larger.
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    }

    // Cover-fit: center-crop the image to fill the canvas (like CSS object-fit: cover)
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = w / h;
    let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;

    if (imgAspect > canvasAspect) {
      // Image is wider than canvas → clip left/right
      sw = img.naturalHeight * canvasAspect;
      sx = (img.naturalWidth - sw) / 2;
    } else {
      // Image is taller than canvas → clip top/bottom
      sh = img.naturalWidth / canvasAspect;
      sy = (img.naturalHeight - sh) / 2;
    }

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
  }, []);

  // ─── rAF RENDER LOOP ─────────────────────────────────────────────────────
  // This is the core animation loop. It runs 60fps via requestAnimationFrame.
  // Each frame, it lerps the current progress toward the target (from scroll),
  // computes which image frame to show, and only draws if the frame changed.
  const animate = useCallback(() => {
    const target = targetFrameRef.current;

    // LERP: smoothly move lerpProgress toward the raw target frame
    // Math: lerpProgress += (target - lerpProgress) * LERP_FACTOR
    // At 60fps with factor=0.08: reaches ~95% of target in ~37 frames (~620ms)
    lerpProgressRef.current = lerp(lerpProgressRef.current, target, LERP_FACTOR);

    const newFrame = Math.round(lerpProgressRef.current);

    if (newFrame !== currentFrameRef.current) {
      currentFrameRef.current = newFrame;
      drawFrame(newFrame);
      // Update React state for overlay opacity (throttled by rAF)
      setScrollProgress(newFrame / (TOTAL_FRAMES - 1));
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [drawFrame]);

  // ─── SCROLL HANDLER ──────────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const { top, height } = container.getBoundingClientRect();
      const scrollableHeight = height - window.innerHeight;

      // Clamp scroll progress between 0 and 1
      const rawProgress = Math.max(0, Math.min(1, -top / scrollableHeight));

      // Map 0–1 scroll to 0–(TOTAL_FRAMES-1) frame index
      targetFrameRef.current = rawProgress * (TOTAL_FRAMES - 1);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ─── RESIZE HANDLER ──────────────────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      drawFrame(currentFrameRef.current);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [drawFrame]);

  // ─── PRELOADER ───────────────────────────────────────────────────────────
  // Preloads ALL frames into memory before starting animation.
  // Uses Promise.all with individual load tracking for accurate progress.
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);

    const promises = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        const frameNumber = i + 1;
        img.src = `${FRAME_PREFIX}${pad(frameNumber)}.jpg`;

        img.onload = () => {
          images[i] = img;
          loadedCount++;
          setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
          resolve();
        };

        img.onerror = () => {
          // On error, still resolve so Promise.all doesn't hang
          loadedCount++;
          setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
          resolve();
        };
      });
    });

    Promise.all(promises).then(() => {
      imagesRef.current = images;
      setIsLoaded(true);

      // Draw first frame immediately
      drawFrame(0);

      // Start the rAF loop
      rafRef.current = requestAnimationFrame(animate);

      // Fade out loader with a delay for smooth UX
      setTimeout(() => setLoaderVisible(false), 600);
    });

    return () => cancelAnimationFrame(rafRef.current);
  }, [animate, drawFrame]);

  // ─── OVERLAY TEXT VISIBILITY (scroll-driven) ─────────────────────────────
  // Text fades in when scroll progress > 50%, matching the visual sequence
  const textOpacity = Math.max(0, Math.min(1, (scrollProgress - 0.5) * 4));
  const subTextOpacity = Math.max(0, Math.min(1, (scrollProgress - 0.6) * 4));
  const btnOpacity = Math.max(0, Math.min(1, (scrollProgress - 0.7) * 4));

  return (
    <>
      {/* ── LOADING SCREEN ─────────────────────────────────────────────── */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#050A1F",
          opacity: loaderVisible ? 1 : 0,
          pointerEvents: loaderVisible ? "all" : "none",
          transition: "opacity 0.6s ease",
        }}
      >
        {/* Logo mark */}
        <div style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          border: "2px solid #00C6FF",
          boxShadow: "0 0 30px #00C6FF55",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 32,
          animation: "pulse 2s ease-in-out infinite",
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#00C6FF" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="#7B5FF5" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="#00C6FF" strokeWidth="2" strokeLinejoin="round" opacity="0.6"/>
          </svg>
        </div>

        <div style={{ fontFamily: "'Inter', sans-serif", color: "#A0B0D0", fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 20 }}>
          Loading Experience
        </div>

        {/* Progress track */}
        <div style={{ width: 240, height: 2, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${loadProgress}%`,
            background: "linear-gradient(90deg, #00C6FF, #7B5FF5)",
            boxShadow: "0 0 12px #00C6FF",
            transition: "width 0.15s linear",
            borderRadius: 2,
          }} />
        </div>

        <div style={{ fontFamily: "'Inter', sans-serif", color: "#00C6FF", fontSize: 14, fontWeight: 600, marginTop: 14, letterSpacing: "0.1em" }}>
          {loadProgress}%
        </div>
      </div>

      {/* ── STICKY SCROLL CONTAINER ────────────────────────────────────── */}
      {/* Height = 100vh (sticky) + extra scroll distance to animate through */}
      <div
        ref={containerRef}
        style={{
          position: "relative",
          height: `${100 + TOTAL_FRAMES * 4}vh`, // scrollable length proportional to frame count
          background: "#050A1F",
        }}
      >
        {/* Sticky viewport — stays fixed while parent scrolls */}
        <div style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          overflow: "hidden",
        }}>
          {/* ── CANVAS ──────────────────────────────────────────────── */}
          <canvas
            ref={canvasRef}
            style={{
              display: "block",
              width: "100%",
              height: "100%",
            }}
          />

          {/* ── DARK VIGNETTE OVERLAY ────────────────────────────────── */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at center, transparent 50%, rgba(5,10,31,0.7) 100%)",
            pointerEvents: "none",
          }} />

          {/* ── NAVBAR GLASS STRIP ──────────────────────────────────── */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 40px",
            background: "rgba(5, 10, 31, 0.5)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(0, 198, 255, 0.12)",
            zIndex: 10,
          }}>
            {/* Wordmark */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 36, height: 36,
                borderRadius: "50%",
                border: "1.5px solid #00C6FF",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 16px rgba(0,198,255,0.3)",
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#00C6FF" strokeWidth="2.5" strokeLinejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="#7B5FF5" strokeWidth="2.5" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 15, color: "#E8F4FF", letterSpacing: "0.04em" }}>
                SPMS
              </span>
            </div>

            {/* Nav links */}
            <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
              {["Features", "About", "Workflow"].map((item) => (
                <span key={item} style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  color: "rgba(200, 220, 255, 0.75)",
                  letterSpacing: "0.06em",
                  cursor: "pointer",
                  textTransform: "uppercase",
                  fontWeight: 500,
                  transition: "color 0.2s",
                }}>
                  {item}
                </span>
              ))}
            </div>

            {/* CTA */}
            <SignedOut>
              <SignInButton mode="modal" forceRedirectUrl="/check-role">
                <button style={{
                  padding: "8px 22px",
                  border: "1.5px solid rgba(0,198,255,0.5)",
                  borderRadius: 30,
                  background: "rgba(0,198,255,0.08)",
                  color: "#00C6FF",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  cursor: "pointer",
                  transition: "all 0.25s",
                }}>
                  LOG IN
                </button>
              </SignInButton>
            </SignedOut>
          </div>

          {/* ── INITIAL HERO COPY (visible before scroll) ──────────────── */}
          <div style={{
            position: "absolute",
            bottom: 80,
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            opacity: 1 - scrollProgress * 3,
            pointerEvents: "none",
            zIndex: 10,
            transition: "none",
          }}>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 13,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(0, 198, 255, 0.9)",
              marginBottom: 12,
            }}>
              Scroll to explore
            </p>
            <div style={{
              width: 1,
              height: 50,
              background: "linear-gradient(to bottom, #00C6FF, transparent)",
              margin: "0 auto",
              animation: "scrollLine 1.5s ease-in-out infinite",
            }} />
          </div>

          {/* ── MIDPOINT CONTENT (fade in at 50% scroll) ─────────────── */}
          <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            pointerEvents: btnOpacity > 0.5 ? "all" : "none",
          }}>
            {/* Eyebrow */}
            <div style={{
              opacity: textOpacity,
              transform: `translateY(${(1 - textOpacity) * 24}px)`,
              transition: "none",
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}>
              <div style={{ width: 32, height: 1, background: "#00C6FF" }} />
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 12,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#00C6FF",
                fontWeight: 600,
              }}>
                Student Project Management System
              </span>
              <div style={{ width: 32, height: 1, background: "#00C6FF" }} />
            </div>

            {/* Main headline */}
            <h1 style={{
              opacity: textOpacity,
              transform: `translateY(${(1 - textOpacity) * 32}px)`,
              transition: "none",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(32px, 6vw, 80px)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              textAlign: "center",
              color: "#FFFFFF",
              margin: "0 0 16px 0",
              textTransform: "uppercase",
              maxWidth: 900,
            }}>
              Streamline Your
              <br />
              <span style={{
                background: "linear-gradient(90deg, #00C6FF 0%, #7B5FF5 50%, #00C6FF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Academic Projects
              </span>
            </h1>

            {/* Sub-headline */}
            <p style={{
              opacity: subTextOpacity,
              transform: `translateY(${(1 - subTextOpacity) * 20}px)`,
              transition: "none",
              fontFamily: "'Inter', sans-serif",
              fontSize: "clamp(14px, 1.8vw, 20px)",
              color: "rgba(180, 210, 255, 0.8)",
              textAlign: "center",
              maxWidth: 560,
              lineHeight: 1.65,
              margin: "0 0 40px 0",
              fontWeight: 400,
            }}>
              Intelligent group formation · guide allocation · milestone tracking · comprehensive reporting — all in one unified platform.
            </p>

            {/* CTA Button cluster */}
            <div style={{
              opacity: btnOpacity,
              transform: `translateY(${(1 - btnOpacity) * 16}px)`,
              transition: "none",
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              justifyContent: "center",
            }}>
              <SignedOut>
                <SignUpButton mode="modal" forceRedirectUrl="/check-role">
                  <button className="hero-cta-primary">
                    START PROJECT
                    <svg style={{ marginLeft: 10 }} width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </SignUpButton>
                <SignInButton mode="modal" forceRedirectUrl="/check-role">
                  <button className="hero-cta-secondary">
                    LOG IN
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>

          {/* ── CORNER GLASSMORPHIC STAT CARDS ───────────────────────── */}
          <div style={{
            position: "absolute",
            bottom: 40,
            left: 40,
            display: "flex",
            gap: 12,
            zIndex: 10,
            opacity: Math.max(0, Math.min(1, (scrollProgress - 0.8) * 5)),
          }}>
            {[
              { value: "500+", label: "Projects Managed" },
              { value: "98%", label: "On-Time Delivery" },
              { value: "3x", label: "Faster Review" },
            ].map((stat) => (
              <div key={stat.value} style={{
                padding: "14px 22px",
                background: "rgba(10, 20, 50, 0.55)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: "1px solid rgba(0, 198, 255, 0.2)",
                borderRadius: 14,
                textAlign: "center",
              }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 22, color: "#00C6FF", lineHeight: 1.1 }}>
                  {stat.value}
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: "rgba(180, 210, 255, 0.65)", letterSpacing: "0.1em", marginTop: 4, textTransform: "uppercase" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* ── SCROLL PROGRESS BAR (right edge) ─────────────────────── */}
          <div style={{
            position: "absolute",
            right: 0,
            top: 64,
            bottom: 0,
            width: 3,
            background: "rgba(255,255,255,0.05)",
            zIndex: 10,
          }}>
            <div style={{
              width: "100%",
              height: `${scrollProgress * 100}%`,
              background: "linear-gradient(to bottom, #00C6FF, #7B5FF5)",
              boxShadow: "0 0 8px #00C6FF",
              transition: "height 0.05s linear",
            }} />
          </div>
        </div>
      </div>

      {/* ── GLOBAL STYLES (scoped) ──────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(0,198,255,0.3); }
          50%       { box-shadow: 0 0 40px rgba(0,198,255,0.7), 0 0 80px rgba(123,95,245,0.3); }
        }

        @keyframes scrollLine {
          0%   { opacity: 1; transform: scaleY(1) translateY(0); }
          50%  { opacity: 0.4; transform: scaleY(0.6) translateY(10px); }
          100% { opacity: 1; transform: scaleY(1) translateY(0); }
        }

        .hero-cta-primary {
          display: inline-flex;
          align-items: center;
          padding: 14px 34px;
          background: linear-gradient(135deg, #00C6FF 0%, #7B5FF5 100%);
          color: #fff;
          border: none;
          border-radius: 60px;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          box-shadow: 0 0 30px rgba(0,198,255,0.4), 0 8px 30px rgba(0,0,0,0.3);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .hero-cta-primary:hover {
          box-shadow: 0 0 60px rgba(0,198,255,0.7), 0 16px 50px rgba(0,0,0,0.4);
          transform: translateY(-3px) scale(1.04);
        }

        .hero-cta-secondary {
          display: inline-flex;
          align-items: center;
          padding: 14px 34px;
          background: rgba(0, 198, 255, 0.07);
          color: rgba(200, 230, 255, 0.9);
          border: 1.5px solid rgba(0, 198, 255, 0.35);
          border-radius: 60px;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 14px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          backdrop-filter: blur(12px);
          transition: all 0.25s ease;
        }

        .hero-cta-secondary:hover {
          border-color: rgba(0, 198, 255, 0.8);
          background: rgba(0, 198, 255, 0.15);
          color: #00C6FF;
          transform: translateY(-2px);
        }
      `}</style>
    </>
  );
}
