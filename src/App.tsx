import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { ConversationsDrawer } from './components/ConversationsDrawer';
import type { Conversation, DbConversationItem } from './shared/db';
import { useRename, buildConversationRenamePrompt, sanitizeConversationTitle } from './hooks/useRename';

const STUB_CONVERSATIONS: Conversation[] = [
  { id: '1', title: 'New Chat', updatedAt: Date.now() - 3000 },
];

export default function App() {
  const [conversations, setConversations] = useState(STUB_CONVERSATIONS);
  const [activeId, setActiveId] = useState<string | null>('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [prompt, setPrompt] = useState('');
  const [renaming, setRenaming] = useState(false);
  const { complete } = useRename();

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleRename(id: string, newTitle: string) {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c))
    );
  }

  async function handleSubmit() {
    if (!activeId || !prompt.trim() || renaming) return;
    const activeConv = conversations.find((c) => c.id === activeId);
    if (!activeConv) return;

    setRenaming(true);
    try {
      const history: DbConversationItem[] = [
        { kind: 'chat', role: 'user', content: prompt.trim() },
      ];
      const result = await complete({
        prompt: buildConversationRenamePrompt(activeConv, history),
        instructions: 'You rename chats based on transcript content.',
      });
      if (result?.text) {
        handleRename(activeId, sanitizeConversationTitle(result.text));
      }
    } catch (error) {
      console.error('Rename failed:', error);
    } finally {
      setRenaming(false);
    }
  }

  return (
    <div className="relative h-screen w-screen bg-slate-100">
      <ConversationsDrawer
        isOpen={true}
        onClose={() => { }}
        conversations={filtered}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeId={activeId}
        onSelect={setActiveId}
        onNewChat={() => { }}
        onDeleteChat={(id) =>
          setConversations((prev) => prev.filter((c) => c.id !== id))
        }
        onRenameChat={handleRename}
      />

      {/* z-[60]: above backdrop (z-40) and drawer (z-50) so textarea is clickable */}
      <div className="absolute inset-0 flex items-center justify-center pl-[280px] z-[60]">
        <div className="flex flex-col items-center gap-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            id="rename-prompt"
            name="rename-prompt"
            placeholder="Stub rename prompt…"
            rows={4}
            disabled={renaming}
            className="w-80 resize-none rounded-lg border border-slate-300 bg-white p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-400 disabled:opacity-50"
          />
          <button
            onClick={handleSubmit}
            disabled={renaming || !prompt.trim()}
            className="flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {renaming ? 'Renaming…' : 'Submit'}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
