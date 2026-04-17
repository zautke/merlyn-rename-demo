import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ConversationsDrawer } from '../src/components/ConversationsDrawer';
import type { Conversation } from '../src/shared/db';

const CONVERSATIONS: Conversation[] = [
  { id: '1', title: 'First Chat', updatedAt: 1 },
  { id: '2', title: 'Second Chat', updatedAt: 2 },
];

const noop = () => {};

function renderDrawer(overrides: Record<string, unknown> = {}) {
  return render(
    <ConversationsDrawer
      isOpen={true}
      onClose={noop}
      conversations={CONVERSATIONS}
      searchQuery=""
      setSearchQuery={noop}
      activeId={null}
      onSelect={noop}
      onNewChat={noop}
      onDeleteChat={noop}
      {...overrides}
    />
  );
}

test('renders all conversation titles', () => {
  renderDrawer();
  expect(screen.getByText('First Chat')).toBeInTheDocument();
  expect(screen.getByText('Second Chat')).toBeInTheDocument();
});

test('clicking Rename shows inline input pre-filled with current title', async () => {
  const user = userEvent.setup();
  renderDrawer();

  const optionsButtons = screen.getAllByLabelText('Conversation options');
  await user.click(optionsButtons[0]);

  await user.click(screen.getByRole('button', { name: /rename/i }));

  expect(screen.getByDisplayValue('First Chat')).toBeInTheDocument();
});

test('pressing Enter in rename input calls onRenameChat with new title', async () => {
  const user = userEvent.setup();
  const onRenameChat = vi.fn();
  renderDrawer({ onRenameChat });

  const optionsButtons = screen.getAllByLabelText('Conversation options');
  await user.click(optionsButtons[0]);
  await user.click(screen.getByRole('button', { name: /rename/i }));

  const input = screen.getByDisplayValue('First Chat');
  await user.clear(input);
  await user.type(input, 'New Title');
  await user.keyboard('{Enter}');

  expect(onRenameChat).toHaveBeenCalledWith('1', 'New Title');
});
