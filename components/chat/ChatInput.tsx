"use client";

import { useState, useRef, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const handleSendMessage = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
      
      // Focus the input after sending
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  return (
    <div className="border-t bg-background p-3">
      <div className="flex items-end gap-2 relative">
        <textarea
          ref={inputRef}
          className={cn(
            "flex-1 resize-none rounded-md border border-input bg-background p-3 pr-10",
            "text-sm focus:outline-none focus:ring-2 focus:ring-primary/30",
            "min-h-[80px] max-h-[200px]",
            "placeholder:text-muted-foreground"
          )}
          placeholder="Type your message here..."
          rows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <button
          className={cn(
            "absolute right-3 bottom-3 p-2 rounded-full",
            "transition-all duration-200 ease-in-out",
            message.trim() && !isLoading
              ? "bg-primary text-primary-foreground opacity-100"
              : "bg-muted text-muted-foreground opacity-70 cursor-not-allowed",
            "hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
          )}
          onClick={handleSendMessage}
          disabled={!message.trim() || isLoading}
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Press Enter to send, Shift+Enter for a new line
      </p>
    </div>
  );
}