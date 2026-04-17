import { buildConversationRenamePrompt, sanitizeConversationTitle } from '../src/hooks/useRename';
import type { Conversation, DbConversationItem } from '../src/shared/db';

const CONVERSATION: Conversation = { id: '1', title: 'New Chat', updatedAt: 0 };

test('buildConversationRenamePrompt instructs sentence case and forbids CamelCase', () => {
  const history: DbConversationItem[] = [{ kind: 'chat', role: 'user', content: 'hello world' }];
  const prompt = buildConversationRenamePrompt(CONVERSATION, history);

  expect(prompt).toContain('sentence case');
  expect(prompt).toContain('CamelCase');
  expect(prompt).toContain('user: hello world');
  expect(prompt).toContain('Current title: New Chat');
});

test('sanitizeConversationTitle strips wrapping quotes, collapses whitespace, and trims', () => {
  expect(sanitizeConversationTitle('  "React form state"  ')).toBe('React form state');
  expect(sanitizeConversationTitle('Line one\nLine two')).toBe('Line one Line two');
});

test('sanitizeConversationTitle truncates at 40 characters with ellipsis', () => {
  const long = 'This title is absolutely far too long to ever fit in the drawer list';
  const result = sanitizeConversationTitle(long);

  expect(result.length).toBeLessThanOrEqual(40);
  expect(result.endsWith('...')).toBe(true);
});

test('sanitizeConversationTitle falls back to "New Chat" on empty input', () => {
  expect(sanitizeConversationTitle('   ')).toBe('New Chat');
  expect(sanitizeConversationTitle('""')).toBe('New Chat');
});
