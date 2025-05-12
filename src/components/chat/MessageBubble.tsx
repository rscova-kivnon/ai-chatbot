import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface MessageBubbleProps {
  message: string;
  isAi: boolean;
  timestamp?: string;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
}

const MessageBubble = ({
  message = "",
  isAi = false,
  timestamp = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),
  suggestions = [],
  onSuggestionClick = () => {},
}: MessageBubbleProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(isAi);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Typing animation effect for AI messages
  useEffect(() => {
    if (isAi) {
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < message.length) {
          setDisplayedText(message.substring(0, i + 1));
          i++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          setShowSuggestions(true);
        }
      }, 15); // Speed of typing

      return () => clearInterval(typingInterval);
    } else {
      setDisplayedText(message);
    }
  }, [message, isAi]);

  return (
    <motion.div
      className={`flex w-full mb-4 ${isAi ? "justify-start" : "justify-end"}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`relative max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 ${
          isAi
            ? "bg-gray-100 text-gray-800"
            : "bg-primary text-primary-foreground"
        }`}
      >
        <div className="text-sm">
          {isAi ? displayedText : message}
          {isTyping && (
            <span className="inline-block ml-1 animate-pulse">▋</span>
          )}
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="mt-2">
            {/* We'll render suggestion chips here once the SuggestionChips component is available */}
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => onSuggestionClick(suggestion)}
                  className="text-xs px-3 py-1 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="text-[10px] opacity-70 mt-1 text-right">
          {timestamp}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
export type { MessageBubbleProps };
