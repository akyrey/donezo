import { a as cn, i as Button } from "./wayfinder-C_mx6M06.js";
import { t as Input } from "./Input-BktEiBB2.js";
import { _ as DialogHeader, g as DialogFooter, h as DialogDescription, m as DialogContent, p as Dialog, t as AuthenticatedLayout, v as DialogTitle } from "./AuthenticatedLayout-BBEUssZw.js";
import { r as useCreateGroupMutation } from "./useGroups-v2WOXtpc.js";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { ChevronRight, Crown, Plus, Users } from "lucide-react";
//#region resources/js/pages/Groups/Index.tsx
function CreateGroupDialog({ open, onOpenChange }) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const createMutation = useCreateGroupMutation();
	function handleSubmit(e) {
		e.preventDefault();
		if (!name.trim()) return;
		createMutation.mutate({
			name: name.trim(),
			description: description.trim() || void 0
		}, { onSuccess: () => {
			setName("");
			setDescription("");
			onOpenChange(false);
			window.location.reload();
		} });
	}
	return /* @__PURE__ */ jsx(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ jsxs(DialogContent, { children: [/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, { children: "Create Group" }), /* @__PURE__ */ jsx(DialogDescription, { children: "Create a new group to collaborate with others on shared tasks." })] }), /* @__PURE__ */ jsxs("form", {
			onSubmit: handleSubmit,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ jsx(Input, {
					label: "Group Name",
					value: name,
					onChange: (e) => setName(e.target.value),
					placeholder: "e.g., Marketing Team",
					autoFocus: true
				}),
				/* @__PURE__ */ jsx(Input, {
					label: "Description (optional)",
					value: description,
					onChange: (e) => setDescription(e.target.value),
					placeholder: "What is this group for?"
				}),
				/* @__PURE__ */ jsxs(DialogFooter, { children: [/* @__PURE__ */ jsx(Button, {
					type: "button",
					variant: "ghost",
					onClick: () => onOpenChange(false),
					children: "Cancel"
				}), /* @__PURE__ */ jsx(Button, {
					type: "submit",
					disabled: !name.trim() || createMutation.isPending,
					children: createMutation.isPending ? "Creating..." : "Create Group"
				})] })
			]
		})] })
	});
}
function GroupsIndex({ groups }) {
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
		/* @__PURE__ */ jsx(Head, { title: "Groups" }),
		/* @__PURE__ */ jsxs("div", {
			className: "mb-6 flex items-center justify-between",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ jsx("div", {
					className: "bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg",
					children: /* @__PURE__ */ jsx(Users, { className: "text-primary h-5 w-5" })
				}), /* @__PURE__ */ jsx("h1", {
					className: "text-text text-xl font-semibold",
					children: "Groups"
				})]
			}), /* @__PURE__ */ jsxs(Button, {
				onClick: () => setCreateDialogOpen(true),
				className: "gap-2",
				children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), "New Group"]
			})]
		}),
		groups.length === 0 ? /* @__PURE__ */ jsxs("div", {
			className: "text-text-tertiary flex flex-col items-center justify-center py-16",
			children: [
				/* @__PURE__ */ jsx(Users, { className: "mb-3 h-12 w-12 stroke-1" }),
				/* @__PURE__ */ jsx("p", {
					className: "text-text-secondary text-sm font-medium",
					children: "No groups yet"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-1 text-xs",
					children: "Create a group to collaborate on tasks with others."
				}),
				/* @__PURE__ */ jsxs(Button, {
					className: "mt-4 gap-2",
					onClick: () => setCreateDialogOpen(true),
					children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), "Create your first group"]
				})
			]
		}) : /* @__PURE__ */ jsx("div", {
			className: "space-y-1",
			children: groups.map((group) => /* @__PURE__ */ jsxs(Link, {
				href: `/groups/${group.id}`,
				className: cn("flex items-center gap-4 rounded-lg px-4 py-3 transition-colors", "hover:bg-bg-secondary"),
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full",
						children: /* @__PURE__ */ jsx(Users, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("p", {
									className: "text-text truncate text-sm font-medium",
									children: group.name
								}), group.owner && /* @__PURE__ */ jsxs("span", {
									className: "text-text-tertiary flex items-center gap-0.5 text-xs",
									children: [/* @__PURE__ */ jsx(Crown, { className: "h-3 w-3" }), group.owner.name]
								})]
							}),
							group.description && /* @__PURE__ */ jsx("p", {
								className: "text-text-tertiary mt-0.5 truncate text-xs",
								children: group.description
							}),
							/* @__PURE__ */ jsxs("p", {
								className: "text-text-tertiary mt-0.5 text-xs",
								children: [
									group.member_count,
									" ",
									group.member_count === 1 ? "member" : "members"
								]
							})
						]
					}),
					/* @__PURE__ */ jsx(ChevronRight, { className: "text-text-tertiary h-4 w-4" })
				]
			}, group.id))
		}),
		/* @__PURE__ */ jsx(CreateGroupDialog, {
			open: createDialogOpen,
			onOpenChange: setCreateDialogOpen
		})
	] });
}
//#endregion
export { GroupsIndex as default };
