import { a as cn, i as Button, n as queryParams, t as applyUrlDefaults } from "./wayfinder-C_mx6M06.js";
import { t as Input } from "./Input-BktEiBB2.js";
import { S as DropdownMenuTrigger, b as DropdownMenuContent, d as useReorderTasksMutation, i as store, t as AuthenticatedLayout, u as useReorderHeadingsMutation, x as DropdownMenuItem, y as DropdownMenu } from "./AuthenticatedLayout-BBEUssZw.js";
import { t as axios_default } from "./axios-BY0CCud-.js";
import { n as TaskItem, t as TaskDetailDialog } from "./TaskDetailDialog-i5waCmjV.js";
import { r as useProjectExport } from "./useExport-Bf91jMFP.js";
import { Head, router, useForm } from "@inertiajs/react";
import { useMutation } from "@tanstack/react-query";
import React, { useCallback, useEffect, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { CheckCircle2, ChevronDown, ChevronRight, Download, FolderKanban, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { DndContext, DragOverlay, PointerSensor, TouchSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import * as Dialog from "@radix-ui/react-dialog";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import * as Collapsible from "@radix-ui/react-collapsible";
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
//#region resources/js/components/tasks/SortableTaskItem.tsx
function SortableTaskItem({ task, onSelect, showProject = false }) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: `task:${task.id}`,
		data: {
			type: "task",
			task
		}
	});
	return /* @__PURE__ */ jsx("div", {
		ref: setNodeRef,
		style: {
			transform: CSS.Transform.toString(transform),
			transition,
			opacity: isDragging ? .4 : void 0,
			position: "relative"
		},
		className: cn("touch-none select-none", !(task.status === "completed" || task.status === "cancelled") && "cursor-grab active:cursor-grabbing"),
		...attributes,
		...listeners,
		children: /* @__PURE__ */ jsx(TaskItem, {
			task,
			onSelect,
			showProject
		})
	});
}
//#endregion
//#region resources/js/components/projects/SortableHeading.tsx
function SortableHeading({ heading, taskCount: _taskCount, children }) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: `heading:${heading.id}`,
		data: {
			type: "heading",
			heading
		}
	});
	return /* @__PURE__ */ jsx("div", {
		ref: setNodeRef,
		style: {
			transform: CSS.Transform.toString(transform),
			transition,
			opacity: isDragging ? .4 : void 0
		},
		className: cn("cursor-grab touch-none select-none active:cursor-grabbing"),
		...attributes,
		...listeners,
		children
	});
}
//#endregion
//#region resources/js/routes/api/v1/headings/index.ts
/**
* @see \App\Http\Controllers\Api\V1\HeadingController::show
* @see Http/Controllers/Api/V1/HeadingController.php:67
* @route '/api/v1/headings/{heading}'
*/
var show = (args, options) => ({
	url: show.url(args, options),
	method: "get"
});
show.definition = {
	methods: ["get", "head"],
	url: "/api/v1/headings/{heading}"
};
/**
* @see \App\Http\Controllers\Api\V1\HeadingController::show
* @see Http/Controllers/Api/V1/HeadingController.php:67
* @route '/api/v1/headings/{heading}'
*/
show.url = (args, options) => {
	if (typeof args === "string" || typeof args === "number") args = { heading: args };
	if (typeof args === "object" && !Array.isArray(args) && "id" in args) args = { heading: args.id };
	if (Array.isArray(args)) args = { heading: args[0] };
	args = applyUrlDefaults(args);
	const parsedArgs = { heading: typeof args.heading === "object" ? args.heading.id : args.heading };
	return show.definition.url.replace("{heading}", parsedArgs.heading.toString()).replace(/\/+$/, "") + queryParams(options);
};
/**
* @see \App\Http\Controllers\Api\V1\HeadingController::show
* @see Http/Controllers/Api/V1/HeadingController.php:67
* @route '/api/v1/headings/{heading}'
*/
show.get = (args, options) => ({
	url: show.url(args, options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Api\V1\HeadingController::show
* @see Http/Controllers/Api/V1/HeadingController.php:67
* @route '/api/v1/headings/{heading}'
*/
show.head = (args, options) => ({
	url: show.url(args, options),
	method: "head"
});
/**
* @see \App\Http\Controllers\Api\V1\HeadingController::update
* @see Http/Controllers/Api/V1/HeadingController.php:81
* @route '/api/v1/headings/{heading}'
*/
var update = (args, options) => ({
	url: update.url(args, options),
	method: "put"
});
update.definition = {
	methods: ["put", "patch"],
	url: "/api/v1/headings/{heading}"
};
/**
* @see \App\Http\Controllers\Api\V1\HeadingController::update
* @see Http/Controllers/Api/V1/HeadingController.php:81
* @route '/api/v1/headings/{heading}'
*/
update.url = (args, options) => {
	if (typeof args === "string" || typeof args === "number") args = { heading: args };
	if (typeof args === "object" && !Array.isArray(args) && "id" in args) args = { heading: args.id };
	if (Array.isArray(args)) args = { heading: args[0] };
	args = applyUrlDefaults(args);
	const parsedArgs = { heading: typeof args.heading === "object" ? args.heading.id : args.heading };
	return update.definition.url.replace("{heading}", parsedArgs.heading.toString()).replace(/\/+$/, "") + queryParams(options);
};
/**
* @see \App\Http\Controllers\Api\V1\HeadingController::update
* @see Http/Controllers/Api/V1/HeadingController.php:81
* @route '/api/v1/headings/{heading}'
*/
update.put = (args, options) => ({
	url: update.url(args, options),
	method: "put"
});
/**
* @see \App\Http\Controllers\Api\V1\HeadingController::update
* @see Http/Controllers/Api/V1/HeadingController.php:81
* @route '/api/v1/headings/{heading}'
*/
update.patch = (args, options) => ({
	url: update.url(args, options),
	method: "patch"
});
/**
* @see \App\Http\Controllers\Api\V1\HeadingController::destroy
* @see Http/Controllers/Api/V1/HeadingController.php:103
* @route '/api/v1/headings/{heading}'
*/
var destroy$1 = (args, options) => ({
	url: destroy$1.url(args, options),
	method: "delete"
});
destroy$1.definition = {
	methods: ["delete"],
	url: "/api/v1/headings/{heading}"
};
/**
* @see \App\Http\Controllers\Api\V1\HeadingController::destroy
* @see Http/Controllers/Api/V1/HeadingController.php:103
* @route '/api/v1/headings/{heading}'
*/
destroy$1.url = (args, options) => {
	if (typeof args === "string" || typeof args === "number") args = { heading: args };
	if (typeof args === "object" && !Array.isArray(args) && "id" in args) args = { heading: args.id };
	if (Array.isArray(args)) args = { heading: args[0] };
	args = applyUrlDefaults(args);
	const parsedArgs = { heading: typeof args.heading === "object" ? args.heading.id : args.heading };
	return destroy$1.definition.url.replace("{heading}", parsedArgs.heading.toString()).replace(/\/+$/, "") + queryParams(options);
};
/**
* @see \App\Http\Controllers\Api\V1\HeadingController::destroy
* @see Http/Controllers/Api/V1/HeadingController.php:103
* @route '/api/v1/headings/{heading}'
*/
destroy$1.delete = (args, options) => ({
	url: destroy$1.url(args, options),
	method: "delete"
});
/**
* @see \App\Http\Controllers\Api\V1\HeadingController::reorder
* @see Http/Controllers/Api/V1/HeadingController.php:123
* @route '/api/v1/headings/reorder'
*/
var reorder = (options) => ({
	url: reorder.url(options),
	method: "post"
});
reorder.definition = {
	methods: ["post"],
	url: "/api/v1/headings/reorder"
};
/**
* @see \App\Http\Controllers\Api\V1\HeadingController::reorder
* @see Http/Controllers/Api/V1/HeadingController.php:123
* @route '/api/v1/headings/reorder'
*/
reorder.url = (options) => {
	return reorder.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Api\V1\HeadingController::reorder
* @see Http/Controllers/Api/V1/HeadingController.php:123
* @route '/api/v1/headings/reorder'
*/
reorder.post = (options) => ({
	url: reorder.url(options),
	method: "post"
});
Object.assign(show, show), Object.assign(update, update), Object.assign(destroy$1, destroy$1), Object.assign(reorder, reorder);
//#endregion
//#region resources/js/hooks/useHeadings.ts
function useRenameHeadingMutation() {
	return useMutation({
		mutationFn: async ({ id, name }) => {
			return (await axios_default.put(update.url(id), { name })).data.data;
		},
		onSuccess: () => {
			router.reload();
		}
	});
}
//#endregion
//#region resources/js/routes/headings/index.ts
/**
* @see \App\Http\Controllers\Web\HeadingController::destroy
* @see Http/Controllers/Web/HeadingController.php:43
* @route '/headings/{heading}'
*/
var destroy = (args, options) => ({
	url: destroy.url(args, options),
	method: "delete"
});
destroy.definition = {
	methods: ["delete"],
	url: "/headings/{heading}"
};
/**
* @see \App\Http\Controllers\Web\HeadingController::destroy
* @see Http/Controllers/Web/HeadingController.php:43
* @route '/headings/{heading}'
*/
destroy.url = (args, options) => {
	if (typeof args === "string" || typeof args === "number") args = { heading: args };
	if (typeof args === "object" && !Array.isArray(args) && "id" in args) args = { heading: args.id };
	if (Array.isArray(args)) args = { heading: args[0] };
	args = applyUrlDefaults(args);
	const parsedArgs = { heading: typeof args.heading === "object" ? args.heading.id : args.heading };
	return destroy.definition.url.replace("{heading}", parsedArgs.heading.toString()).replace(/\/+$/, "") + queryParams(options);
};
/**
* @see \App\Http\Controllers\Web\HeadingController::destroy
* @see Http/Controllers/Web/HeadingController.php:43
* @route '/headings/{heading}'
*/
destroy.delete = (args, options) => ({
	url: destroy.url(args, options),
	method: "delete"
});
Object.assign(destroy, destroy);
//#endregion
//#region resources/js/pages/Projects/Show.tsx
/** Virtual container ID for tasks not assigned to any heading. */
var UNASSIGNED_CONTAINER = "unassigned";
function getContainerForTask(task) {
	return task.heading_id ? `heading:${task.heading_id}` : UNASSIGNED_CONTAINER;
}
function AddHeadingDialog({ projectId, open, onOpenChange }) {
	const { data, setData, post, processing, errors, reset } = useForm({ name: "" });
	const submit = (e) => {
		e.preventDefault();
		post(store.url(projectId), { onSuccess: () => {
			reset();
			onOpenChange(false);
		} });
	};
	return /* @__PURE__ */ jsx(Dialog.Root, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ jsxs(Dialog.Portal, { children: [/* @__PURE__ */ jsx(Dialog.Overlay, { className: "data-[state=open]:animate-in data-[state=open]:fade-in-0 fixed inset-0 bg-black/40" }), /* @__PURE__ */ jsxs(Dialog.Content, {
			className: "border-border bg-bg text-text data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-6 shadow-lg focus:outline-none",
			children: [
				/* @__PURE__ */ jsx(Dialog.Title, {
					className: "text-text text-lg font-semibold",
					children: "New Heading"
				}),
				/* @__PURE__ */ jsx(Dialog.Description, {
					className: "text-text-secondary mt-1 text-sm",
					children: "Add a heading to organize tasks in this project."
				}),
				/* @__PURE__ */ jsxs("form", {
					onSubmit: submit,
					className: "mt-6 space-y-4",
					children: [/* @__PURE__ */ jsx(Input, {
						label: "Heading name",
						value: data.name,
						onChange: (e) => setData("name", e.target.value),
						error: errors.name,
						placeholder: "e.g., Phase 1",
						autoFocus: true
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex justify-end gap-3 pt-2",
						children: [/* @__PURE__ */ jsx(Dialog.Close, {
							asChild: true,
							children: /* @__PURE__ */ jsx(Button, {
								type: "button",
								variant: "ghost",
								children: "Cancel"
							})
						}), /* @__PURE__ */ jsx(Button, {
							type: "submit",
							disabled: processing,
							children: processing ? "Adding..." : "Add Heading"
						})]
					})]
				})
			]
		})] })
	});
}
function RenameHeadingDialog({ heading, open, onOpenChange }) {
	const [name, setName] = useState(heading.name);
	const [localError, setLocalError] = useState();
	const renameMutation = useRenameHeadingMutation();
	useEffect(() => {
		if (open) {
			setName(heading.name);
			setLocalError(void 0);
			renameMutation.reset();
		}
	}, [open, heading.name]);
	function handleSubmit(e) {
		e.preventDefault();
		const trimmed = name.trim();
		if (!trimmed) {
			setLocalError("Name is required.");
			return;
		}
		setLocalError(void 0);
		renameMutation.mutate({
			id: heading.id,
			name: trimmed
		}, { onSuccess: () => onOpenChange(false) });
	}
	return /* @__PURE__ */ jsx(Dialog.Root, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ jsxs(Dialog.Portal, { children: [/* @__PURE__ */ jsx(Dialog.Overlay, { className: "data-[state=open]:animate-in data-[state=open]:fade-in-0 fixed inset-0 bg-black/40" }), /* @__PURE__ */ jsxs(Dialog.Content, {
			className: "border-border bg-bg text-text data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-6 shadow-lg focus:outline-none",
			children: [
				/* @__PURE__ */ jsx(Dialog.Title, {
					className: "text-text text-lg font-semibold",
					children: "Rename Heading"
				}),
				/* @__PURE__ */ jsx(Dialog.Description, {
					className: "text-text-secondary mt-1 text-sm",
					children: "Enter a new name for this heading."
				}),
				/* @__PURE__ */ jsxs("form", {
					onSubmit: handleSubmit,
					className: "mt-6 space-y-4",
					children: [/* @__PURE__ */ jsx(Input, {
						label: "Heading name",
						value: name,
						onChange: (e) => setName(e.target.value),
						error: localError,
						autoFocus: true
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex justify-end gap-3 pt-2",
						children: [/* @__PURE__ */ jsx(Dialog.Close, {
							asChild: true,
							children: /* @__PURE__ */ jsx(Button, {
								type: "button",
								variant: "ghost",
								children: "Cancel"
							})
						}), /* @__PURE__ */ jsx(Button, {
							type: "submit",
							disabled: renameMutation.isPending,
							children: renameMutation.isPending ? "Saving..." : "Save"
						})]
					})]
				})
			]
		})] })
	});
}
function HeadingRow({ heading, taskCount }) {
	const { delete: destroy$2, processing: deleting } = useForm({});
	const [renameOpen, setRenameOpen] = useState(false);
	function handleDelete() {
		destroy$2(destroy.url(heading.id));
	}
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("div", {
		className: "group mb-3 flex w-full items-center gap-2",
		children: [/* @__PURE__ */ jsx(Collapsible.Trigger, {
			asChild: true,
			children: /* @__PURE__ */ jsxs("button", {
				className: "flex min-w-0 flex-1 items-center gap-2 text-left",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "text-text-secondary text-sm font-semibold tracking-wide uppercase",
					children: heading.name
				}), taskCount > 0 && /* @__PURE__ */ jsx("span", {
					className: "bg-bg-secondary text-text-tertiary rounded-full px-2 py-0.5 text-xs",
					children: taskCount
				})]
			})
		}), /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
			asChild: true,
			children: /* @__PURE__ */ jsx("button", {
				className: "hover:bg-bg-tertiary rounded p-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none",
				"aria-label": "Heading options",
				onClick: (e) => e.stopPropagation(),
				children: /* @__PURE__ */ jsx(MoreHorizontal, { className: "text-text-tertiary h-4 w-4" })
			})
		}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
			align: "end",
			children: [/* @__PURE__ */ jsxs(DropdownMenuItem, {
				onSelect: () => setRenameOpen(true),
				children: [/* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }), "Rename heading"]
			}), /* @__PURE__ */ jsxs(DropdownMenuItem, {
				className: "text-danger focus:text-danger",
				disabled: deleting,
				onSelect: handleDelete,
				children: [/* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }), "Delete heading"]
			})]
		})] })]
	}), /* @__PURE__ */ jsx(RenameHeadingDialog, {
		heading,
		open: renameOpen,
		onOpenChange: setRenameOpen
	})] });
}
function CompletedTasksSection({ tasks, onSelect }) {
	if (tasks.length === 0) return null;
	return /* @__PURE__ */ jsx("div", {
		className: "border-border mt-2 border-t pt-2",
		children: /* @__PURE__ */ jsx("div", {
			className: "space-y-0.5",
			children: tasks.map((task) => /* @__PURE__ */ jsx(TaskItem, {
				task,
				onSelect
			}, task.id))
		})
	});
}
function ProjectShow({ project, tasks: initialTasks, completed_tasks: initialCompletedTasks, headings: initialHeadings }) {
	const [headingDialogOpen, setHeadingDialogOpen] = useState(false);
	const [selectedTask, setSelectedTask] = useState(null);
	const [showCompleted, setShowCompleted] = useState(false);
	const [tasks, setTasks] = useState(initialTasks);
	const [headings, setHeadings] = useState(initialHeadings);
	const [activeTask, setActiveTask] = useState(null);
	const [activeHeading, setActiveHeading] = useState(null);
	const serverTasksKey = initialTasks.map((t) => `${t.id}:${t.position}:${t.heading_id ?? ""}:${t.updated_at}`).join(",");
	const serverHeadingsKey = initialHeadings.map((h) => `${h.id}:${h.position}:${h.name}`).join(",");
	React.useEffect(() => {
		setTasks(initialTasks);
	}, [serverTasksKey]);
	React.useEffect(() => {
		setHeadings(initialHeadings);
	}, [serverHeadingsKey]);
	const reorderTasksMutation = useReorderTasksMutation();
	const reorderHeadingsMutation = useReorderHeadingsMutation();
	const { isPending: isExporting, mutate: requestExport } = useProjectExport(project.id);
	const totalTasks = project.task_count ?? 0;
	const completedTasks = project.completed_task_count ?? 0;
	const progress = totalTasks > 0 ? completedTasks / totalTasks * 100 : 0;
	const unassignedTasks = tasks.filter((t) => !t.heading_id);
	const tasksByHeading = useCallback((headingId) => tasks.filter((t) => t.heading_id === headingId), [tasks]);
	const completedUnassigned = initialCompletedTasks.filter((t) => !t.heading_id);
	const completedByHeading = useCallback((headingId) => initialCompletedTasks.filter((t) => t.heading_id === headingId), [initialCompletedTasks]);
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }), useSensor(TouchSensor, { activationConstraint: {
		delay: 200,
		tolerance: 5
	} }));
	function handleDragStart(event) {
		const { active } = event;
		const id = String(active.id);
		if (id.startsWith("task:")) {
			setActiveTask(tasks.find((t) => `task:${t.id}` === id) ?? null);
			setActiveHeading(null);
		} else if (id.startsWith("heading:")) {
			setActiveHeading(headings.find((h) => `heading:${h.id}` === id) ?? null);
			setActiveTask(null);
		}
	}
	function handleDragOver(event) {
		const { active, over } = event;
		if (!over) return;
		const activeId = String(active.id);
		const overId = String(over.id);
		if (!activeId.startsWith("task:")) return;
		const activeTaskObj = tasks.find((t) => `task:${t.id}` === activeId);
		if (!activeTaskObj) return;
		let targetContainer;
		if (overId === UNASSIGNED_CONTAINER || overId.startsWith("heading:")) targetContainer = overId;
		else if (overId.startsWith("task:")) {
			const overTask = tasks.find((t) => `task:${t.id}` === overId);
			if (!overTask) return;
			targetContainer = getContainerForTask(overTask);
		} else return;
		if (getContainerForTask(activeTaskObj) === targetContainer) return;
		const newHeadingId = targetContainer === UNASSIGNED_CONTAINER ? null : Number(targetContainer.replace("heading:", ""));
		setTasks((prev) => prev.map((t) => t.id === activeTaskObj.id ? {
			...t,
			heading_id: newHeadingId
		} : t));
	}
	function handleDragEnd(event) {
		const { active, over } = event;
		setActiveTask(null);
		setActiveHeading(null);
		if (!over) return;
		const activeId = String(active.id);
		const overId = String(over.id);
		if (activeId.startsWith("heading:") && overId.startsWith("heading:")) {
			const oldIndex = headings.findIndex((h) => `heading:${h.id}` === activeId);
			const newIndex = headings.findIndex((h) => `heading:${h.id}` === overId);
			if (oldIndex === newIndex) return;
			const newHeadings = arrayMove(headings, oldIndex, newIndex);
			setHeadings(newHeadings);
			reorderHeadingsMutation.mutate(newHeadings.map((h, i) => ({
				id: h.id,
				position: i
			})));
			return;
		}
		if (!activeId.startsWith("task:")) return;
		if (!tasks.find((t) => `task:${t.id}` === activeId)) return;
		let targetContainer;
		if (overId === UNASSIGNED_CONTAINER || overId.startsWith("heading:")) targetContainer = overId;
		else if (overId.startsWith("task:")) {
			const overTask = tasks.find((t) => `task:${t.id}` === overId);
			if (!overTask) return;
			targetContainer = getContainerForTask(overTask);
		} else return;
		const newHeadingId = targetContainer === UNASSIGNED_CONTAINER ? null : Number(targetContainer.replace("heading:", ""));
		const containerTasks = newHeadingId === null ? tasks.filter((t) => !t.heading_id) : tasks.filter((t) => t.heading_id === newHeadingId);
		const oldIndex = containerTasks.findIndex((t) => `task:${t.id}` === activeId);
		let overIndex;
		if (overId.startsWith("task:")) overIndex = containerTasks.findIndex((t) => `task:${t.id}` === overId);
		else overIndex = containerTasks.length - 1;
		if (oldIndex === -1) {
			const reorderPayload = tasks.map((t, i) => ({
				id: t.id,
				position: i,
				heading_id: t.heading_id
			}));
			reorderTasksMutation.mutate(reorderPayload);
			return;
		}
		let newContainerTasks = containerTasks;
		if (oldIndex !== overIndex && overIndex !== -1) newContainerTasks = arrayMove(containerTasks, oldIndex, overIndex);
		const finalTasks = [...tasks.filter((t) => {
			if (newHeadingId === null) return !!t.heading_id;
			return t.heading_id !== newHeadingId;
		}), ...newContainerTasks];
		setTasks(finalTasks);
		const reorderPayload = finalTasks.map((t, i) => ({
			id: t.id,
			position: i,
			heading_id: t.heading_id
		}));
		reorderTasksMutation.mutate(reorderPayload);
	}
	return /* @__PURE__ */ jsxs(AuthenticatedLayout, {
		taskContext: "project",
		defaultProjectId: project.id,
		children: [
			/* @__PURE__ */ jsx(Head, { title: project.name }),
			/* @__PURE__ */ jsxs("div", {
				className: "mx-auto max-w-2xl px-4 py-8",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "mb-8",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "mb-4 flex items-start gap-3",
								children: [/* @__PURE__ */ jsx("div", {
									className: "bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl",
									children: /* @__PURE__ */ jsx(FolderKanban, { className: "text-primary h-5 w-5" })
								}), /* @__PURE__ */ jsx("div", {
									className: "flex-1",
									children: /* @__PURE__ */ jsx("h1", {
										className: "text-text text-2xl font-semibold",
										children: project.name
									})
								})]
							}),
							project.description && /* @__PURE__ */ jsx("div", {
								className: "prose prose-sm text-text-secondary mb-6 max-w-none",
								children: /* @__PURE__ */ jsx(ReactMarkdown, {
									remarkPlugins: [remarkGfm],
									children: project.description
								})
							}),
							totalTasks > 0 && /* @__PURE__ */ jsxs("div", {
								className: "mb-6",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "text-text-secondary mb-1.5 flex items-center justify-between text-xs",
									children: [/* @__PURE__ */ jsxs("span", { children: [
										completedTasks,
										" of ",
										totalTasks,
										" completed"
									] }), /* @__PURE__ */ jsxs("span", { children: [Math.round(progress), "%"] })]
								}), /* @__PURE__ */ jsx("div", {
									className: "bg-bg-tertiary h-1.5 w-full overflow-hidden rounded-full",
									children: /* @__PURE__ */ jsx("div", {
										className: "bg-primary h-full rounded-full transition-all duration-300",
										style: { width: `${progress}%` }
									})
								})]
							}),
							initialCompletedTasks.length > 0 && /* @__PURE__ */ jsxs("button", {
								onClick: () => setShowCompleted((v) => !v),
								className: "text-text-secondary hover:text-text flex items-center gap-1.5 text-sm transition-colors",
								children: [
									showCompleted ? /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" }),
									/* @__PURE__ */ jsx(CheckCircle2, { className: "text-success h-4 w-4" }),
									showCompleted ? "Hide" : "Show",
									" completed (",
									initialCompletedTasks.length,
									")"
								]
							})
						]
					}),
					/* @__PURE__ */ jsxs(DndContext, {
						sensors,
						collisionDetection: closestCenter,
						onDragStart: handleDragStart,
						onDragOver: handleDragOver,
						onDragEnd: handleDragEnd,
						children: [/* @__PURE__ */ jsxs("div", {
							className: "space-y-8",
							children: [(unassignedTasks.length > 0 || headings.length === 0 || showCompleted && completedUnassigned.length > 0) && /* @__PURE__ */ jsxs("section", { children: [
								headings.length > 0 && /* @__PURE__ */ jsx("h2", {
									className: "text-text-tertiary mb-3 text-xs font-semibold tracking-wide uppercase",
									children: "Unassigned"
								}),
								/* @__PURE__ */ jsx(SortableContext, {
									id: UNASSIGNED_CONTAINER,
									items: unassignedTasks.map((t) => `task:${t.id}`),
									strategy: verticalListSortingStrategy,
									children: /* @__PURE__ */ jsx("div", {
										className: "space-y-0.5",
										children: unassignedTasks.map((task) => /* @__PURE__ */ jsx(SortableTaskItem, {
											task,
											onSelect: setSelectedTask
										}, task.id))
									})
								}),
								showCompleted && /* @__PURE__ */ jsx(CompletedTasksSection, {
									tasks: completedUnassigned,
									onSelect: setSelectedTask
								})
							] }), /* @__PURE__ */ jsx(SortableContext, {
								items: headings.map((h) => `heading:${h.id}`),
								strategy: verticalListSortingStrategy,
								children: headings.map((heading) => {
									const headingTasks = tasksByHeading(heading.id);
									const headingCompletedTasks = completedByHeading(heading.id);
									return /* @__PURE__ */ jsx(Collapsible.Root, {
										defaultOpen: true,
										children: /* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx(SortableHeading, {
											heading,
											taskCount: headingTasks.length,
											children: /* @__PURE__ */ jsx(HeadingRow, {
												heading,
												taskCount: headingTasks.length
											})
										}), /* @__PURE__ */ jsxs(Collapsible.Content, { children: [/* @__PURE__ */ jsx(SortableContext, {
											id: `heading:${heading.id}`,
											items: headingTasks.map((t) => `task:${t.id}`),
											strategy: verticalListSortingStrategy,
											children: headingTasks.length > 0 ? /* @__PURE__ */ jsx("div", {
												className: "space-y-0.5",
												children: headingTasks.map((task) => /* @__PURE__ */ jsx(SortableTaskItem, {
													task,
													onSelect: setSelectedTask
												}, task.id))
											}) : !showCompleted || headingCompletedTasks.length === 0 ? /* @__PURE__ */ jsx("p", {
												className: "text-text-tertiary py-4 text-center text-sm",
												children: "No tasks in this section"
											}) : null
										}), showCompleted && /* @__PURE__ */ jsx(CompletedTasksSection, {
											tasks: headingCompletedTasks,
											onSelect: setSelectedTask
										})] })] })
									}, heading.id);
								})
							})]
						}), /* @__PURE__ */ jsxs(DragOverlay, {
							dropAnimation: null,
							children: [activeTask && /* @__PURE__ */ jsx("div", {
								className: "border-border bg-bg rounded-lg border opacity-95 shadow-lg",
								children: /* @__PURE__ */ jsx(TaskItem, { task: activeTask })
							}), activeHeading && /* @__PURE__ */ jsx("div", {
								className: "border-border bg-bg rounded-lg border px-3 py-2 opacity-95 shadow-lg",
								children: /* @__PURE__ */ jsx("span", {
									className: "text-text-secondary text-sm font-semibold tracking-wide uppercase",
									children: activeHeading.name
								})
							})]
						})]
					}),
					totalTasks === 0 && headings.length === 0 && /* @__PURE__ */ jsxs("div", {
						className: "flex flex-col items-center justify-center py-20 text-center",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "bg-bg-secondary mb-4 flex h-16 w-16 items-center justify-center rounded-full",
								children: /* @__PURE__ */ jsx(FolderKanban, { className: "text-text-tertiary h-8 w-8" })
							}),
							/* @__PURE__ */ jsx("h2", {
								className: "text-text text-lg font-medium",
								children: "This project is empty"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-text-secondary mt-1 text-sm",
								children: "Add tasks to get started."
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "border-border mt-6 flex items-center justify-between border-t pt-4",
						children: [/* @__PURE__ */ jsxs(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => setHeadingDialogOpen(true),
							children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), "Add Heading"]
						}), /* @__PURE__ */ jsxs(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => requestExport(),
							disabled: isExporting,
							title: "Export project tasks as CSV",
							children: [/* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), isExporting ? "Requesting…" : "Export CSV"]
						})]
					}),
					/* @__PURE__ */ jsx(AddHeadingDialog, {
						projectId: project.id,
						open: headingDialogOpen,
						onOpenChange: setHeadingDialogOpen
					})
				]
			}),
			/* @__PURE__ */ jsx(TaskDetailDialog, {
				task: selectedTask,
				open: !!selectedTask,
				onOpenChange: (open) => {
					if (!open) setSelectedTask(null);
				}
			})
		]
	});
}
//#endregion
export { ProjectShow as default };
