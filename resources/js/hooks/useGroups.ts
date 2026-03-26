import axios from '@/lib/axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Group, GroupInvitation, GroupRole, User } from '@/types';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export interface GroupCreateData {
  name: string;
  description?: string;
}

export interface GroupUpdateData {
  name?: string;
  description?: string;
}

interface GroupsResponse {
  data: Group[];
}

interface GroupDetailResponse {
  data: Group;
  members: User[];
}

interface GroupInvitationsResponse {
  data: GroupInvitation[];
}

// ──────────────────────────────────────────────
// Keys
// ──────────────────────────────────────────────

const GROUPS_KEY = ['groups'];

function groupDetailKey(id: number) {
  return [...GROUPS_KEY, id];
}

// ──────────────────────────────────────────────
// Queries
// ──────────────────────────────────────────────

async function fetchGroups(): Promise<GroupsResponse> {
  const { data } = await axios.get<GroupsResponse>('/api/v1/groups');
  return data;
}

async function fetchGroup(id: number): Promise<GroupDetailResponse> {
  const { data } = await axios.get<GroupDetailResponse>(`/api/v1/groups/${id}`);
  return data;
}

async function fetchGroupInvitations(groupId: number): Promise<GroupInvitationsResponse> {
  const { data } = await axios.get<GroupInvitationsResponse>(
    `/api/v1/groups/${groupId}/invitations`,
  );
  return data;
}

export function useGroupsQuery() {
  return useQuery<GroupsResponse>({
    queryKey: GROUPS_KEY,
    queryFn: fetchGroups,
  });
}

export function useGroupQuery(id: number) {
  return useQuery<GroupDetailResponse>({
    queryKey: groupDetailKey(id),
    queryFn: () => fetchGroup(id),
    enabled: id > 0,
  });
}

export function useGroupInvitationsQuery(groupId: number) {
  return useQuery<GroupInvitationsResponse>({
    queryKey: [...groupDetailKey(groupId), 'invitations'],
    queryFn: () => fetchGroupInvitations(groupId),
    enabled: groupId > 0,
  });
}

// ──────────────────────────────────────────────
// Mutations
// ──────────────────────────────────────────────

export function useCreateGroupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: GroupCreateData) => {
      const response = await axios.post<{ data: Group }>('/api/v1/groups', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GROUPS_KEY });
    },
  });
}

export function useUpdateGroupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: GroupUpdateData & { id: number }) => {
      const response = await axios.put<{ data: Group }>(`/api/v1/groups/${id}`, data);
      return response.data.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: GROUPS_KEY });
      queryClient.invalidateQueries({
        queryKey: groupDetailKey(variables.id),
      });
    },
  });
}

export function useDeleteGroupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`/api/v1/groups/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GROUPS_KEY });
    },
  });
}

export function useInviteMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      groupId,
      email,
      role = 'member',
    }: {
      groupId: number;
      email: string;
      role?: GroupRole;
    }) => {
      const response = await axios.post<{ data: GroupInvitation; message: string }>(
        `/api/v1/groups/${groupId}/invitations`,
        { email, role },
      );
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...groupDetailKey(variables.groupId), 'invitations'],
      });
    },
  });
}

export function useCancelInvitationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ groupId, invitationId }: { groupId: number; invitationId: number }) => {
      await axios.delete(`/api/v1/groups/${groupId}/invitations/${invitationId}`);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...groupDetailKey(variables.groupId), 'invitations'],
      });
    },
  });
}

export function useRemoveMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ groupId, userId }: { groupId: number; userId: number }) => {
      const response = await axios.delete<{ data: Group }>(
        `/api/v1/groups/${groupId}/members/${userId}`,
      );
      return response.data.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: GROUPS_KEY });
      queryClient.invalidateQueries({
        queryKey: groupDetailKey(variables.groupId),
      });
    },
  });
}

export function useAcceptInvitationMutation() {
  return useMutation({
    mutationFn: async (token: string) => {
      const response = await axios.post<{ message: string; group_id: number }>(
        `/api/v1/invitations/${token}/accept`,
      );
      return response.data;
    },
  });
}

export function useUpdateMemberRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      groupId,
      userId,
      role,
    }: {
      groupId: number;
      userId: number;
      role: GroupRole;
    }) => {
      const response = await axios.put<{ message: string }>(
        `/api/v1/groups/${groupId}/members/${userId}`,
        { role },
      );
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: groupDetailKey(variables.groupId) });
    },
  });
}

export function useShareTasksMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ groupId, taskIds }: { groupId: number; taskIds: number[] }) => {
      const response = await axios.post(`/api/v1/groups/${groupId}/tasks`, { task_ids: taskIds });
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: groupDetailKey(variables.groupId),
      });
    },
  });
}
