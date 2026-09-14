"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, CheckCheck, Phone, Video, MoreVertical } from "lucide-react";
import { useEffect, useRef } from "react";
import type { WhatsAppMessage } from "@/types";
import { cn } from "@/lib/utils";
import { clinic } from "@/lib/data/seed";

interface WhatsAppThreadProps {
  messages: WhatsAppMessage[];
  onAction?: (action: string, messageId: string) => void;
  className?: string;
}

function formatClock(iso: string) {
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date(iso));
}

const ACTION_LABELS: Record<string, string> = {
  reschedule: "Reschedule",
  cancel: "Cancel",
  calendar: "Add to Calendar",
};

export function WhatsAppThread({ messages, onAction, className }: WhatsAppThreadProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  return (
    <div className={cn("flex flex-col overflow-hidden rounded-3xl border border-[var(--border)] shadow-lg", className)}>
      <div className="flex items-center gap-3 bg-[#075e54] px-4 py-3 text-white">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-sm font-medium">
          NK
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium leading-tight">{clinic.name}</p>
          <p className="text-[11px] text-white/70">online</p>
        </div>
        <Video className="h-4 w-4 shrink-0 text-white/80" />
        <Phone className="h-4 w-4 shrink-0 text-white/80" />
        <MoreVertical className="h-4 w-4 shrink-0 text-white/80" />
      </div>

      <div
        ref={scrollRef}
        className="flex-1 space-y-3 overflow-y-auto p-4 scrollbar-thin"
        style={{
          minHeight: 320,
          maxHeight: 460,
          backgroundColor: "#e5ddd0",
          backgroundImage:
            "radial-gradient(circle at 8px 8px, rgba(0,0,0,0.035) 1.5px, transparent 0)",
          backgroundSize: "26px 26px",
        }}
      >
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-start"
            >
              <div className="max-w-[85%] rounded-lg rounded-tl-sm bg-white px-3 py-2 shadow-sm">
                <p className="whitespace-pre-line text-[13.5px] leading-relaxed text-[#111b21]">{m.text}</p>
                <div className="mt-1 flex items-center justify-end gap-1">
                  <span className="text-[10px] text-[#8696a0]">{formatClock(m.timestamp)}</span>
                  <CheckCheck className="h-3.5 w-3.5 text-[#53bdeb]" />
                </div>
              </div>
              {m.actions && m.actions.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {m.actions.map((a) => (
                    <button
                      key={a}
                      onClick={() => onAction?.(a, m.id)}
                      className="rounded-full border border-[#075e54]/25 bg-white px-3 py-1.5 text-[12px] font-medium text-[#075e54] shadow-sm transition-colors hover:bg-[#075e54]/5"
                    >
                      {ACTION_LABELS[a] ?? a}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <p className="text-xs text-[#6b756c]">No messages yet.</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 border-t border-black/5 bg-[#f0f0f0] px-3 py-2.5">
        <div className="flex-1 rounded-full bg-white px-4 py-2 text-xs text-[#8696a0]">Message</div>
        <Check className="h-4 w-4 text-[#8696a0]" />
      </div>
    </div>
  );
}
