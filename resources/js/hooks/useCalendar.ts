import axios from '@/lib/axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { CalendarStatus } from '@/types';

const CALENDAR_KEY = ['calendar'];

async function fetchCalendarStatus(): Promise<CalendarStatus> {
  const { data } = await axios.get<CalendarStatus>('/api/v1/calendar/status');
  return data;
}

export function useCalendarStatus() {
  return useQuery<CalendarStatus>({
    queryKey: CALENDAR_KEY,
    queryFn: fetchCalendarStatus,
    staleTime: 30_000,
  });
}

export function useDisconnectCalendarMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await axios.post('/api/v1/calendar/disconnect');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CALENDAR_KEY });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useSyncCalendarMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await axios.post<{ message: string; count: number }>(
        '/api/v1/calendar/sync',
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
