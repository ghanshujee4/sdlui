import React, { useState, useRef, useEffect } from "react";
import "../assets/css/ChatBox.css";
import config from "../config";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [showChatBox, setShowChatBox] = useState(false);
  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    const userMessage = input;

    // Add user message bubble
    setMessages((msgs) => [...msgs, { role: "user", content: userMessage }]);
    setInput("");

    try {
      // Call Spring Boot backend
      const res = await fetch(`${config.BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      // Add AI response bubble
      setMessages((msgs) => [...msgs, { role: "ai", content: data.reply }]);
    } catch (error) {
      setMessages((msgs) => [
        ...msgs,
        { role: "ai", content: "Error: Failed to get response. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Message bubble renderer
  function renderMessage(msg, i) {
    const isUser = msg.role === "user";
    return (
      <div key={i} className={`message-row ${isUser ? "user" : "ai"}`}>
        <div className={`message-bubble ${isUser ? "user-bubble" : "ai-bubble"}`}>
          <div className="message-avatar">{isUser ? "👤" : "🤖"}</div>
          <div className="message-content">
            <p>{msg.content}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-wrapper chat-box-float">
      <div className="chat-container">
        {/* Header */}
        <div className="chat-header">
          <h1>✨ AI Chat Assistant</h1>
          <p>Powered by Shastra Digital Library</p>
        </div>

        {/* Messages Area */}
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <h2>Start a Conversation</h2>
              <p>Ask me anything! I'm here to help.</p>
            </div>
          ) : (
            <>
              {messages.map(renderMessage)}
              {/* Loading State bubble */}
              {isLoading && (
                <div className="message-row ai">
                  <div className="message-bubble ai-bubble">
                    <div className="message-avatar">🤖</div>
                    <div className="message-content">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="chat-input-form">
          <div className="input-wrapper">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              className="chat-input"
              disabled={isLoading}
              autoFocus
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="send-button"
            >
              {isLoading ? "⏳" : "➤"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
