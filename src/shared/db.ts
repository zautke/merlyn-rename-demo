export type ConversationTitleSource = 'default' | 'auto' | 'manual';

export interface Conversation {
  id: string;
  title: string;
  titleSource?: ConversationTitleSource;
  autoRenamedAt?: number;
  manualRenamedAt?: number;
  updatedAt: number;
}

export type DbConversationItem =
  | { kind: 'chat'; role: 'user' | 'assistant'; content: string }
  | { kind: 'ooc'; content: string }
  | { kind: 'model-info'; modelSnapshot: { providerName: string; displayName: string } };
