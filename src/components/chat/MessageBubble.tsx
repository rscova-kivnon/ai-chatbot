import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface MessageBubbleProps {
  message: string;
  isAi: boolean;
  timestamp?: string;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
  tokensConsumed?: number;
  maxModelTokens?: number; // New prop
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
  tokensConsumed,
  maxModelTokens, // Destructure new prop
}: MessageBubbleProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Mostrar sugerencias solo cuando el mensaje está completo
  useEffect(() => {
    if (isAi && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  }, [isAi, suggestions.length]);

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
        <div className="text-sm whitespace-pre-wrap">
          {message}
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="mt-2">
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

        <div className="flex justify-between items-center mt-1">
          {isAi && tokensConsumed !== undefined && (
            <div className="text-[10px] opacity-70 text-left">
              Tokens: {tokensConsumed}
              {maxModelTokens !== undefined ? `/${maxModelTokens}` : ""}
            </div>
          )}
          {!isAi && <div className="flex-grow"></div>} {/* Spacer for user messages */}
          <div className={`text-[10px] opacity-70 ${isAi && tokensConsumed !== undefined ? "text-right" : "w-full text-right"}`}>
            {timestamp}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
export type { MessageBubbleProps };
