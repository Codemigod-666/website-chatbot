// "use client";

// import { useState, useEffect } from "react";
// import { MessageCircle } from "lucide-react";
// import { cn } from "@/lib/utils";

// interface FloatingActionButtonProps {
//   onClick: () => void;
//   isOpen: boolean;
// }

// export default function FloatingActionButton({
//   onClick,
//   isOpen,
// }: FloatingActionButtonProps) {
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     // Slight delay for entrance animation
//     const timer = setTimeout(() => {
//       setIsVisible(true);
//     }, 500);

//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <button
//       aria-label="Open chat"
//       onClick={onClick}
//       className={cn(
//         "p-4 rounded-full bg-primary text-primary-foreground shadow-lg",
//         "transition-all duration-300 ease-in-out transform",
//         "hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2",
//         "flex items-center justify-center z-50",
//         isVisible ? "scale-100 opacity-100" : "scale-90 opacity-0",
//         isOpen && "rotate-45"
//       )}
//     >
//       <MessageCircle size={24} />
//     </button>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export default function FloatingActionButton({
  onClick,
  isOpen,
}: FloatingActionButtonProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <button
      aria-label="Open chat"
      onClick={onClick}
      className={cn(
        "p-4 rounded-full bg-primary text-primary-foreground shadow-lg",
        "transition-all duration-30000 ease-in-out transform",
        "hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2",
        "flex items-center justify-center z-50",
        "animate-bounce", // ✅ Optional: bounce effect
        isOpen && "rotate-45"
      )}
    >
      <MessageCircle size={24} />
    </button>
  );
}
