"use client";

import { useState, useEffect } from "react";
import { useProgress } from "@/hooks/useProgress";
import { useAuth } from "@/hooks/useAuth";
import { useSignupPrompt } from "@/hooks/useSignupPrompt";
import { CURRICULUM } from "@/data/curriculum";
import WelcomeScreen from "@/components/welcome/WelcomeScreen";
import Header from "@/components/dashboard/Header";
import WeekTabs from "@/components/dashboard/WeekTabs";
import WeekHeader from "@/components/dashboard/WeekHeader";
import DayAccordion from "@/components/dashboard/DayAccordion";
import SignUpPrompt from "@/components/auth/SignUpPrompt";
import AuthModal from "@/components/auth/AuthModal";
import Footer from "@/components/layout/Footer";

export default function DashboardPage() {
  const { user } = useAuth();
  const { done, toggle, prog, totalProgress, completedCount } = useProgress();
  const { showPrompt, dismiss } = useSignupPrompt(completedCount, !!user);

  const [week, setWeek] = useState(0);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [expandedTask, setExpandedTask] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [showAuth, setShowAuth] = useState<"signup" | "login" | null>(null);

  // Load name from localStorage on mount
  useEffect(() => {
    try {
      const n = localStorage.getItem("cb-name");
      if (n) {
        setName(n);
        setShowWelcome(false);
      }
    } catch {}
  }, []);

  const handleStart = (n: string) => {
    setName(n);
    try { localStorage.setItem("cb-name", n); } catch {}
    setShowWelcome(false);
  };

  if (showWelcome && !name) {
    return <WelcomeScreen onStart={handleStart} />;
  }

  const wk = CURRICULUM[week];

  return (
    <div className="min-h-screen bg-vc-bg text-vc-text-secondary font-mono flex flex-col">
      <div className="flex-1">
        <Header
          name={name}
          totalProgress={totalProgress}
          isAuthenticated={!!user}
          onLoginClick={() => setShowAuth("login")}
        />

        <WeekTabs
          weeks={CURRICULUM}
          activeWeek={week}
          weekProgress={(i) => prog(i)}
          onSelectWeek={(i) => { setWeek(i); setExpandedDay(null); setExpandedTask(null); }}
        />

        <WeekHeader week={wk} weekIndex={week} />

        <div className="px-5 pt-2 pb-5 flex flex-col gap-1.5">
          {wk.days.map((dy, di) => (
            <DayAccordion
              key={di}
              day={dy}
              dayIndex={di}
              weekIndex={week}
              weekColor={wk.color}
              done={done}
              toggle={toggle}
              dayProgress={prog(week, di)}
              isExpanded={expandedDay === di}
              onToggleExpand={() => {
                setExpandedDay(expandedDay === di ? null : di);
                setExpandedTask(null);
              }}
              expandedTask={expandedDay === di ? expandedTask : null}
              onToggleTask={(ti) => setExpandedTask(expandedTask === ti ? null : ti)}
            />
          ))}
        </div>
      </div>

      <Footer name={name} />

      {showPrompt && (
        <SignUpPrompt
          name={name}
          onSignUp={() => { dismiss(); setShowAuth("signup"); }}
          onDismiss={dismiss}
        />
      )}

      {showAuth && (
        <AuthModal
          mode={showAuth}
          name={name}
          existingProgress={done}
          onClose={() => setShowAuth(null)}
          onSuccess={() => setShowAuth(null)}
        />
      )}
    </div>
  );
}
