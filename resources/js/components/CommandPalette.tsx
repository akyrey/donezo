import React, { useCallback, useEffect, useRef, useState } from 'react';
import { router } from '@inertiajs/react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import {
  Search,
  FileText,
  FolderOpen,
  LayoutList,
  Tag,
  Inbox,
  Sun,
  Calendar,
  Layers,
  Archive,
  BookOpen,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearch } from '@/hooks/useSearch';
import type { Task, Project, Section, Tag as TagType } from '@/types';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Static navigation commands shown when the search query is empty. */
const NAVIGATION_COMMANDS = [
  { label: 'Inbox', href: '/inbox', icon: Inbox },
  { label: 'Today', href: '/today', icon: Sun },
  { label: 'Upcoming', href: '/upcoming', icon: Calendar },
  { label: 'Anytime', href: '/anytime', icon: Layers },
  { label: 'Someday', href: '/someday', icon: Archive },
  { label: 'Logbook', href: '/logbook', icon: BookOpen },
] as const;

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const { query, setQuery, results, isLoading, isEmpty } = useSearch(200);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  // Build a flat list of selectable items for keyboard navigation
  const flatItems = React.useMemo(() => {
    const items: Array<{
      type: 'nav' | 'task' | 'project' | 'section' | 'tag';
      id: string;
      label: string;
      onSelect: () => void;
    }> = [];

    if (!query.trim()) {
      // Show navigation commands
      NAVIGATION_COMMANDS.forEach((cmd) => {
        items.push({
          type: 'nav',
          id: `nav-${cmd.href}`,
          label: cmd.label,
          onSelect: () => {
            onOpenChange(false);
            router.visit(cmd.href);
          },
        });
      });
    } else if (results) {
      results.tasks.forEach((task) => {
        items.push({
          type: 'task',
          id: `task-${task.id}`,
          label: task.title,
          onSelect: () => {
            onOpenChange(false);
            if (task.project_id) {
              router.visit(`/projects/${task.project_id}`);
            } else {
              // Navigate to the task's status view
              const statusRouteMap: Record<string, string> = {
                inbox: '/inbox',
                today: '/today',
                upcoming: '/upcoming',
                anytime: '/anytime',
                someday: '/someday',
                completed: '/logbook',
                cancelled: '/logbook',
              };
              router.visit(statusRouteMap[task.status] ?? '/inbox');
            }
          },
        });
      });

      results.projects.forEach((project) => {
        items.push({
          type: 'project',
          id: `project-${project.id}`,
          label: project.name,
          onSelect: () => {
            onOpenChange(false);
            router.visit(`/projects/${project.id}`);
          },
        });
      });

      results.sections.forEach((section) => {
        items.push({
          type: 'section',
          id: `section-${section.id}`,
          label: section.name,
          onSelect: () => {
            onOpenChange(false);
            router.visit(`/sections/${section.id}`);
          },
        });
      });

      results.tags.forEach((tag) => {
        items.push({
          type: 'tag',
          id: `tag-${tag.id}`,
          label: tag.name,
          onSelect: () => {
            // Tags don't have a dedicated page — navigate to anytime filtered view
            onOpenChange(false);
            router.visit('/anytime');
          },
        });
      });
    }

    return items;
  }, [query, results, onOpenChange]);

  // Reset selection when items change
  useEffect(() => {
    setSelectedIndex(0);
  }, [flatItems.length, query]);

  // Reset query when closed
  useEffect(() => {
    if (!open) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [open, setQuery]);

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return;
    const selected = listRef.current.querySelector('[data-selected="true"]');
    selected?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => (i < flatItems.length - 1 ? i + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => (i > 0 ? i - 1 : flatItems.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        flatItems[selectedIndex]?.onSelect();
      }
    },
    [flatItems, selectedIndex],
  );

  function renderIcon(type: string) {
    switch (type) {
      case 'task':
        return <FileText className="text-text-tertiary h-4 w-4" />;
      case 'project':
        return <FolderOpen className="text-text-tertiary h-4 w-4" />;
      case 'section':
        return <LayoutList className="text-text-tertiary h-4 w-4" />;
      case 'tag':
        return <Tag className="text-text-tertiary h-4 w-4" />;
      default:
        return null;
    }
  }

  function renderNavIcon(href: string) {
    const cmd = NAVIGATION_COMMANDS.find((c) => c.href === href);
    if (!cmd) return null;
    const Icon = cmd.icon;
    return <Icon className="text-text-tertiary h-4 w-4" />;
  }

  // Group results by category for display
  const groupedResults = React.useMemo(() => {
    if (!query.trim() || !results) return null;

    const groups: Array<{
      label: string;
      items: typeof flatItems;
    }> = [];

    const tasks = flatItems.filter((i) => i.type === 'task');
    const projects = flatItems.filter((i) => i.type === 'project');
    const sections = flatItems.filter((i) => i.type === 'section');
    const tags = flatItems.filter((i) => i.type === 'tag');

    if (tasks.length > 0) groups.push({ label: 'Tasks', items: tasks });
    if (projects.length > 0) groups.push({ label: 'Projects', items: projects });
    if (sections.length > 0) groups.push({ label: 'Sections', items: sections });
    if (tags.length > 0) groups.push({ label: 'Tags', items: tags });

    return groups;
  }, [query, results, flatItems]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-black/40 backdrop-blur-sm',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            'border-border bg-bg fixed top-[20%] left-1/2 z-50 w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border shadow-2xl',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-4',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-4',
            'duration-150',
          )}
          onKeyDown={handleKeyDown}
        >
          <DialogPrimitive.Title className="sr-only">Quick Find</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Search tasks, projects, sections, and tags, or navigate to a page.
          </DialogPrimitive.Description>

          {/* Search input */}
          <div className="border-border flex items-center gap-3 border-b px-4">
            <Search className="text-text-tertiary h-4.5 w-4.5 shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search or jump to..."
              className="text-text placeholder:text-text-tertiary h-12 flex-1 bg-transparent text-sm outline-none"
              autoFocus
            />
            {isLoading && <Loader2 className="text-text-tertiary h-4 w-4 shrink-0 animate-spin" />}
            <kbd className="border-border bg-bg-secondary text-text-tertiary hidden shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-medium sm:inline-block">
              ESC
            </kbd>
          </div>

          {/* Results list */}
          <div ref={listRef} className="max-h-80 overflow-y-auto p-2" role="listbox">
            {/* Empty query → navigation commands */}
            {!query.trim() && (
              <div>
                <p className="text-text-tertiary mb-1 px-2 text-xs font-semibold tracking-wider uppercase">
                  Navigate
                </p>
                {flatItems.map((item, index) => (
                  <button
                    key={item.id}
                    data-selected={index === selectedIndex}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                      index === selectedIndex
                        ? 'bg-sidebar-active text-primary'
                        : 'text-text-secondary hover:bg-bg-secondary',
                    )}
                    onClick={item.onSelect}
                    onMouseEnter={() => setSelectedIndex(index)}
                    role="option"
                    aria-selected={index === selectedIndex}
                  >
                    {renderNavIcon(NAVIGATION_COMMANDS[index]?.href ?? '')}
                    {item.label}
                  </button>
                ))}
              </div>
            )}

            {/* Search results */}
            {query.trim() && groupedResults && groupedResults.length > 0 && (
              <div className="space-y-3">
                {groupedResults.map((group) => (
                  <div key={group.label}>
                    <p className="text-text-tertiary mb-1 px-2 text-xs font-semibold tracking-wider uppercase">
                      {group.label}
                    </p>
                    {group.items.map((item) => {
                      const globalIndex = flatItems.indexOf(item);
                      return (
                        <button
                          key={item.id}
                          data-selected={globalIndex === selectedIndex}
                          className={cn(
                            'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                            globalIndex === selectedIndex
                              ? 'bg-sidebar-active text-primary'
                              : 'text-text-secondary hover:bg-bg-secondary',
                          )}
                          onClick={item.onSelect}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                          role="option"
                          aria-selected={globalIndex === selectedIndex}
                        >
                          {renderIcon(item.type)}
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            {/* Empty search results */}
            {query.trim() && !isLoading && isEmpty && (
              <div className="text-text-tertiary flex flex-col items-center justify-center py-8">
                <Search className="mb-2 h-8 w-8 stroke-1" />
                <p className="text-sm">No results found</p>
                <p className="mt-1 text-xs">Try a different search term</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-border flex items-center justify-between border-t px-4 py-2">
            <div className="text-text-tertiary flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1">
                <kbd className="border-border bg-bg-secondary rounded border px-1 py-0.5 text-[10px] font-medium">
                  &uarr;
                </kbd>
                <kbd className="border-border bg-bg-secondary rounded border px-1 py-0.5 text-[10px] font-medium">
                  &darr;
                </kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="border-border bg-bg-secondary rounded border px-1 py-0.5 text-[10px] font-medium">
                  &crarr;
                </kbd>
                Open
              </span>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
