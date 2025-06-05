"use client";

import { useState } from "react";
import FloatingActionButton from "./FloatingActionButton";
import ChatModal from "./ChatModal";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      <div className="flex justify-end z-50">
        <FloatingActionButton onClick={toggleChat} isOpen={isOpen} />
        <ChatModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </>
  );
}
