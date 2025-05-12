import React, { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isAiTyping?: boolean;
  placeholder?: string;
}

const ChatInput = ({
  onSendMessage = () => {},
  isAiTyping = false,
  placeholder = "Message ChatGPT...",
}: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isAiTyping) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full bg-background border-t border-border py-4 px-4 sm:px-6 fixed bottom-0 left-0 right-0">
      <div className="max-w-3xl mx-auto relative">
        <form onSubmit={handleSubmit} className="relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={isAiTyping}
            className={`pr-12 min-h-[56px] max-h-[200px] resize-none rounded-lg transition-shadow ${isFocused ? "shadow-md" : "shadow-sm"} focus-visible:ring-1 focus-visible:ring-primary/30`}
          />
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            disabled={!message.trim() || isAiTyping}
            className={`absolute right-2 bottom-2 h-8 w-8 rounded-md transition-opacity ${!message.trim() || isAiTyping ? "opacity-50" : "opacity-100 hover:bg-primary/10 hover:text-primary"}`}
          >
            <Send
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
            <span className="sr-only">Send message</span>
          </Button>
        </form>

        {isAiTyping && (
          <div className="absolute -top-8 left-0 text-sm text-muted-foreground flex items-center">
            <div className="flex space-x-1 items-center">
              <span>ChatGPT is typing</span>
              <span className="flex space-x-1">
                <span className="animate-bounce delay-0 h-1 w-1 rounded-full bg-muted-foreground"></span>
                <span className="animate-bounce delay-150 h-1 w-1 rounded-full bg-muted-foreground"></span>
                <span className="animate-bounce delay-300 h-1 w-1 rounded-full bg-muted-foreground"></span>
              </span>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground mt-2 text-center">
          ChatGPT can make mistakes. Consider checking important information.
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
