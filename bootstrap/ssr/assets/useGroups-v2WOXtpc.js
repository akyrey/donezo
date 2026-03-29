import { t as axios_default } from "./axios-BY0CCud-.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
//#region resources/js/hooks/useGroups.ts
var GROUPS_KEY = ["groups"];
function groupDetailKey(id) {
	return [...GROUPS_KEY, id];
}
async function fetchGroupInvitations(groupId) {
	const { data } = await axios_default.get(`/api/v1/groups/${groupId}/invitations`);
	return data;
}
function useGroupInvitationsQuery(groupId) {
	return useQuery({
		queryKey: [...groupDetailKey(groupId), "invitations"],
		queryFn: () => fetchGroupInvitations(groupId),
		enabled: groupId > 0
	});
}
function useCreateGroupMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data) => {
			return (await axios_default.post("/api/v1/groups", data)).data.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: GROUPS_KEY });
		}
	});
}
function useUpdateGroupMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, ...data }) => {
			return (await axios_default.put(`/api/v1/groups/${id}`, data)).data.data;
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: GROUPS_KEY });
			queryClient.invalidateQueries({ queryKey: groupDetailKey(variables.id) });
		}
	});
}
function useDeleteGroupMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id) => {
			await axios_default.delete(`/api/v1/groups/${id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: GROUPS_KEY });
		}
	});
}
function useInviteMemberMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ groupId, email, role = "member" }) => {
			return (await axios_default.post(`/api/v1/groups/${groupId}/invitations`, {
				email,
				role
			})).data;
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: [...groupDetailKey(variables.groupId), "invitations"] });
		}
	});
}
function useCancelInvitationMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ groupId, invitationId }) => {
			await axios_default.delete(`/api/v1/groups/${groupId}/invitations/${invitationId}`);
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: [...groupDetailKey(variables.groupId), "invitations"] });
		}
	});
}
function useRemoveMemberMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ groupId, userId }) => {
			return (await axios_default.delete(`/api/v1/groups/${groupId}/members/${userId}`)).data.data;
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: GROUPS_KEY });
			queryClient.invalidateQueries({ queryKey: groupDetailKey(variables.groupId) });
		}
	});
}
function useAcceptInvitationMutation() {
	return useMutation({ mutationFn: async (token) => {
		return (await axios_default.post(`/api/v1/invitations/${token}/accept`)).data;
	} });
}
function useUpdateMemberRoleMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ groupId, userId, role }) => {
			return (await axios_default.put(`/api/v1/groups/${groupId}/members/${userId}`, { role })).data;
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({ queryKey: groupDetailKey(variables.groupId) });
		}
	});
}
//#endregion
export { useGroupInvitationsQuery as a, useUpdateGroupMutation as c, useDeleteGroupMutation as i, useUpdateMemberRoleMutation as l, useCancelInvitationMutation as n, useInviteMemberMutation as o, useCreateGroupMutation as r, useRemoveMemberMutation as s, useAcceptInvitationMutation as t };
