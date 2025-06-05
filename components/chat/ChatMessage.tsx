"use client";

import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Message } from "@/types/chat";

interface ChatMessageProps {
  message: Message;
  isNew?: boolean;
}

export default function ChatMessage({
  message,
  isNew = false,
}: ChatMessageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);

  const isUser = message?.sender === "user";
  const formattedTime = message?.timestamp
    ? format(new Date(message?.timestamp), "h:mm a")
    : format(new Date(), "h:mm a");

  useEffect(() => {
    // Animation entrance effect
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Scroll into view if new message
    if (isNew && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isNew]);

  return (
    <div
      ref={messageRef}
      className={cn(
        "mb-4 transition-all duration-300 ease-out",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        isUser ? "ml-auto" : "mr-auto"
      )}
    >
      <div
        className={cn(
          "max-w-xs sm:max-w-sm md:max-w-md px-4 py-3 rounded-xl shadow-sm",
          isUser
            ? "bg-primary text-primary-foreground ml-auto rounded-br-none"
            : "bg-secondary text-secondary-foreground mr-auto rounded-bl-none"
        )}
      >
        <p className="text-sm sm:text-base">{message?.content}</p>
      </div>
      <div
        className={cn(
          "text-xs text-muted-foreground mt-1",
          isUser ? "text-right" : "text-left"
        )}
      >
        {formattedTime}
      </div>
    </div>
  );
}
