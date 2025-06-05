"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { Message } from "@/types/chat";
// import { v4 as uuidv4 } from 'uuid';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatModal({ isOpen, onClose }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newMessageIds, setNewMessageIds] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch("/api/chat");
        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages || []);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Mark new messages as "seen" after 2 seconds
  useEffect(() => {
    if (newMessageIds.size > 0) {
      const timer = setTimeout(() => {
        setNewMessageIds(new Set());
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [newMessageIds]);

  const handleDeleteChat = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();

        const { userMessage, aiMessage } = data;

        setMessages([userMessage, aiMessage]);

        setNewMessageIds(new Set([userMessage.id, aiMessage.id]));
      } else {
        console.error("Error deleting chat:", await response.text());
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const tempUserMessage: Message = {
      id: "id-" + Math.random().toString(36).substring(2, 11),
      content,
      sender: "user",
      timestamp: new Date(),
    };

    setNewMessageIds((prev) => new Set(prev).add(tempUserMessage.id));
    setMessages((prev) => [...prev, tempUserMessage]);

    setIsLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });

      if (response.ok) {
        const data = await response.json();

        setMessages((prev) => {
          const filtered = prev.filter((m) => m.id !== tempUserMessage.id);
          return [...filtered, data.userMessage, data.aiMessage];
        });

        setNewMessageIds((prev) => {
          const updated = new Set(prev);
          updated.delete(tempUserMessage.id);
          updated.add(data.userMessage.id);
          updated.add(data.aiMessage.id);
          return updated;
        });
      } else {
        console.error("Error sending message:", await response.text());
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-end sm:items-center justify-center",
        "transition-opacity duration-300 ease-in-out",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={cn(
          "relative bg-background rounded-t-xl sm:rounded-xl shadow-lg",
          "w-full sm:w-[600px] max-w-full max-h-[70vh] sm:max-h-[600px]",
          "flex flex-col overflow-hidden",
          "transition-all duration-300 ease-in-out",
          isOpen ? "translate-y-0 sm:scale-100" : "translate-y-full sm:scale-95"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Chat Assistant</h2>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Close chat"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <p className="text-muted-foreground mb-2">No messages yet</p>
              <p className="text-sm text-muted-foreground">
                Start a conversation by sending a message below.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message?.id}
                message={message}
                isNew={newMessageIds.has(message?.id)}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />

        <button
          onClick={handleDeleteChat}
          className="p-2 rounded-sm bg-purple-600 text-white hover:bg-blue-950 transition-colors"
          aria-label="Close chat"
        >
          Delete Chat History
        </button>
      </div>
    </div>
  );
}
