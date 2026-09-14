"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, CalendarCheck, Check, MoreVertical, Send, User } from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import type { TelegramMessage } from "@/types";
import { cn, formatTime } from "@/lib/utils";

interface PreviewData {
  patientName: string;
  serviceName: string;
  date: string;
  time: string;
}

interface TelegramChatProps {
  messages: TelegramMessage[];
  onSend: (text: string) => void;
  onAction: (value: "confirm" | "cancel") => void;
  pending: boolean;
  suggestions?: string[];
}

function formatClock(iso: string) {
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date(iso));
}

export function TelegramChat({ messages, onSend, onAction, pending, suggestions = [] }: TelegramChatProps) {
  const [value, setValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    onSend(value.trim());
    setValue("");
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-3xl border border-[var(--border)] shadow-lg">
      <div className="flex items-center gap-3 bg-[#2aabee] px-4 py-3 text-white">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
          <Bot className="h-4.5 w-4.5" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium leading-tight">Khoury Clinic Assistant</p>
          <p className="text-[11px] text-white/75">bot · always online</p>
        </div>
        <MoreVertical className="h-4 w-4 text-white/80" />
      </div>

      <div
        ref={scrollRef}
        className="flex-1 space-y-3 overflow-y-auto p-4 scrollbar-thin"
        style={{ minHeight: 340, maxHeight: 480, backgroundColor: "#e7ebf0" }}
      >
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25 }}
              className={cn("flex flex-col", m.from === "doctor" ? "items-end" : "items-start")}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-sm",
                  m.from === "doctor" ? "rounded-br-sm bg-[#effdde]" : "rounded-bl-sm bg-white"
                )}
              >
                <p className="whitespace-pre-line text-[13.5px] leading-relaxed text-[#1c2b33]">{m.text}</p>

                {m.richPayload?.type === "appointment-preview" && (
                  <AppointmentPreviewCard data={m.richPayload.data as PreviewData} />
                )}
                {m.richPayload?.type === "success" && <SuccessCard data={m.richPayload.data as PreviewData} />}

                <div className="mt-1 flex items-center justify-end gap-1">
                  <span className="text-[10px] text-[#8b98a0]">{formatClock(m.timestamp)}</span>
                  {m.from === "doctor" && <Check className="h-3.5 w-3.5 text-[#4fae4e]" />}
                </div>
              </div>

              {m.actions && m.actions.length > 0 && pending && (
                <div className="mt-1.5 flex gap-1.5">
                  {m.actions.map((a) => (
                    <button
                      key={a.value}
                      onClick={() => onAction(a.value as "confirm" | "cancel")}
                      className={cn(
                        "rounded-full px-4 py-1.5 text-[12px] font-medium shadow-sm transition-colors",
                        a.value === "confirm"
                          ? "bg-[#2aabee] text-white hover:bg-[#1f95d4]"
                          : "border border-[var(--border)] bg-white text-[#1c2b33] hover:bg-[var(--muted)]"
                      )}
                    >
                      {a.label}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {suggestions.length > 0 && (
        <div className="flex gap-1.5 overflow-x-auto border-t border-black/5 bg-white px-3 py-2 scrollbar-thin">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => onSend(s)}
              className="shrink-0 rounded-full border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--navy)] hover:bg-[var(--muted)]"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-black/5 bg-white px-3 py-2.5">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Message Khoury Clinic Assistant…"
          className="flex-1 rounded-full bg-[var(--muted)] px-4 py-2 text-sm outline-none placeholder:text-[var(--muted-foreground)]"
        />
        <button
          type="submit"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2aabee] text-white disabled:opacity-40"
          disabled={!value.trim()}
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

function AppointmentPreviewCard({ data }: { data: PreviewData }) {
  return (
    <div className="mt-2 rounded-xl border border-[var(--border)] bg-[var(--muted)]/60 p-3">
      <div className="flex items-center gap-2 text-xs font-medium text-[var(--navy)]">
        <User className="h-3.5 w-3.5" /> {data.patientName}
      </div>
      <p className="mt-1 text-xs text-[var(--muted-foreground)]">{data.serviceName}</p>
    </div>
  );
}

function SuccessCard({ data }: { data: PreviewData }) {
  return (
    <div className="mt-2 flex items-start gap-2 rounded-xl border border-[var(--success)]/30 bg-[#eaf5ee] p-3">
      <CalendarCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--success)]" />
      <div className="text-xs leading-relaxed text-[var(--foreground)]">
        <p className="font-medium">{data.patientName}</p>
        <p className="text-[var(--muted-foreground)]">
          {formatTime(data.time)} · {data.serviceName}
        </p>
      </div>
    </div>
  );
}
