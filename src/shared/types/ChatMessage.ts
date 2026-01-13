/**
 * Chat Models - AI Coach messages and conversations
 */

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string; // Markdown formatted for assistant messages
  timestamp: string; // ISO 8601
  context?: MessageContext;
  artifacts?: Artifact[];
  actions?: MessageAction[];
}

export interface MessageContext {
  mentions?: string[]; // ['@VCB', '@Portfolio', '@Trade-VNM-Jan17']
  injectedData?: Record<string, any>; // Data injected via mentions
}

export interface Artifact {
  id: string;
  type: 'chart' | 'table' | 'calculator' | 'code';
  title: string;
  data: any; // Chart data, table rows, etc.
}

export interface MessageAction {
  id: string;
  label: string;
  action: string; // 'execute-trade', 'view-chart', 'compare-positions', etc.
  params?: Record<string, any>;
}

export interface Conversation {
  id: string;
  title: string; // Auto-generated from first message
  messages: ChatMessage[];
  isStarred: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

/**
 * Create a new user message
 */
export function createUserMessage(content: string, context?: MessageContext): ChatMessage {
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    role: 'user',
    content,
    timestamp: new Date().toISOString(),
    context,
  };
}

/**
 * Create a new assistant message
 */
export function createAssistantMessage(
  content: string,
  artifacts?: Artifact[],
  actions?: MessageAction[]
): ChatMessage {
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    role: 'assistant',
    content,
    timestamp: new Date().toISOString(),
    artifacts,
    actions,
  };
}

/**
 * Create a new conversation
 */
export function createConversation(firstMessage: ChatMessage): Conversation {
  // Generate title from first 50 chars of first message
  const title = firstMessage.content.substring(0, 50) + 
    (firstMessage.content.length > 50 ? '...' : '');

  return {
    id: `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title,
    messages: [firstMessage],
    isStarred: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
