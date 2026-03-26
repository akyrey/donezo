import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { router, usePage } from '@inertiajs/react';
import echo from '@/echo';
import type { PageProps, Group } from '@/types';

/**
 * Debounce a function so rapid-fire calls (e.g. reordering N tasks) only
 * trigger one refresh.
 */
function debounce<T extends (...args: unknown[]) => void>(fn: T, ms: number): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  }) as T;
}

/**
 * Subscribe to Laravel Echo broadcast channels for real-time updates.
 *
 * Listens on:
 * - `private-App.Models.User.{id}` — personal resources (tasks, projects,
 *   sections, headings, checklist items, reminders)
 * - `private-groups.{id}` — group collaboration (shared tasks, members)
 *
 * On any event, invalidates all React Query caches and reloads Inertia page
 * props — the same pattern used in mutation onSuccess handlers.
 *
 * Uses `toOthers()` on the server, so the originating tab does NOT receive
 * its own events and avoids double-refreshing.
 */
export function useBroadcast(): void {
  const queryClient = useQueryClient();
  const { auth, groups } = usePage<PageProps<{ groups: Group[] }>>().props;

  // Stable ref for groups to avoid re-subscribing on every render
  const groupsRef = useRef<Group[]>(groups);
  groupsRef.current = groups;

  const userId = auth.user?.id;

  useEffect(() => {
    if (!userId || !echo) return;

    const echoInstance = echo;

    const refresh = debounce(() => {
      queryClient.invalidateQueries();
      router.reload();
    }, 150);

    // ---------------------------------------------------------------
    // Private user channel — personal data sync across tabs
    // ---------------------------------------------------------------
    const userChannel = echoInstance.private(`App.Models.User.${userId}`);

    userChannel
      // Tasks
      .listen('TaskCreated', refresh)
      .listen('TaskUpdated', refresh)
      .listen('TaskDeleted', refresh)
      .listen('TaskCompleted', refresh)
      .listen('TaskUncompleted', refresh)
      .listen('TasksReordered', refresh)
      // Projects
      .listen('ProjectCreated', refresh)
      .listen('ProjectUpdated', refresh)
      .listen('ProjectDeleted', refresh)
      // Sections
      .listen('SectionCreated', refresh)
      .listen('SectionUpdated', refresh)
      .listen('SectionDeleted', refresh)
      // Headings
      .listen('HeadingCreated', refresh)
      .listen('HeadingUpdated', refresh)
      .listen('HeadingDeleted', refresh)
      .listen('HeadingsReordered', refresh)
      // Sub-resources
      .listen('ChecklistItemChanged', refresh)
      .listen('ReminderChanged', refresh)
      // Group membership — notified when removed from a group
      .listen('GroupMemberRemoved', refresh)
      // Group deleted — notified via private channel since group channel is gone
      .listen('GroupDeleted', refresh);

    // ---------------------------------------------------------------
    // Group channels — cross-user collaboration
    // ---------------------------------------------------------------
    const currentGroups = groupsRef.current;
    const groupChannels = currentGroups.map((group) => {
      const ch = echoInstance.private(`groups.${group.id}`);

      ch.listen('TaskCreated', refresh)
        .listen('TaskUpdated', refresh)
        .listen('TaskDeleted', refresh)
        .listen('TaskCompleted', refresh)
        .listen('TaskUncompleted', refresh)
        .listen('GroupUpdated', refresh)
        .listen('GroupMemberRemoved', refresh)
        .listen('GroupMemberJoined', refresh)
        .listen('GroupTasksShared', refresh)
        .listen('ChecklistItemChanged', refresh);

      return { id: group.id, channel: ch };
    });

    return () => {
      echoInstance.leave(`App.Models.User.${userId}`);
      groupChannels.forEach(({ id }) => echoInstance.leave(`groups.${id}`));
    };
    // Re-subscribe only when the user or their group membership changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, groups.map((g: Group) => g.id).join(',')]);
}
