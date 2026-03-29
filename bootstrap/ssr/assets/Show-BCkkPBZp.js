import { a as cn, i as Button } from "./wayfinder-C_mx6M06.js";
import { t as Input } from "./Input-BktEiBB2.js";
import { C as Separator, _ as DialogHeader, g as DialogFooter, h as DialogDescription, m as DialogContent, p as Dialog, t as AuthenticatedLayout, v as DialogTitle } from "./AuthenticatedLayout-BBEUssZw.js";
import { t as TaskDetailDialog } from "./TaskDetailDialog-i5waCmjV.js";
import { t as TaskList } from "./TaskList-CuBdRVOZ.js";
import { n as useGroupExport } from "./useExport-Bf91jMFP.js";
import { a as useGroupInvitationsQuery, c as useUpdateGroupMutation, i as useDeleteGroupMutation, l as useUpdateMemberRoleMutation, n as useCancelInvitationMutation, o as useInviteMemberMutation, s as useRemoveMemberMutation } from "./useGroups-v2WOXtpc.js";
import { Head, usePage } from "@inertiajs/react";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Clock, Crown, Download, Eye, Mail, Settings, Shield, Trash2, UserMinus, UserPlus, Users, X } from "lucide-react";
//#region resources/js/pages/Groups/Show.tsx
var ROLE_LABELS = {
	admin: "Admin",
	member: "Member",
	viewer: "Viewer"
};
function InviteMemberDialog({ open, onOpenChange, groupId }) {
	const [email, setEmail] = useState("");
	const [role, setRole] = useState("member");
	const [successMessage, setSuccessMessage] = useState("");
	const inviteMutation = useInviteMemberMutation();
	function handleSubmit(e) {
		e.preventDefault();
		if (!email.trim()) return;
		inviteMutation.mutate({
			groupId,
			email: email.trim(),
			role
		}, { onSuccess: (data) => {
			setSuccessMessage(data.message);
			setEmail("");
			setRole("member");
		} });
	}
	function handleClose() {
		setEmail("");
		setRole("member");
		setSuccessMessage("");
		inviteMutation.reset();
		onOpenChange(false);
	}
	return /* @__PURE__ */ jsx(Dialog, {
		open,
		onOpenChange: handleClose,
		children: /* @__PURE__ */ jsxs(DialogContent, { children: [/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, { children: "Invite Member" }), /* @__PURE__ */ jsx(DialogDescription, { children: "Enter the email address of the person you want to invite. They will receive an email with instructions to join the group." })] }), successMessage ? /* @__PURE__ */ jsxs("div", {
			className: "space-y-4",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "border-success/30 bg-success/5 flex items-start gap-3 rounded-lg border p-4",
				children: [/* @__PURE__ */ jsx(Mail, { className: "text-success mt-0.5 h-4 w-4 shrink-0" }), /* @__PURE__ */ jsx("p", {
					className: "text-text text-sm",
					children: successMessage
				})]
			}), /* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
				type: "button",
				variant: "outline",
				onClick: () => {
					setSuccessMessage("");
					inviteMutation.reset();
				},
				children: "Invite another"
			}), /* @__PURE__ */ jsx(Button, {
				type: "button",
				onClick: handleClose,
				children: "Done"
			})] })]
		}) : /* @__PURE__ */ jsxs("form", {
			onSubmit: handleSubmit,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ jsx(Input, {
					label: "Email address",
					type: "email",
					value: email,
					onChange: (e) => setEmail(e.target.value),
					placeholder: "colleague@example.com",
					autoFocus: true
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ jsx("label", {
						className: "text-text text-sm font-medium",
						children: "Role"
					}), /* @__PURE__ */ jsx("div", {
						className: "flex gap-2",
						children: [
							"admin",
							"member",
							"viewer"
						].map((r) => /* @__PURE__ */ jsx("button", {
							type: "button",
							onClick: () => setRole(r),
							className: cn("flex-1 rounded-lg border px-3 py-2 text-sm capitalize transition-colors", role === r ? "border-primary bg-primary/10 text-primary" : "border-border text-text-secondary hover:border-primary/50"),
							children: r
						}, r))
					})]
				}),
				inviteMutation.isError && /* @__PURE__ */ jsx("p", {
					className: "text-danger text-sm",
					children: inviteMutation.error?.response?.data?.message ?? "Something went wrong. Please try again."
				}),
				/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
					type: "button",
					variant: "ghost",
					onClick: handleClose,
					children: "Cancel"
				}), /* @__PURE__ */ jsx(Button, {
					type: "submit",
					disabled: !email.trim() || inviteMutation.isPending,
					children: inviteMutation.isPending ? "Sending..." : "Send Invitation"
				})] })
			]
		})] })
	});
}
function PendingInvitationItem({ invitation, groupId }) {
	const cancelMutation = useCancelInvitationMutation();
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center gap-3 rounded-lg px-3 py-2.5",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "bg-warning/10 flex h-8 w-8 items-center justify-center rounded-full",
				children: /* @__PURE__ */ jsx(Clock, { className: "text-warning h-4 w-4" })
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ jsx("p", {
					className: "text-text truncate text-sm font-medium",
					children: invitation.email
				}), /* @__PURE__ */ jsxs("p", {
					className: "text-text-tertiary text-xs",
					children: [
						ROLE_LABELS[invitation.role],
						" invite · expires",
						" ",
						new Date(invitation.expires_at).toLocaleDateString()
					]
				})]
			}),
			/* @__PURE__ */ jsx(Button, {
				variant: "ghost",
				size: "icon",
				className: "text-text-tertiary hover:text-danger h-7 w-7",
				onClick: () => cancelMutation.mutate({
					groupId,
					invitationId: invitation.id
				}),
				disabled: cancelMutation.isPending,
				title: "Cancel invitation",
				children: /* @__PURE__ */ jsx(X, { className: "h-3.5 w-3.5" })
			})
		]
	});
}
function EditGroupDialog({ open, onOpenChange, group }) {
	const [name, setName] = useState(group.name);
	const [description, setDescription] = useState(group.description ?? "");
	const updateMutation = useUpdateGroupMutation();
	function handleSubmit(e) {
		e.preventDefault();
		if (!name.trim()) return;
		updateMutation.mutate({
			id: group.id,
			name: name.trim(),
			description: description.trim() || void 0
		}, { onSuccess: () => {
			onOpenChange(false);
			window.location.reload();
		} });
	}
	return /* @__PURE__ */ jsx(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ jsxs(DialogContent, { children: [/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, { children: "Edit Group" }), /* @__PURE__ */ jsx(DialogDescription, { children: "Update the group name and description." })] }), /* @__PURE__ */ jsxs("form", {
			onSubmit: handleSubmit,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ jsx(Input, {
					label: "Group Name",
					value: name,
					onChange: (e) => setName(e.target.value),
					autoFocus: true
				}),
				/* @__PURE__ */ jsx(Input, {
					label: "Description (optional)",
					value: description,
					onChange: (e) => setDescription(e.target.value)
				}),
				/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
					type: "button",
					variant: "ghost",
					onClick: () => onOpenChange(false),
					children: "Cancel"
				}), /* @__PURE__ */ jsx(Button, {
					type: "submit",
					disabled: !name.trim() || updateMutation.isPending,
					children: updateMutation.isPending ? "Saving..." : "Save Changes"
				})] })
			]
		})] })
	});
}
function RoleBadge({ role, isOwner }) {
	if (isOwner) return /* @__PURE__ */ jsxs("span", {
		className: "bg-warning/10 text-warning flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
		children: [/* @__PURE__ */ jsx(Crown, { className: "h-2.5 w-2.5" }), "Owner"]
	});
	if (role === "admin") return /* @__PURE__ */ jsxs("span", {
		className: "bg-primary/10 text-primary flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
		children: [/* @__PURE__ */ jsx(Shield, { className: "h-2.5 w-2.5" }), "Admin"]
	});
	if (role === "viewer") return /* @__PURE__ */ jsxs("span", {
		className: "bg-bg-tertiary text-text-tertiary flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
		children: [/* @__PURE__ */ jsx(Eye, { className: "h-2.5 w-2.5" }), "Viewer"]
	});
	return null;
}
function MemberItem({ member, groupId, isOwner, canManage }) {
	const removeMemberMutation = useRemoveMemberMutation();
	const updateRoleMutation = useUpdateMemberRoleMutation();
	function handleRemove() {
		if (!confirm(`Remove ${member.name} from this group?`)) return;
		removeMemberMutation.mutate({
			groupId,
			userId: member.id
		}, { onSuccess: () => {
			window.location.reload();
		} });
	}
	function handleRoleChange(newRole) {
		updateRoleMutation.mutate({
			groupId,
			userId: member.id,
			role: newRole
		}, { onSuccess: () => {
			window.location.reload();
		} });
	}
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center gap-3 rounded-lg px-3 py-2.5",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium",
				children: member.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx("p", {
						className: "text-text truncate text-sm font-medium",
						children: member.name
					}), /* @__PURE__ */ jsx(RoleBadge, {
						role: member.pivot?.role,
						isOwner
					})]
				}), /* @__PURE__ */ jsx("p", {
					className: "text-text-tertiary truncate text-xs",
					children: member.email
				})]
			}),
			canManage && !isOwner && /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-1",
				children: [/* @__PURE__ */ jsxs("select", {
					value: member.pivot?.role ?? "member",
					onChange: (e) => handleRoleChange(e.target.value),
					disabled: updateRoleMutation.isPending,
					className: "border-border bg-bg text-text-secondary rounded px-1.5 py-0.5 text-xs",
					title: "Change role",
					children: [
						/* @__PURE__ */ jsx("option", {
							value: "admin",
							children: "Admin"
						}),
						/* @__PURE__ */ jsx("option", {
							value: "member",
							children: "Member"
						}),
						/* @__PURE__ */ jsx("option", {
							value: "viewer",
							children: "Viewer"
						})
					]
				}), /* @__PURE__ */ jsx(Button, {
					variant: "ghost",
					size: "icon",
					className: "text-text-tertiary hover:text-danger h-7 w-7",
					onClick: handleRemove,
					disabled: removeMemberMutation.isPending,
					children: /* @__PURE__ */ jsx(UserMinus, { className: "h-3.5 w-3.5" })
				})]
			})
		]
	});
}
function GroupsShow({ group, members, tasks }) {
	const { auth } = usePage().props;
	const [inviteMemberOpen, setInviteMemberOpen] = useState(false);
	const [editGroupOpen, setEditGroupOpen] = useState(false);
	const [selectedTask, setSelectedTask] = useState(null);
	const isCurrentUserOwner = auth.user.id === group.owner.id;
	const currentUserRole = group.current_user_role ?? "viewer";
	const canManageGroup = currentUserRole === "admin";
	const canManageTasks = currentUserRole === "admin" || currentUserRole === "member";
	const deleteGroupMutation = useDeleteGroupMutation();
	const { isPending: isExporting, mutate: requestExport } = useGroupExport(group.id);
	const { data: invitationsData } = useGroupInvitationsQuery(canManageGroup ? group.id : 0);
	const pendingInvitations = invitationsData?.data ?? [];
	function handleDeleteGroup() {
		if (!confirm("Are you sure you want to delete this group? This cannot be undone.")) return;
		deleteGroupMutation.mutate(group.id, { onSuccess: () => {
			window.location.href = "/groups";
		} });
	}
	return /* @__PURE__ */ jsxs(AuthenticatedLayout, {
		defaultGroupId: group.id,
		children: [
			/* @__PURE__ */ jsx(Head, { title: group.name }),
			/* @__PURE__ */ jsx("div", {
				className: "mb-6",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ jsx("div", {
							className: "bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full",
							children: /* @__PURE__ */ jsx(Users, { className: "text-primary h-5 w-5" })
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
							className: "text-text text-xl font-semibold",
							children: group.name
						}), group.description && /* @__PURE__ */ jsx("p", {
							className: "text-text-secondary text-sm",
							children: group.description
						})] })]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-1",
						children: [
							/* @__PURE__ */ jsxs(Button, {
								variant: "ghost",
								size: "sm",
								onClick: () => requestExport(),
								disabled: isExporting,
								title: "Export group tasks as CSV",
								className: "text-text-tertiary",
								children: [/* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), isExporting ? "Requesting…" : "Export CSV"]
							}),
							canManageGroup && /* @__PURE__ */ jsx(Button, {
								variant: "ghost",
								size: "icon",
								onClick: () => setEditGroupOpen(true),
								className: "text-text-tertiary",
								children: /* @__PURE__ */ jsx(Settings, { className: "h-4 w-4" })
							}),
							isCurrentUserOwner && /* @__PURE__ */ jsx(Button, {
								variant: "ghost",
								size: "icon",
								onClick: handleDeleteGroup,
								className: "text-text-tertiary hover:text-danger",
								disabled: deleteGroupMutation.isPending,
								children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mb-8",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "mb-3 flex items-center justify-between",
					children: [/* @__PURE__ */ jsxs("h2", {
						className: "text-text-secondary text-sm font-semibold",
						children: [
							"Members (",
							members.length,
							")"
						]
					}), canManageGroup && /* @__PURE__ */ jsxs(Button, {
						variant: "ghost",
						className: "text-text-secondary gap-1.5 text-xs",
						onClick: () => setInviteMemberOpen(true),
						children: [/* @__PURE__ */ jsx(UserPlus, { className: "h-3.5 w-3.5" }), "Invite Member"]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "border-border bg-bg space-y-0.5 rounded-lg border p-1",
					children: [members.map((member) => /* @__PURE__ */ jsx(MemberItem, {
						member,
						groupId: group.id,
						isOwner: member.id === group.owner.id,
						canManage: canManageGroup
					}, member.id)), pendingInvitations.map((invitation) => /* @__PURE__ */ jsx(PendingInvitationItem, {
						invitation,
						groupId: group.id
					}, invitation.id))]
				})]
			}),
			/* @__PURE__ */ jsx(Separator, { className: "mb-6" }),
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
				className: "text-text-secondary mb-3 text-sm font-semibold",
				children: "Shared Tasks"
			}), /* @__PURE__ */ jsx(TaskList, {
				tasks,
				emptyMessage: "No tasks shared with this group yet.",
				showProject: true,
				onSelectTask: setSelectedTask,
				readOnly: !canManageTasks
			})] }),
			/* @__PURE__ */ jsx(InviteMemberDialog, {
				open: inviteMemberOpen,
				onOpenChange: setInviteMemberOpen,
				groupId: group.id
			}),
			/* @__PURE__ */ jsx(EditGroupDialog, {
				open: editGroupOpen,
				onOpenChange: setEditGroupOpen,
				group
			}),
			/* @__PURE__ */ jsx(TaskDetailDialog, {
				task: selectedTask,
				open: !!selectedTask,
				onOpenChange: (open) => {
					if (!open) setSelectedTask(null);
				},
				readOnly: !canManageTasks
			})
		]
	});
}
//#endregion
export { GroupsShow as default };
