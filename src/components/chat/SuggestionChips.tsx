import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SuggestionChipsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  className?: string;
}

const SuggestionChips = ({
  suggestions = [
    "Tell me more about this",
    "How does this work?",
    "Can you provide examples?",
  ],
  onSelect = () => {},
  className,
}: SuggestionChipsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className={cn("flex flex-wrap gap-2 mt-3", className)}
    >
      {suggestions.map((suggestion, index) => (
        <motion.button
          key={index}
          whileHover={{ scale: 1.03, backgroundColor: "rgb(243, 244, 246)" }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + index * 0.1, duration: 0.2 }}
          onClick={() => onSelect(suggestion)}
          className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-full text-gray-700 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-1"
        >
          {suggestion}
        </motion.button>
      ))}
    </motion.div>
  );
};

export default SuggestionChips;
