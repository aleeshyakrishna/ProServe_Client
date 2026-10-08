"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Sparkles,
  X,
  Send,
  Loader2,
  Bot,
  User,
  Star,
  ExternalLink,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { aiService } from "@/services/ai.service";
import { ChatMessage } from "@/types/ai";

const QUICK_PROMPTS = [
  "Deep home cleaning under 300 AED",
  "AC technician for emergency repair",
  "Top rated electrician",
  "Plumbing inspection",
];

function getFormattedTime(): string {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const INITIAL_MESSAGE: ChatMessage = {
  id: "welcome",
  sender: "assistant",
  text: "Hello! I'm your ProServe AI Concierge. Tell me what service you need (e.g., 'AC maintenance under 250 AED') and I'll find the best options for you!",
  timestamp: "",
};

export const AIChatAssistant: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Mount check for React Portal
  useEffect(() => {
    setMounted(true);
    setMessages([
      {
        ...INITIAL_MESSAGE,
        timestamp: getFormattedTime(),
      },
    ]);
  }, []);

  // Auto-scroll to bottom of chat list
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, loading]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMessage;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend,
      timestamp: getFormattedTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputMessage("");
    setLoading(true);

    try {
      const data = await aiService.sendMessage(textToSend);

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "assistant",
        text: data?.reply || "Here are the top matches I found for you:",
        services: data?.services || [],
        timestamp: getFormattedTime(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      const errorText =
        err instanceof Error
          ? err.message
          : "Failed to connect to AI assistant. Please try again.";
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "assistant",
          text: `Sorry, I encountered an issue: ${errorText}`,
          timestamp: getFormattedTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        ...INITIAL_MESSAGE,
        timestamp: getFormattedTime(),
      },
    ]);
  };

  if (!mounted) return null;

  const content = (
    <div
      style={{
        position: "fixed",
        bottom: "1.75rem",
        right: "1.75rem",
        zIndex: 999999,
      }}
      className="flex flex-col items-end pointer-events-auto font-sans"
    >
      <AnimatePresence>
        {/* Floating Toggle Button */}
        {!isOpen && (
          <motion.button
            key="toggle-btn"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            style={{
              backgroundColor: "#064e3b",
              color: "#ffffff",
              boxShadow: "0 10px 25px -5px rgba(6, 78, 59, 0.45)",
              border: "1px solid #047857",
            }}
            className="group flex items-center gap-2.5 font-medium px-4 py-3 rounded-full transition-all duration-300 cursor-pointer"
            aria-label="Open AI Assistant"
          >
            <div className="relative flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-300 animate-pulse" />
            </div>
            <span
              style={{ color: "#ffffff" }}
              className="text-sm font-semibold tracking-wide text-white"
            >
              Ask ProServe AI
            </span>
          </motion.button>
        )}

        {/* Chat Window Modal */}
        {isOpen && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{
              height: "min(520px, calc(100vh - 6rem))",
              maxHeight: "calc(100vh - 6rem)",
            }}
            className="w-[calc(100vw-3rem)] sm:w-[350px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden"
          >
            {/* Header (Fixed height 56px, shrink-0, ALWAYS visible at top) */}
            <div className="h-14 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 px-4 flex items-center justify-between text-white shrink-0 select-none border-b border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white leading-tight">
                    ProServe AI Assistant
                  </h3>
                  <p className="text-[11px] text-emerald-300/80 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                    Instant service matching
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleResetChat}
                  title="Reset conversation"
                  className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Reset Chat"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Close Chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Container (ONLY THIS SECTION SCROLLS! flex-1 min-h-0 overflow-y-auto) */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 bg-slate-50/70">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${
                    msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5 ${
                      msg.sender === "user"
                        ? "bg-slate-800 text-white"
                        : "bg-emerald-600 text-white"
                    }`}
                  >
                    {msg.sender === "user" ? (
                      <User className="w-3.5 h-3.5" />
                    ) : (
                      <Bot className="w-3.5 h-3.5" />
                    )}
                  </div>

                  {/* Content Bubble */}
                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm shadow-sm ${
                      msg.sender === "user"
                        ? "bg-emerald-600 text-white rounded-tr-none"
                        : "bg-white text-slate-800 border border-slate-200/70 rounded-tl-none"
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>

                    {/* Service Recommendations Cards */}
                    {msg.services && msg.services.length > 0 && (
                      <div className="mt-3 space-y-2 pt-2.5 border-t border-slate-100">
                        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                          Found Matching Services:
                        </p>
                        {msg.services.map((srv) => {
                          const ratingNum = Number(srv.rating || 0);
                          const ratingDisplay =
                            ratingNum > 0 ? ratingNum.toFixed(1) : "New";

                          return (
                            <div
                              key={srv.id}
                              className="bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 rounded-xl p-2.5 transition-colors group"
                            >
                              <div className="flex justify-between items-start gap-2">
                                <h4 className="text-xs font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                                  {srv.title}
                                </h4>
                                <span className="text-xs font-bold text-emerald-600 shrink-0">
                                  {srv.currency || "AED"} {srv.priceFrom}
                                  {srv.priceTo ? ` - ${srv.priceTo}` : ""}
                                </span>
                              </div>

                              {srv.description && (
                                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                                  {srv.description}
                                </p>
                              )}

                              <div className="mt-2 flex items-center justify-between text-[11px]">
                                <div className="flex items-center gap-1 text-amber-600 font-medium">
                                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                  <span>{ratingDisplay}</span>
                                  <span className="text-slate-400">
                                    ({srv.reviewCount || 0})
                                  </span>
                                </div>

                                <Link
                                  href={`/services/${srv.id}`}
                                  onClick={() => setIsOpen(false)}
                                  className="inline-flex items-center gap-1 text-emerald-600 font-semibold hover:text-emerald-700"
                                >
                                  <span>View Service</span>
                                  <ExternalLink className="w-3 h-3" />
                                </Link>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {msg.timestamp && (
                      <span
                        className={`block text-[10px] mt-1 text-right ${
                          msg.sender === "user" ? "text-emerald-200" : "text-slate-400"
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {/* Loading Indicator */}
              {loading && (
                <div className="flex gap-2.5 items-center">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-slate-500 flex items-center gap-2 shadow-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                    <span>Searching matching services...</span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompt Suggestions (Fixed height, shrink-0) */}
            {messages.length < 3 && (
              <div className="px-3 py-2 bg-slate-100/80 border-t border-slate-200/60 overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    disabled={loading}
                    className="whitespace-nowrap bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 rounded-full px-2.5 py-1 text-[11px] transition-colors shrink-0 flex items-center gap-1 disabled:opacity-50"
                  >
                    <span>{prompt}</span>
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                  </button>
                ))}
              </div>
            )}

            {/* Input Form (Fixed height at bottom, shrink-0, ALWAYS visible) */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask e.g. Deep clean under 300 AED..."
                disabled={loading}
                className="flex-1 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 outline-none focus:border-emerald-500 focus:bg-white transition-colors"
              />
              <button
                type="submit"
                disabled={loading || !inputMessage.trim()}
                className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl transition-colors shrink-0 flex items-center justify-center"
                aria-label="Send message"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return createPortal(content, document.body);
};
