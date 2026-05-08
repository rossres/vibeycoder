"use client";

import { useState, useRef, useEffect } from "react";
import type { ChatMessage as ChatMessageType } from "@/hooks/useChatSession";
import ChatMessage from "./ChatMessage";

interface ChatPanelProps {
  taskText: string;
  messages: ChatMessageType[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
  onClose: () => void;
}

export default function ChatPanel({
  taskText,
  messages,
  isLoading,
  onSendMessage,
  onClose,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSendMessage(trimmed);
    setInput("");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 animate-slide-up md:left-1/2 md:-translate-x-1/2 md:max-w-3xl md:w-full lg:max-w-4xl">
      <div
        className="bg-vc-card border-t border-vc-border flex flex-col"
        style={{ maxHeight: "70vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-vc-border shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-2 h-2 rounded-full bg-vc-cyan shrink-0" />
            <span className="text-xs font-bold text-vc-text truncate">
              {taskText}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-vc-text-ghost hover:text-vc-text text-sm bg-transparent border-none cursor-pointer font-mono shrink-0 ml-2"
          >
            x
          </button>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2.5"
          style={{ minHeight: "120px" }}
        >
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="px-4 py-3 border-t border-vc-border flex gap-2 shrink-0"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a follow-up..."
            disabled={isLoading}
            className="flex-1 bg-vc-surface-alt border border-vc-input-border rounded-lg px-3 py-2 text-xs text-vc-text font-mono outline-none placeholder:text-vc-text-ghost focus:border-vc-cyan/50 transition-colors disabled:opacity-50 md:text-sm md:py-2.5"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-3 py-2 rounded-lg text-xs font-bold font-sans border-none cursor-pointer text-black disabled:opacity-30 transition-opacity"
            style={{ background: "linear-gradient(135deg, #00f0ff, #a855f7)" }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
