import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/layout/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-vc-bg text-vc-text-secondary font-mono flex flex-col">
      <div className="flex-1">
        {/* ── Nav ── */}
        <header className="px-6 py-4 flex justify-between items-center max-w-6xl mx-auto w-full md:py-5 md:px-8 animate-fade-in">
          <Link href="/" className="no-underline">
            <Image
              src="/orb.png"
              alt="vibeycoder"
              width={48}
              height={48}
              className="h-10 w-10 md:h-12 md:w-12"
              priority
            />
          </Link>
          <Link
            href="/dashboard"
            className="btn-glow inline-block px-5 py-2 rounded-lg text-xs font-bold font-sans no-underline text-black md:px-6 md:py-2.5 md:text-sm md:rounded-xl"
            style={{ background: "linear-gradient(135deg, #a855f7, #00f0ff)" }}
          >
            Start Coding
          </Link>
        </header>

        {/* ── Hero ── */}
        <div className="px-6 pt-16 pb-16 text-center max-w-4xl mx-auto md:pt-24 md:pb-24 lg:pt-32 lg:pb-28 relative">
          {/* Atmospheric glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] md:w-[900px] md:h-[500px] pointer-events-none"
            style={{
              background: "radial-gradient(ellipse, rgba(0,240,255,0.06) 0%, rgba(168,85,247,0.05) 30%, rgba(249,115,22,0.02) 50%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-vc-text font-sans tracking-tight leading-[1.1] mb-6 relative animate-fade-in-d1">
            Build Real Things.
            <br />
            <span className="bg-gradient-to-r from-vc-cyan via-vc-purple to-vc-orange bg-clip-text text-transparent">
              Ship Every Week.
            </span>
          </h1>

          <p className="text-base text-vc-text-muted mb-10 leading-relaxed max-w-lg mx-auto md:text-xl md:max-w-2xl md:mb-12 relative animate-fade-in-d2">
            A 28-day builder lab where you create real apps with AI coding tools. No boring lectures, just pure creation.
          </p>

          <div className="relative animate-fade-in-d3">
            <Link
              href="/dashboard"
              className="btn-glow inline-block px-10 py-4 rounded-xl text-base font-bold font-sans no-underline text-black md:px-12 md:py-5 md:text-lg md:rounded-2xl"
              style={{ background: "linear-gradient(135deg, #00f0ff, #a855f7)" }}
            >
              Start
            </Link>
          </div>
        </div>

        {/* ── What this is ── */}
        <div className="max-w-xl mx-auto px-6 pb-16 md:pb-20 lg:max-w-2xl">
          <h2 className="text-xl font-bold text-vc-text font-sans text-center mb-5 md:text-2xl lg:text-3xl">
            This is a builder lab.
          </h2>
          <div className="text-sm text-vc-text-dim leading-relaxed text-center space-y-3 md:text-base md:space-y-4">
            <p>
              You don&apos;t watch videos.<br />
              You don&apos;t memorize syntax.<br />
              You build.
            </p>
            <p className="text-vc-text-muted">
              Vibey Coder guides you step by step while you use AI coding tools to create real apps.
            </p>
            <p className="text-vc-text-ghost font-mono text-xs tracking-wide md:text-sm">
              Prompt. Generate. Inspect. Refine. Ship.
            </p>
          </div>
        </div>

        {/* ── What you'll do ── */}
        <div className="max-w-2xl mx-auto px-6 pb-16 md:pb-20 lg:max-w-3xl">
          <h2 className="text-xl font-bold text-vc-text font-sans text-center mb-6 md:text-2xl md:mb-8 lg:text-3xl">
            In 28 days, you will:
          </h2>
          <ul className="space-y-3 max-w-md mx-auto md:max-w-none md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-4 md:space-y-0">
            {[
              "Build and ship 4 real apps",
              "Learn how websites are structured",
              "Use AI to write and improve code",
              "Debug errors without panicking",
              "Deploy projects publicly",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-vc-text-dim md:text-base">
                <span
                  className="w-1 h-1 rounded-full bg-vc-cyan shrink-0 md:w-1.5 md:h-1.5"
                  style={{ boxShadow: "0 0 6px rgba(0,240,255,0.4)" }}
                />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* ── How it works ── */}
        <div className="bg-vc-card/50 border-y border-vc-border py-12 px-6 md:py-16 lg:py-20">
          <div className="max-w-xl mx-auto text-center md:max-w-2xl">
            <h2 className="text-xl font-bold text-vc-text font-sans mb-5 md:text-2xl md:mb-6 lg:text-3xl">
              How it works
            </h2>
            <div className="text-sm text-vc-text-dim leading-relaxed space-y-3 md:text-base md:space-y-4">
              <p>
                You build outside the lab.<br />
                The lab tells you what to do.
              </p>
              <p>
                Each mission takes about 30 minutes.<br />
                You move at your pace.
              </p>
              <p className="text-vc-text-ghost font-mono text-xs tracking-wide md:text-sm">
                No pressure. No streaks. Just progress.
              </p>
            </div>
          </div>
        </div>

        {/* ── Final CTA ── */}
        <div className="py-16 px-6 text-center md:py-24 lg:py-32 relative">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] md:w-[600px] md:h-[300px] pointer-events-none"
            style={{
              background: "radial-gradient(ellipse, rgba(168,85,247,0.06) 0%, rgba(0,240,255,0.03) 40%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-vc-text font-sans mb-4 leading-snug relative">
            Most people use AI.<br />
            <span className="bg-gradient-to-r from-vc-cyan to-vc-purple bg-clip-text text-transparent">
              You build with it.
            </span>
          </h2>
          <div className="mt-8 relative">
            <Link
              href="/dashboard"
              className="btn-glow inline-block px-10 py-4 rounded-xl text-base font-bold font-sans no-underline text-black md:px-12 md:py-5 md:text-lg md:rounded-2xl"
              style={{ background: "linear-gradient(135deg, #00f0ff, #a855f7)" }}
            >
              Start
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
