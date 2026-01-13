/**
 * CoachView - AI Trading Coach
 */

import { useState, useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import { EmptyState, MarkdownRenderer } from '../../shared/components';
import './CoachView.css';

export function CoachView() {
  const { conversations, currentConversation, isTyping, sendMessage, createNewConversation } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversations.length === 0) {
      createNewConversation('Trading Session');
    }
  }, [conversations.length, createNewConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentConversation?.messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(input);
    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!currentConversation) {
    return (
      <div className="coach-view">
        <EmptyState
          title="No conversation. Start a new conversation with your AI coach."
          action={{ label: 'New Conversation', onClick: () => createNewConversation() }}
        />
      </div>
    );
  }

  return (
    <div className="coach-view">
      <header className="coach-header">
        <div className="coach-title-group">
          <h1 className="coach-title">AI Trading Coach</h1>
          <p className="coach-subtitle">Get personalized trading insights and guidance</p>
        </div>
      </header>

      <div className="coach-content">
        <div className="messages-container">
          {currentConversation.messages.length === 0 ? (
            <div className="welcome-message">
              <h2>Welcome to your AI Trading Coach</h2>
              <p>I can help you with:</p>
              <ul>
                <li>Analyzing your trading performance</li>
                <li>Reviewing specific trades and setups</li>
                <li>Improving risk management</li>
                <li>Identifying patterns in your trading</li>
                <li>Answering questions about your strategy</li>
              </ul>
              <p>Ask me anything about your trading!</p>
            </div>
          ) : (
            currentConversation.messages.map((message) => (
              <div key={message.id} className={`message message-${message.role}`}>
                <div className="message-avatar">{message.role === 'user' ? 'You' : 'AI'}</div>
                <div className="message-content">
                  <MarkdownRenderer content={message.content} />
                  <div className="message-timestamp">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))
          )}
          
          {isTyping && (
            <div className="message message-assistant">
              <div className="message-avatar">AI</div>
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask your AI coach anything..."
            rows={3}
          />
          <button className="btn-send" onClick={handleSend} disabled={!input.trim() || isTyping}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
