/**
 * ChatContext - Manages AI Coach chat state
 */

import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Conversation } from '../shared/types/ChatMessage';
import { createUserMessage, createAssistantMessage, createConversation } from '../shared/types/ChatMessage';
import { LocalStorageProvider } from '../services/storage/StorageService';

interface ChatContextValue {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  isTyping: boolean;
  sendMessage: (content: string) => Promise<void>;
  createNewConversation: (title?: string) => void;
  selectConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

const storage = new LocalStorageProvider();
const CONVERSATIONS_KEY = 'conversations';

// Mock AI responses
const getMockResponse = (userMessage: string): string => {
  const lower = userMessage.toLowerCase();
  
  if (lower.includes('setup') || lower.includes('strategy')) {
    return 'Based on your trading history, I notice you have a high win rate with breakout setups. Consider focusing on consolidation patterns with clear support/resistance levels. Your best results come from trades taken during the first 2 hours of market open.';
  }
  
  if (lower.includes('risk') || lower.includes('position size')) {
    return 'Your current risk per trade is 2% of capital. Given your recent win rate of 65%, this is within acceptable parameters. However, I notice your average loss is larger than your average win. Consider tightening your stop losses or improving your entry timing.';
  }
  
  if (lower.includes('performance') || lower.includes('stats')) {
    return 'Your performance this month shows 12 trades with a 58% win rate. Total P/L is +8.5M VND. Your profit factor is 1.6, which is good. Areas for improvement: reduce your largest losses by exiting faster when setups invalidate.';
  }
  
  return 'I understand you\'re asking about trading. Could you be more specific? I can help with setup analysis, risk management, performance reviews, or specific trade feedback.';
};

export function ChatProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    if (!currentConversation) return;

    const userMsg = createUserMessage(content);
    const updatedConversation = {
      ...currentConversation,
      messages: [...currentConversation.messages, userMsg],
      updatedAt: new Date().toISOString(),
    };
    
    setCurrentConversation(updatedConversation);
    setIsTyping(true);

    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1500));

    const responseText = getMockResponse(content);
    const assistantMsg = createAssistantMessage(responseText);
    
    const finalConversation = {
      ...updatedConversation,
      messages: [...updatedConversation.messages, assistantMsg],
      updatedAt: new Date().toISOString(),
    };

    setCurrentConversation(finalConversation);
    setConversations(prev => prev.map(c => c.id === finalConversation.id ? finalConversation : c));
    storage.set(CONVERSATIONS_KEY, conversations);
    setIsTyping(false);
  }, [currentConversation, conversations]);

  const createNewConversation = useCallback((title = 'New Conversation') => {
    const firstMsg = createAssistantMessage('Hello! I\'m your AI trading coach. How can I help you today?');
    const newConv = createConversation(firstMsg);
    newConv.title = title; // Override title
    setConversations(prev => [newConv, ...prev]);
    setCurrentConversation(newConv);
  }, []);

  const selectConversation = useCallback((id: string) => {
    const conv = conversations.find(c => c.id === id);
    if (conv) setCurrentConversation(conv);
  }, [conversations]);

  const deleteConversation = useCallback((id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (currentConversation?.id === id) {
      setCurrentConversation(null);
    }
  }, [currentConversation]);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversation,
        isTyping,
        sendMessage,
        createNewConversation,
        selectConversation,
        deleteConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
}
