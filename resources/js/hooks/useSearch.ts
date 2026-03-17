import { useState, useEffect, useMemo } from 'react';
import axios from '@/lib/axios';
import { useQuery } from '@tanstack/react-query';
import type { Task, Project, Section, Tag } from '@/types';

export interface SearchResults {
  tasks: Task[];
  projects: Project[];
  sections: Section[];
  tags: Tag[];
}

const SEARCH_KEY = ['search'];

async function fetchSearchResults(query: string): Promise<SearchResults> {
  const { data } = await axios.get<SearchResults>('/api/v1/search', {
    params: { q: query, limit: 10 },
  });
  return data;
}

/**
 * Custom hook that provides debounced search across tasks, projects, sections, and tags.
 */
export function useSearch(debounceMs = 250) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    if (!query.trim()) {
      setDebouncedQuery('');
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  const searchQuery = useQuery<SearchResults>({
    queryKey: [...SEARCH_KEY, debouncedQuery],
    queryFn: () => fetchSearchResults(debouncedQuery),
    enabled: debouncedQuery.length > 0,
    staleTime: 30_000,
    placeholderData: (previousData) => previousData,
  });

  const isEmpty = useMemo(() => {
    if (!searchQuery.data) return true;
    const { tasks, projects, sections, tags } = searchQuery.data;
    return (
      tasks.length === 0 && projects.length === 0 && sections.length === 0 && tags.length === 0
    );
  }, [searchQuery.data]);

  const totalResults = useMemo(() => {
    if (!searchQuery.data) return 0;
    const { tasks, projects, sections, tags } = searchQuery.data;
    return tasks.length + projects.length + sections.length + tags.length;
  }, [searchQuery.data]);

  return {
    query,
    setQuery,
    results: searchQuery.data ?? null,
    isLoading: searchQuery.isLoading && debouncedQuery.length > 0,
    isFetching: searchQuery.isFetching,
    isEmpty,
    totalResults,
  };
}
