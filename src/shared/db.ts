export type ConversationTitleSource = 'default' | 'auto' | 'manual';

export interface Conversation {
  id: string;
  title: string;
  titleSource?: ConversationTitleSource;
  autoRenamedAt?: number;
  manualRenamedAt?: number;
  updatedAt: number;
}
