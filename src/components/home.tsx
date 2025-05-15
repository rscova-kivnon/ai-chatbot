import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import MessageBubble from "./chat/MessageBubble";
import ChatInput from "./chat/ChatInput";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  suggestions?: string[];
  tokensConsumed?: number; // New field for tokens
  maxModelTokens?: number; // New field for max tokens
}

// Define the expected structure of the backend response
interface BackendChatResponse {
    reply: string;
    suggestions?: string[];
    tokens_consumed?: number; // New field for tokens
    max_model_tokens?: number; // New field for max tokens
}

const Home = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hola, soy Nestor. ¿Cómo te encuentras hoy?",
      sender: "ai",
      timestamp: new Date(),
      suggestions: [
        "Me gustaría hablar un poco.",
        "¿Qué tal el día?",
        "Necesito un momento de calma.",
      ],
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [error, setError] = useState<string | null>(null); // State for handling errors
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref for the element to scroll to
  const chatContainerRef = useRef<HTMLDivElement>(null); // Ref for the scrollable chat area

  // Scroll to bottom whenever messages change or AI stops typing
  useEffect(() => {
    // Using setTimeout with 0ms delay defers the execution until after the current
    // browser call stack has cleared and DOM updates have been processed.
    // This helps ensure that the scroll happens after the new message's height is calculated.
    const timerId = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
    }, 0);

    // Cleanup function to clear the timeout if dependencies change before it executes
    return () => clearTimeout(timerId);
  }, [messages, isAiTyping]); // Re-run when messages update or AI typing state changes

  // Function to handle sending a new message
  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isAiTyping) return;

    setError(null); // Clear previous errors
    const userMessage: Message = {
      id: `user-${Date.now()}`, // Ensure unique ID
      content,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue(""); // Clear input field
    setIsAiTyping(true);

    try {
      // Call the backend streaming API
      const response = await fetch("http://localhost:8000/api/chat/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        // Handle HTTP errors
        const errorData = await response.json().catch(() => ({ detail: "Failed to parse error response from backend" }));
        throw new Error(`Network response was not ok: ${response.statusText} - ${errorData?.detail || ''}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;

      // Crear el mensaje inicial del AI
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage?.sender === "ai") {
          return prev;
        }
        return [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            content: "",
            sender: "ai",
            timestamp: new Date(),
          },
        ];
      });

      while (!done) {
        const { value, done: readerDone } = await reader?.read()!;
        done = readerDone;

        if (value) {
          const chunk = decoder.decode(value, { stream: true });

          // Update the last AI message bubble in real-time
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];

            if (lastMessage?.sender === "ai") {
              // Update the content of the last AI message
              return [
                ...prev.slice(0, -1),
                {
                  ...lastMessage,
                  content: lastMessage.content + chunk,
                },
              ];
            }
            return prev;
          });
        }
      }
    } catch (err) {
      console.error("Error sending message to backend:", err);
      let errorMessageText = "Failed to get response from AI. Please try again.";
      if (err instanceof Error) {
        errorMessageText = `Error: ${err.message}`;
      }
      setError(errorMessageText); // Set error state to display to user

      // Optionally add an error message to the chat interface
      const errorChatMessage: Message = {
        id: `error-${Date.now()}`,
        content: errorMessageText,
        sender: "ai", // Or a dedicated 'system' sender type
        timestamp: new Date(),
        suggestions: undefined, // Explicitly no suggestions for error messages either
      };
      setMessages((prev) => [...prev, errorChatMessage]);
    } finally {
      setIsAiTyping(false); // Stop typing indicator regardless of success/failure
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  // Example phrases that users can click on to start a conversation
  const examplePhrases = [
    "How can you help me today?",
    "Tell me about your features",
    "What can you do?",
    "Give me some examples",
  ];

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <motion.header
        className="py-4 px-6 border-b border-gray-100 bg-white z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-xl font-medium text-gray-800">AI Assistant</h1>
      </motion.header>

      {/* Main chat area */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto"> {/* Added ref to the scrollable container */}
        <div className="max-w-4xl mx-auto p-4 space-y-4">
          {/* Display Error Message if any */}
          {error && (
              <motion.div
                  className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
                  role="alert"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
              >
                  <span className="font-medium">Error:</span> {error}
              </motion.div>
          )}

          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <MessageBubble
                message={message.content}
                isAi={message.sender === "ai"}
                timestamp={message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                suggestions={message.suggestions} // Will be undefined for non-initial AI messages
                onSuggestionClick={handleSuggestionClick}
                tokensConsumed={message.tokensConsumed} // Pass tokens
                maxModelTokens={message.maxModelTokens} // Pass max tokens
              />
            </motion.div>
          ))}
          {isAiTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-2 text-gray-500 text-sm ml-2"
            >
              <div className="flex space-x-1">
                <div
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
              <span>Nestor is typing</span>
            </motion.div>
          )}
          {/* This div is the target for scrollIntoView. Giving it a minimal height can sometimes help. */}
          <div ref={messagesEndRef} style={{ height: "1px" }} />
        </div>
      </div>

      {/* Example phrases */}
      <div className="border-t border-gray-100 bg-white px-4 pt-3 pb-1">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {examplePhrases.map((phrase, index) => (
              <motion.button
                key={index}
                onClick={() => handleSendMessage(phrase)}
                className="text-sm px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {phrase}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-gray-100 bg-white p-4">
        <div className="max-w-3xl mx-auto">
          <ChatInput
            onSendMessage={handleSendMessage} // Pass the async handleSendMessage
            isAiTyping={isAiTyping}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
