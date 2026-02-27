"use client";

import { useState, useEffect } from "react";
import { useProgress } from "@/hooks/useProgress";
import { useAuth } from "@/hooks/useAuth";
import { useSignupPrompt } from "@/hooks/useSignupPrompt";
import { useShips } from "@/hooks/useShips";
import { CURRICULUM } from "@/data/curriculum";
import { track } from "@/lib/analytics";
import IntroFlow from "@/components/intro/IntroFlow";
import WelcomeScreen from "@/components/welcome/WelcomeScreen";
import Header from "@/components/dashboard/Header";
import WeekTabs from "@/components/dashboard/WeekTabs";
import WeekHeader from "@/components/dashboard/WeekHeader";
import DayAccordion from "@/components/dashboard/DayAccordion";
import ShipIt from "@/components/dashboard/ShipIt";
import StuckModal from "@/components/dashboard/StuckModal";
import SignUpPrompt from "@/components/auth/SignUpPrompt";
import AuthModal from "@/components/auth/AuthModal";
import Footer from "@/components/layout/Footer";

export default function DashboardPage() {
  const { user } = useAuth();
  const { done, toggle, prog, totalProgress, completedCount } = useProgress();
  const { showPrompt, dismiss } = useSignupPrompt(completedCount, !!user);
  const { ships, submitShip, shippedCount } = useShips();

  const [week, setWeek] = useState(0);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [expandedTask, setExpandedTask] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [showIntro, setShowIntro] = useState(false);
  const [showAuth, setShowAuth] = useState<"signup" | "login" | null>(null);
  const [stuckInfo, setStuckInfo] = useState<{ weekIdx: number; dayIdx: number; taskIdx: number } | null>(null);

  // Load name and intro state from localStorage on mount
  useEffect(() => {
    try {
      const n = localStorage.getItem("cb-name");
      if (n) {
        setName(n);
        setShowWelcome(false);
        const hasSeenIntro = localStorage.getItem("vc_hasSeenIntro");
        if (!hasSeenIntro) {
          setShowIntro(true);
        }
      }
    } catch {}
  }, []);

  const handleStart = (n: string) => {
    setName(n);
    try { localStorage.setItem("cb-name", n); } catch {}
    track("name_set");
    setShowWelcome(false);
    try {
      const hasSeenIntro = localStorage.getItem("vc_hasSeenIntro");
      if (!hasSeenIntro) {
        setShowIntro(true);
      }
    } catch {}
  };

  const handleIntroComplete = () => {
    try { localStorage.setItem("vc_hasSeenIntro", "true"); } catch {}
    setShowIntro(false);
    track("lab_entered");
  };

  if (showWelcome && !name) {
    return <WelcomeScreen onStart={handleStart} />;
  }

  if (showIntro) {
    return <IntroFlow name={name} onComplete={handleIntroComplete} />;
  }

  const wk = CURRICULUM[week];
  const isLastDay = (dayIndex: number) => dayIndex === wk.days.length - 1;

  return (
    <div className="min-h-screen bg-vc-bg text-vc-text-secondary font-mono flex flex-col">
      <div className="flex-1">
        <Header
          name={name}
          totalProgress={totalProgress}
          shippedCount={shippedCount}
          isAuthenticated={!!user}
          onLoginClick={() => setShowAuth("login")}
        />

        <WeekTabs
          weeks={CURRICULUM}
          activeWeek={week}
          weekProgress={(i) => prog(i)}
          onSelectWeek={(i) => {
            setWeek(i);
            setExpandedDay(null);
            setExpandedTask(null);
            track("week_started", { week: i + 1 });
          }}
        />

        <WeekHeader week={wk} weekIndex={week} />

        <div className="px-5 pt-2 pb-5 flex flex-col gap-1.5">
          {wk.days.map((dy, di) => (
            <DayAccordion
              key={di}
              day={dy}
              dayIndex={di}
              weekIndex={week}
              weekTitle={wk.title}
              weekColor={wk.color}
              done={done}
              toggle={(wi, dii, ti) => {
                toggle(wi, dii, ti);
                track("task_done_toggled", { week: wi + 1, day: dii + 1, task: ti });
              }}
              dayProgress={prog(week, di)}
              isExpanded={expandedDay === di}
              onToggleExpand={() => {
                setExpandedDay(expandedDay === di ? null : di);
                setExpandedTask(null);
                if (expandedDay !== di) track("day_opened", { week: week + 1, day: di + 1 });
              }}
              expandedTask={expandedDay === di ? expandedTask : null}
              onToggleTask={(ti) => setExpandedTask(expandedTask === ti ? null : ti)}
              onStuck={(ti) => setStuckInfo({ weekIdx: week, dayIdx: di, taskIdx: ti })}
            />
          ))}

          {/* Ship It card on the last day of each week when expanded */}
          {expandedDay !== null && isLastDay(expandedDay) && (
            <ShipIt
              weekIndex={week}
              weekTitle={wk.title}
              existingShip={ships[week]}
              onShip={submitShip}
              onContinue={() => {
                if (week < 3) {
                  setWeek(week + 1);
                  setExpandedDay(null);
                  setExpandedTask(null);
                }
              }}
            />
          )}
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

      {stuckInfo && (
        <StuckModal
          weekTitle={CURRICULUM[stuckInfo.weekIdx].title}
          dayTitle={CURRICULUM[stuckInfo.weekIdx].days[stuckInfo.dayIdx].title}
          taskText={CURRICULUM[stuckInfo.weekIdx].days[stuckInfo.dayIdx].tasks[stuckInfo.taskIdx].text}
          weekNum={stuckInfo.weekIdx + 1}
          dayNum={stuckInfo.dayIdx + 1}
          taskIdx={stuckInfo.taskIdx}
          onClose={() => setStuckInfo(null)}
        />
      )}
    </div>
  );
}
