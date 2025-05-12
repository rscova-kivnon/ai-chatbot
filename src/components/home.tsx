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
}

const Home = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! How can I assist you today?",
      sender: "ai",
      timestamp: new Date(),
      suggestions: [
        "Tell me about your features",
        "How does this work?",
        "Can you help me with a task?",
      ],
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Function to handle sending a new message
  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsAiTyping(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponses = [
        {
          content:
            "I understand what you're asking about. Let me provide some information on that topic.",
          suggestions: [
            "Tell me more",
            "Can you give examples?",
            "How is this implemented?",
          ],
        },
        {
          content:
            "That's an interesting question. Here's what I know about it.",
          suggestions: [
            "What are the benefits?",
            "Are there any alternatives?",
            "How can I learn more?",
          ],
        },
        {
          content:
            "I'd be happy to help with that. Here are some steps you might consider.",
          suggestions: [
            "What's the first step?",
            "Is there documentation?",
            "Can you show me a demo?",
          ],
        },
      ];

      const randomResponse =
        aiResponses[Math.floor(Math.random() * aiResponses.length)];

      const aiMessage: Message = {
        id: Date.now().toString(),
        content: randomResponse.content,
        sender: "ai",
        timestamp: new Date(),
        suggestions: randomResponse.suggestions,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsAiTyping(false);
    }, 1500);
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
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 space-y-4">
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
                suggestions={message.suggestions}
                onSuggestionClick={handleSuggestionClick}
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
              <span>AI is typing</span>
            </motion.div>
          )}
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
            onSendMessage={handleSendMessage}
            isAiTyping={isAiTyping}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
