import React, { useState, useRef, useEffect } from "react";
import "../assets/css/ChatBox.css";
import config from "./../config";

export default function VideoGenerationBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message/video
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
    const userPrompt = input;

    // Add user prompt message
    setMessages((msgs) => [...msgs, { role: "user", content: userPrompt }]);
    setInput("");

    try {
      // Call Spring Boot backend video generation API
      const res = await fetch(`${config.BASE_URL}/video`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userPrompt }),
      });

      const data = await res.json();

      // Add AI generated video or error
      if (data.videoUrl) {
        setMessages((msgs) => [
          ...msgs,
          { role: "ai", content: data.videoUrl, type: "video" },
        ]);
      } else {
        setMessages((msgs) => [
          ...msgs,
          { role: "ai", content: "No video generated.", type: "text" },
        ]);
      }
    } catch (error) {
      setMessages((msgs) => [
        ...msgs,
        {
          role: "ai",
          content: "Error: Failed to generate video. Please try again.",
          type: "text",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-container">
        {/* Header */}
        <div className="chat-header">
          <h1>✨ AI Video Generator</h1>
          <p>Powered by Shastra Digital Library & Gemini AI</p>
        </div>

        {/* Messages Area */}
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎥</div>
              <h2>Start Video Generation</h2>
              <p>Enter a description to generate an AI video.</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`message-wrapper ${msg.role}`}>
                <div className={`message ${msg.role}`}>
                  <div className="message-avatar">
                    {msg.role === "user" ? "👤" : "🤖"}
                  </div>
                  <div className="message-content">
                    {msg.type === "video" ? (
                      <video
                        width="360"
                        height="240"
                        controls
                        src={msg.content}
                      />
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="message-wrapper ai">
              <div className="message ai">
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

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="chat-input-form">
          <div className="input-wrapper">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe the video you want to generate..."
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
