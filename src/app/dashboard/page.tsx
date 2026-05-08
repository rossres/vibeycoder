"use client";

import { useState, useEffect } from "react";
import { useProgress } from "@/hooks/useProgress";
import { useAuth } from "@/hooks/useAuth";
import { useSignupPrompt } from "@/hooks/useSignupPrompt";
import { useShips } from "@/hooks/useShips";
import { useChatSession } from "@/hooks/useChatSession";
import { CURRICULUM } from "@/data/curriculum";
import { track } from "@/lib/analytics";
import {
  buildChatSystemPrompt,
  buildAskClaudeUserMessage,
  buildStuckUserMessage,
} from "@/lib/claude";
import WelcomeScreen from "@/components/welcome/WelcomeScreen";
import Header from "@/components/dashboard/Header";
import WeekTabs from "@/components/dashboard/WeekTabs";
import WeekHeader from "@/components/dashboard/WeekHeader";
import DayAccordion from "@/components/dashboard/DayAccordion";
import ShipIt from "@/components/dashboard/ShipIt";
import StuckModal from "@/components/dashboard/StuckModal";
import ChatPanel from "@/components/dashboard/ChatPanel";
import SignUpPrompt from "@/components/auth/SignUpPrompt";
import AuthModal from "@/components/auth/AuthModal";
import Footer from "@/components/layout/Footer";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import { useWeekNotification } from "@/hooks/useWeekNotification";

export default function DashboardPage() {
  const { user } = useAuth();
  const { done, toggle, prog, totalProgress, completedCount } = useProgress();
  const { showPrompt, dismiss } = useSignupPrompt(completedCount, !!user);
  const { ships, submitShip, shippedCount } = useShips();
  const { messages, isLoading, sendMessage, reset: resetChat } = useChatSession();

  const [week, setWeek] = useState(0);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [expandedTask, setExpandedTask] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(false);

  useWeekNotification(done, name, user);
  const [showAuth, setShowAuth] = useState<"signup" | "login" | null>(null);
  const [stuckInfo, setStuckInfo] = useState<{ weekIdx: number; dayIdx: number; taskIdx: number } | null>(null);
  const [chatTask, setChatTask] = useState<{ weekIdx: number; dayIdx: number; taskIdx: number } | null>(null);

  // Load name from localStorage on mount; auto-expand Day 1 on first visit
  useEffect(() => {
    try {
      const n = localStorage.getItem("cb-name");
      if (n) {
        setName(n);
        setShowWelcome(false);
        const hasSeenWelcome = localStorage.getItem("vc_firstWelcomeSeen");
        if (!hasSeenWelcome) {
          setShowWelcomeBanner(true);
          setExpandedDay(0);
        }
      }
    } catch {}
  }, []);

  const handleStart = (n: string) => {
    setName(n);
    try { localStorage.setItem("cb-name", n); } catch {}
    track("name_set");
    setShowWelcome(false);
    setShowWelcomeBanner(true);
    setExpandedDay(0);
    track("lab_entered");
  };

  const handleDismissWelcomeBanner = () => {
    try { localStorage.setItem("vc_firstWelcomeSeen", "true"); } catch {}
    setShowWelcomeBanner(false);
  };

  // --- Chat handlers ---

  const handleOpenAskClaude = (weekIdx: number, dayIdx: number, taskIdx: number) => {
    const wkData = CURRICULUM[weekIdx];
    const dayData = wkData.days[dayIdx];
    const taskData = dayData.tasks[taskIdx];

    resetChat();
    setChatTask({ weekIdx, dayIdx, taskIdx });

    const systemPrompt = buildChatSystemPrompt();
    const userMessage = buildAskClaudeUserMessage(wkData.title, dayData.title, taskData.text, taskData.how);
    sendMessage(userMessage, systemPrompt);
    track("chat_opened", { week: weekIdx + 1, day: dayIdx + 1, task: taskIdx });
  };

  const handleOpenStuckChat = (
    weekIdx: number,
    dayIdx: number,
    taskIdx: number,
    whatHappened: string,
    whatExpected: string,
    errorText: string,
  ) => {
    const wkData = CURRICULUM[weekIdx];
    const dayData = wkData.days[dayIdx];
    const taskData = dayData.tasks[taskIdx];

    resetChat();
    setChatTask({ weekIdx, dayIdx, taskIdx });
    setStuckInfo(null);

    const systemPrompt = buildChatSystemPrompt();
    const userMessage = buildStuckUserMessage(wkData.title, dayData.title, taskData.text, whatHappened, whatExpected, errorText);
    sendMessage(userMessage, systemPrompt);
    track("chat_opened", { week: weekIdx + 1, day: dayIdx + 1, task: taskIdx });
  };

  const handleCloseChat = () => {
    resetChat();
    setChatTask(null);
    track("chat_closed");
  };

  const handleChatMessage = (content: string) => {
    sendMessage(content);
    track("chat_message_sent");
  };

  if (showWelcome && !name) {
    return <WelcomeScreen onStart={handleStart} />;
  }

  const wk = CURRICULUM[week];
  const isLastDay = (dayIndex: number) => dayIndex === wk.days.length - 1;

  return (
    <div className="min-h-screen bg-vc-bg text-vc-text-secondary font-mono flex flex-col">
      <div className="flex-1">
        <div className="md:max-w-3xl md:mx-auto md:w-full lg:max-w-4xl">
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

        {showWelcomeBanner && (
          <WelcomeBanner onDismiss={handleDismissWelcomeBanner} />
        )}

        <div className="px-5 pt-2 pb-5 flex flex-col gap-1.5 md:px-8">
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
                const key = `${wi}-${dii}-${ti}`;
                const wasDone = !!done[key];
                toggle(wi, dii, ti);
                track("task_done_toggled", { week: wi + 1, day: dii + 1, task: ti });
                // Auto-advance: if marking complete, collapse and open next task
                if (!wasDone) {
                  const dayTasks = CURRICULUM[wi].days[dii].tasks;
                  if (ti + 1 < dayTasks.length) {
                    setExpandedTask(ti + 1);
                  } else {
                    setExpandedTask(null);
                  }
                }
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
              onAskClaude={(ti) => handleOpenAskClaude(week, di, ti)}
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
          onAskClaude={(whatHappened, whatExpected, errorText) =>
            handleOpenStuckChat(stuckInfo.weekIdx, stuckInfo.dayIdx, stuckInfo.taskIdx, whatHappened, whatExpected, errorText)
          }
        />
      )}

      {chatTask && (
        <ChatPanel
          taskText={CURRICULUM[chatTask.weekIdx].days[chatTask.dayIdx].tasks[chatTask.taskIdx].text}
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleChatMessage}
          onClose={handleCloseChat}
        />
      )}
    </div>
  );
}
