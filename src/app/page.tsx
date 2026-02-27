import Link from "next/link";
import Footer from "@/components/layout/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-vc-bg text-vc-text-secondary font-mono flex flex-col">
      <div className="flex-1">
        {/* Hero */}
        <div className="px-6 pt-16 pb-12 text-center max-w-2xl mx-auto">
          <div className="text-6xl mb-4">{"</>"}</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-vc-text font-sans tracking-tight mb-3 leading-tight">
            Help Your Teen Learn{" "}
            <span className="bg-gradient-to-r from-vc-cyan via-vc-purple to-vc-orange bg-clip-text text-transparent">
              to Code with AI
            </span>
          </h1>
          <p className="text-base text-vc-text-dim mb-8 leading-relaxed max-w-md mx-auto">
            A 4-week guided bootcamp that takes your teen from zero to building AI-powered apps.
            30 minutes a day. No experience needed.
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-8 py-4 rounded-xl text-base font-bold font-sans no-underline text-black transition-transform hover:scale-105"
            style={{ background: "linear-gradient(135deg, #00f0ff, #a855f7)" }}
          >
            Start Free →
          </Link>
          <p className="text-xs text-vc-text-ghost mt-4">No credit card required · Progress saves automatically</p>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-12 sm:gap-16 px-6 pb-12">
          {[
            ["28", "Days", "Structured daily lessons"],
            ["30", "Min/Day", "Short, focused sessions"],
            ["140+", "Tasks", "Hands-on activities"],
          ].map(([num, label, desc]) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-bold text-vc-cyan">{num}</div>
              <div className="text-[10px] text-vc-text-faint uppercase tracking-widest mt-1">{label}</div>
              <div className="text-[10px] text-vc-text-ghost mt-1 hidden sm:block">{desc}</div>
            </div>
          ))}
        </div>

        {/* What they'll learn */}
        <div className="max-w-2xl mx-auto px-6 pb-16">
          <h2 className="text-xl font-bold text-vc-text font-sans text-center mb-8">
            The 4-Week Journey
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: "🧱", title: "Week 1: The Foundation", desc: "Meet AI coding tools, write first HTML/CSS/JavaScript, build a real project", color: "#00f0ff" },
              { icon: "🚀", title: "Week 2: Level Up", desc: "VS Code, GitHub, APIs, React — the tools and frameworks real developers use", color: "#a855f7" },
              { icon: "🧠", title: "Week 3: AI Power Mode", desc: "AI APIs, image generation, automation — give apps a brain", color: "#f97316" },
              { icon: "🏆", title: "Week 4: Build & Ship", desc: "Full-stack projects, deployment, portfolio — launch real apps to the world", color: "#10b981" },
            ].map((week) => (
              <div
                key={week.title}
                className="bg-vc-card rounded-xl p-5"
                style={{ borderLeft: `3px solid ${week.color}` }}
              >
                <span className="text-2xl">{week.icon}</span>
                <h3 className="text-sm font-bold text-vc-text font-sans mt-2 mb-1">{week.title}</h3>
                <p className="text-xs text-vc-text-dim leading-relaxed m-0">{week.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* For parents section */}
        <div className="bg-vc-card border-y border-vc-border py-12 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl font-bold text-vc-text font-sans mb-4">Built for Parents & Teens</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
              {[
                { icon: "🔒", title: "Safe & Private", desc: "No ads, no tracking. We only store a name, email, and progress data." },
                { icon: "🧭", title: "Self-Paced", desc: "Your teen works at their own speed. Pick up anytime, from any device." },
                { icon: "🤖", title: "AI-First", desc: "Learn the way the future works — with AI as a creative coding partner." },
              ].map((item) => (
                <div key={item.title} className="text-center sm:text-left">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <h3 className="text-sm font-bold text-vc-text font-sans mb-1">{item.title}</h3>
                  <p className="text-xs text-vc-text-dim leading-relaxed m-0">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="py-16 px-6 text-center">
          <h2 className="text-2xl font-bold text-vc-text font-sans mb-3">Ready to start?</h2>
          <p className="text-sm text-vc-text-dim mb-6">
            Give your teen the most valuable skill of the future.
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-8 py-4 rounded-xl text-base font-bold font-sans no-underline text-black transition-transform hover:scale-105"
            style={{ background: "linear-gradient(135deg, #00f0ff, #a855f7)" }}
          >
            Start the Bootcamp →
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
