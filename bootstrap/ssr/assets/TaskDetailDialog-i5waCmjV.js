import { a as cn, i as Button } from "./wayfinder-C_mx6M06.js";
import { _ as DialogHeader, a as useSectionsQuery, c as useCompleteTaskMutation, f as useToggleChecklistItemMutation, g as DialogFooter, h as DialogDescription, l as useDeleteTaskMutation, m as DialogContent, o as TaskForm, p as Dialog, s as useTagsQuery, v as DialogTitle } from "./AuthenticatedLayout-BBEUssZw.js";
import { t as Checkbox } from "./Checkbox-Bar4Ffhq.js";
import { t as Badge } from "./Badge-C_622rLo.js";
import { usePage } from "@inertiajs/react";
import * as React$1 from "react";
import { useEffect, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { ArrowRight, Bell, Calendar, CalendarCheck, CheckSquare, Clock, Folder, Pencil, Sun, Tag, Trash2 } from "lucide-react";
import { format } from "date-fns";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
//#region resources/js/components/ui/Tooltip.tsx
var TooltipProvider = TooltipPrimitive.Provider;
var Tooltip = TooltipPrimitive.Root;
var TooltipTrigger = TooltipPrimitive.Trigger;
var TooltipContent = React$1.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(TooltipPrimitive.Portal, { children: /* @__PURE__ */ jsx(TooltipPrimitive.Content, {
	ref,
	sideOffset,
	className: cn("bg-text text-bg z-50 overflow-hidden rounded-md px-3 py-1.5 text-xs shadow-md", "animate-in fade-in-0 zoom-in-95", "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95", "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2", "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className),
	...props
}) }));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
//#endregion
//#region resources/js/components/tasks/MarkdownContent.tsx
function MarkdownContent({ content, className, inline = false }) {
	if (inline) return /* @__PURE__ */ jsx("div", {
		className: cn("inline", className),
		children: /* @__PURE__ */ jsx(ReactMarkdown, {
			remarkPlugins: [remarkGfm],
			components: { p: ({ children }) => /* @__PURE__ */ jsx("span", { children }) },
			children: content
		})
	});
	return /* @__PURE__ */ jsx("div", {
		className: cn("prose prose-sm max-w-none", "prose-headings:text-text prose-headings:font-semibold", "prose-p:text-text-secondary prose-p:leading-relaxed", "prose-a:text-primary prose-a:no-underline hover:prose-a:underline", "prose-strong:text-text prose-strong:font-semibold", "prose-code:rounded prose-code:bg-bg-tertiary prose-code:px-1 prose-code:py-0.5 prose-code:text-xs prose-code:font-normal prose-code:text-text", "prose-pre:rounded-lg prose-pre:bg-bg-tertiary", "prose-ul:text-text-secondary prose-ol:text-text-secondary", "prose-li:marker:text-text-tertiary", "prose-blockquote:border-l-primary prose-blockquote:text-text-secondary", "prose-hr:border-border", className),
		children: /* @__PURE__ */ jsx(ReactMarkdown, {
			remarkPlugins: [remarkGfm],
			children: content
		})
	});
}
//#endregion
//#region resources/js/components/tasks/TaskItem.tsx
function TaskItem({ task, onSelect, showProject = false, readOnly = false }) {
	const [isHovered, setIsHovered] = useState(false);
	const [isCompleting, setIsCompleting] = useState(false);
	const completeMutation = useCompleteTaskMutation();
	const deleteMutation = useDeleteTaskMutation();
	const isCompleted = task.status === "completed";
	function handleComplete(e) {
		e.stopPropagation();
		if (!isCompleted) {
			setIsCompleting(true);
			setTimeout(() => {
				completeMutation.mutate({
					id: task.id,
					completed: true
				}, { onSuccess: () => {
					window.dispatchEvent(new CustomEvent("task-completed", { detail: {
						id: task.id,
						title: task.title
					} }));
				} });
			}, 350);
		} else completeMutation.mutate({
			id: task.id,
			completed: false
		});
	}
	function handleDelete(e) {
		e.stopPropagation();
		deleteMutation.mutate(task.id);
	}
	return /* @__PURE__ */ jsxs("div", {
		className: cn("group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-all duration-150", "hover:bg-bg-secondary", "cursor-pointer", "animate-task-slide-in", isCompleted && "opacity-50", isCompleting && "animate-task-complete"),
		onMouseEnter: () => setIsHovered(true),
		onMouseLeave: () => setIsHovered(false),
		onClick: () => onSelect?.(task),
		role: "button",
		tabIndex: 0,
		onKeyDown: (e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				onSelect?.(task);
			}
		},
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "mt-0.5",
				onClick: readOnly ? void 0 : handleComplete,
				children: /* @__PURE__ */ jsx(Checkbox, {
					checked: isCompleted,
					disabled: readOnly
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ jsx("div", {
					className: cn("text-text text-sm font-medium", isCompleted && "text-text-tertiary line-through"),
					children: /* @__PURE__ */ jsx(MarkdownContent, {
						content: task.title,
						inline: true
					})
				}), /* @__PURE__ */ jsxs("div", {
					className: "text-text-tertiary mt-1 flex items-center gap-2 text-xs",
					children: [
						task.scheduled_at && /* @__PURE__ */ jsxs("span", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ jsx(Calendar, { className: "h-3 w-3" }), format(new Date(task.scheduled_at), "MMM d")]
						}),
						task.deadline_at && /* @__PURE__ */ jsxs("span", {
							className: "text-warning flex items-center gap-1",
							children: [
								/* @__PURE__ */ jsx(Calendar, { className: "h-3 w-3" }),
								"Due ",
								format(new Date(task.deadline_at), "MMM d")
							]
						}),
						task.is_evening && /* @__PURE__ */ jsxs("span", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ jsx(Sun, { className: "h-3 w-3" }), "Evening"]
						}),
						showProject && task.project_id && /* @__PURE__ */ jsxs("span", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ jsx(Folder, { className: "h-3 w-3" }), "Project"]
						}),
						task.tags && task.tags.length > 0 && /* @__PURE__ */ jsx("div", {
							className: "flex items-center gap-1",
							children: task.tags.map((tag) => /* @__PURE__ */ jsxs("span", {
								className: "inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium",
								style: {
									backgroundColor: tag.color || "#9ca3af",
									color: "#fff"
								},
								children: ["#", tag.name]
							}, tag.id))
						}),
						task.checklist_items && task.checklist_items.length > 0 && /* @__PURE__ */ jsxs("span", {
							className: "text-text-tertiary",
							children: [
								task.checklist_items.filter((i) => i.is_completed).length,
								"/",
								task.checklist_items.length
							]
						}),
						task.google_calendar_event_id && /* @__PURE__ */ jsx(TooltipProvider, {
							delayDuration: 300,
							children: /* @__PURE__ */ jsxs(Tooltip, { children: [/* @__PURE__ */ jsx(TooltipTrigger, {
								asChild: true,
								children: /* @__PURE__ */ jsx("span", {
									className: "text-primary/70 flex items-center gap-1",
									children: /* @__PURE__ */ jsx(CalendarCheck, { className: "h-3 w-3" })
								})
							}), /* @__PURE__ */ jsx(TooltipContent, { children: "Synced to Google Calendar" })] })
						}),
						task.assignee && /* @__PURE__ */ jsx("span", {
							className: "bg-primary/10 text-primary ml-auto flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-medium",
							title: `Assigned to ${task.assignee.name}`,
							children: task.assignee.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
						})
					]
				})]
			}),
			!isCompleted && /* @__PURE__ */ jsx(TooltipProvider, {
				delayDuration: 300,
				children: /* @__PURE__ */ jsxs("div", {
					className: cn("flex items-center gap-0.5", !isHovered && "invisible"),
					children: [/* @__PURE__ */ jsxs(Tooltip, { children: [/* @__PURE__ */ jsx(TooltipTrigger, {
						asChild: true,
						children: /* @__PURE__ */ jsx(Button, {
							variant: "ghost",
							size: "icon",
							className: "text-text-tertiary hover:text-text h-7 w-7",
							onClick: (e) => {
								e.stopPropagation();
								onSelect?.(task);
							},
							children: /* @__PURE__ */ jsx(ArrowRight, { className: "h-3.5 w-3.5" })
						})
					}), /* @__PURE__ */ jsx(TooltipContent, { children: "Open" })] }), !readOnly && /* @__PURE__ */ jsxs(Tooltip, { children: [/* @__PURE__ */ jsx(TooltipTrigger, {
						asChild: true,
						children: /* @__PURE__ */ jsx(Button, {
							variant: "ghost",
							size: "icon",
							className: "text-text-tertiary hover:text-danger h-7 w-7",
							onClick: handleDelete,
							children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" })
						})
					}), /* @__PURE__ */ jsx(TooltipContent, { children: "Delete" })] })]
				})
			})
		]
	});
}
//#endregion
//#region resources/js/components/tasks/TaskDetail.tsx
function TaskDetail({ task, className, onToggleChecklistItem, readOnly = false }) {
	const completeMutation = useCompleteTaskMutation();
	const isCompleted = task.status === "completed";
	const hasMetadata = !!task.scheduled_at || !!task.deadline_at || task.is_evening || !!task.project_id || !!task.completed_at;
	return /* @__PURE__ */ jsxs("div", {
		className: cn("space-y-5 pb-6", className),
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-start gap-4",
				children: [/* @__PURE__ */ jsx("span", {
					className: "mt-1 shrink-0",
					children: /* @__PURE__ */ jsx(Checkbox, {
						checked: isCompleted,
						onCheckedChange: readOnly ? void 0 : () => completeMutation.mutate({
							id: task.id,
							completed: !isCompleted
						}),
						disabled: readOnly,
						className: "h-6 w-6 cursor-pointer",
						"aria-label": isCompleted ? "Mark as incomplete" : "Mark as complete"
					})
				}), /* @__PURE__ */ jsxs("div", {
					className: "min-w-0 flex-1 pt-0.5",
					children: [/* @__PURE__ */ jsx("h2", {
						className: cn("text-text text-xl leading-snug font-semibold", isCompleted && "text-text-tertiary line-through"),
						children: /* @__PURE__ */ jsx(MarkdownContent, {
							content: task.title,
							inline: true
						})
					}), isCompleted && /* @__PURE__ */ jsx("p", {
						className: "text-text-tertiary mt-1 text-xs",
						children: "Completed"
					})]
				})]
			}),
			task.description && /* @__PURE__ */ jsxs("div", {
				className: "border-border bg-bg-secondary/50 rounded-xl border px-4 py-3",
				children: [/* @__PURE__ */ jsx("p", {
					className: "text-text-tertiary mb-1.5 text-xs font-semibold tracking-wider uppercase",
					children: "Notes"
				}), /* @__PURE__ */ jsx("div", {
					className: "prose prose-sm text-text-secondary max-w-none text-sm",
					children: /* @__PURE__ */ jsx(MarkdownContent, { content: task.description })
				})]
			}),
			hasMetadata && /* @__PURE__ */ jsxs("div", {
				className: "border-border bg-bg-secondary/50 rounded-xl border px-4 py-3",
				children: [/* @__PURE__ */ jsx("p", {
					className: "text-text-tertiary mb-3 text-xs font-semibold tracking-wider uppercase",
					children: "Details"
				}), /* @__PURE__ */ jsxs("div", {
					className: "space-y-2.5",
					children: [
						task.scheduled_at && /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3 text-sm",
							children: [/* @__PURE__ */ jsx("span", {
								className: "bg-primary/10 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
								children: /* @__PURE__ */ jsx(Calendar, { className: "text-primary h-3.5 w-3.5" })
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
								className: "text-text-tertiary text-xs",
								children: "Scheduled"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-text font-medium",
								children: format(new Date(task.scheduled_at), "EEEE, MMMM d, yyyy")
							})] })]
						}),
						task.deadline_at && /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3 text-sm",
							children: [/* @__PURE__ */ jsx("span", {
								className: "bg-warning/10 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
								children: /* @__PURE__ */ jsx(Clock, { className: "text-warning h-3.5 w-3.5" })
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
								className: "text-text-tertiary text-xs",
								children: "Deadline"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-text font-medium",
								children: format(new Date(task.deadline_at), "EEEE, MMMM d, yyyy")
							})] })]
						}),
						task.is_evening && /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3 text-sm",
							children: [/* @__PURE__ */ jsx("span", {
								className: "bg-bg-tertiary flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
								children: /* @__PURE__ */ jsx(Sun, { className: "text-text-secondary h-3.5 w-3.5" })
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
								className: "text-text-tertiary text-xs",
								children: "Time of day"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-text font-medium",
								children: "Evening"
							})] })]
						}),
						task.project_id && /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3 text-sm",
							children: [/* @__PURE__ */ jsx("span", {
								className: "bg-bg-tertiary flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
								children: /* @__PURE__ */ jsx(Folder, { className: "text-text-secondary h-3.5 w-3.5" })
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
								className: "text-text-tertiary text-xs",
								children: "Project"
							}), /* @__PURE__ */ jsxs("p", {
								className: "text-text font-medium",
								children: ["#", task.project_id]
							})] })]
						}),
						task.completed_at && /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3 text-sm",
							children: [/* @__PURE__ */ jsx("span", {
								className: "bg-success/10 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
								children: /* @__PURE__ */ jsx(Clock, { className: "text-success h-3.5 w-3.5" })
							}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
								className: "text-text-tertiary text-xs",
								children: "Completed"
							}), /* @__PURE__ */ jsx("p", {
								className: "text-text font-medium",
								children: format(new Date(task.completed_at), "MMM d, yyyy h:mm a")
							})] })]
						})
					]
				})]
			}),
			task.tags && task.tags.length > 0 && /* @__PURE__ */ jsxs("div", {
				className: "border-border bg-bg-secondary/50 rounded-xl border px-4 py-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "mb-3 flex items-center gap-2",
					children: [/* @__PURE__ */ jsx(Tag, { className: "text-text-tertiary h-3.5 w-3.5" }), /* @__PURE__ */ jsx("p", {
						className: "text-text-tertiary text-xs font-semibold tracking-wider uppercase",
						children: "Tags"
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "flex flex-wrap gap-1.5",
					children: task.tags.map((tag) => /* @__PURE__ */ jsx(Badge, {
						variant: "secondary",
						color: tag.color ?? void 0,
						children: tag.name
					}, tag.id))
				})]
			}),
			task.checklist_items && task.checklist_items.length > 0 && /* @__PURE__ */ jsxs("div", {
				className: "border-border bg-bg-secondary/50 rounded-xl border px-4 py-3",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "mb-3 flex items-center justify-between",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(CheckSquare, { className: "text-text-tertiary h-3.5 w-3.5" }), /* @__PURE__ */ jsx("p", {
								className: "text-text-tertiary text-xs font-semibold tracking-wider uppercase",
								children: "Checklist"
							})]
						}), /* @__PURE__ */ jsxs("span", {
							className: "text-text-tertiary text-xs tabular-nums",
							children: [
								task.checklist_items.filter((i) => i.is_completed).length,
								" / ",
								task.checklist_items.length
							]
						})]
					}),
					/* @__PURE__ */ jsx("div", {
						className: "bg-bg-tertiary mb-3 h-1 w-full overflow-hidden rounded-full",
						children: /* @__PURE__ */ jsx("div", {
							className: "bg-primary h-full rounded-full transition-all duration-300",
							style: { width: `${task.checklist_items.length > 0 ? task.checklist_items.filter((i) => i.is_completed).length / task.checklist_items.length * 100 : 0}%` }
						})
					}),
					/* @__PURE__ */ jsx("div", {
						className: "space-y-1",
						children: task.checklist_items.sort((a, b) => a.position - b.position).map((item) => /* @__PURE__ */ jsxs("div", {
							className: "hover:bg-bg-tertiary flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition-colors",
							onClick: () => onToggleChecklistItem?.(task.id, item.id, !item.is_completed),
							children: [/* @__PURE__ */ jsx(Checkbox, {
								checked: item.is_completed,
								onCheckedChange: () => onToggleChecklistItem?.(task.id, item.id, !item.is_completed),
								onClick: (e) => e.stopPropagation()
							}), /* @__PURE__ */ jsx("span", {
								className: cn("text-text text-sm", item.is_completed && "text-text-tertiary line-through"),
								children: item.title
							})]
						}, item.id))
					})
				]
			}),
			task.reminders && task.reminders.length > 0 && /* @__PURE__ */ jsxs("div", {
				className: "border-border bg-bg-secondary/50 rounded-xl border px-4 py-3",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "mb-3 flex items-center gap-2",
					children: [/* @__PURE__ */ jsx(Bell, { className: "text-text-tertiary h-3.5 w-3.5" }), /* @__PURE__ */ jsx("p", {
						className: "text-text-tertiary text-xs font-semibold tracking-wider uppercase",
						children: "Reminders"
					})]
				}), /* @__PURE__ */ jsx("div", {
					className: "space-y-2",
					children: task.reminders.map((reminder) => /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-3 rounded-lg px-2 py-2 text-sm",
						children: [/* @__PURE__ */ jsx("span", {
							className: "bg-primary/10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
							children: /* @__PURE__ */ jsx(Bell, { className: "text-primary h-3 w-3" })
						}), /* @__PURE__ */ jsx("span", {
							className: "text-text-secondary",
							children: format(new Date(reminder.remind_at), "MMM d, yyyy h:mm a")
						})]
					}, reminder.id))
				})]
			})
		]
	});
}
//#endregion
//#region resources/js/components/tasks/TaskDetailDialog.tsx
function TaskDetailDialog({ task, open, onOpenChange, readOnly = false }) {
	const [isEditing, setIsEditing] = useState(false);
	const [localTask, setLocalTask] = useState(task);
	const { projects } = usePage().props;
	const { data: tagsResponse } = useTagsQuery();
	const { data: sectionsResponse } = useSectionsQuery();
	const tags = tagsResponse?.data ?? [];
	const sections = sectionsResponse?.data ?? [];
	const toggleChecklistItem = useToggleChecklistItemMutation();
	useEffect(() => {
		setLocalTask(task);
	}, [task]);
	function handleOpenChange(value) {
		if (!value) setIsEditing(false);
		onOpenChange(value);
	}
	function handleToggleChecklistItem(_taskId, itemId) {
		setLocalTask((prev) => {
			if (!prev) return prev;
			return {
				...prev,
				checklist_items: prev.checklist_items?.map((item) => item.id === itemId ? {
					...item,
					is_completed: !item.is_completed
				} : item)
			};
		});
		toggleChecklistItem.mutate(itemId);
	}
	if (!localTask) return null;
	return /* @__PURE__ */ jsx(Dialog, {
		open,
		onOpenChange: handleOpenChange,
		children: /* @__PURE__ */ jsxs(DialogContent, {
			className: "!flex !grid-cols-none !grid-rows-none flex-col !gap-0 p-0 sm:max-h-[90vh] sm:max-w-2xl",
			children: [/* @__PURE__ */ jsx(DialogHeader, {
				className: "border-border shrink-0 border-b px-6 py-4",
				children: /* @__PURE__ */ jsx("div", {
					className: "flex items-center justify-between gap-4",
					children: /* @__PURE__ */ jsxs("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ jsx(DialogTitle, {
							className: "text-text truncate text-base font-semibold",
							children: isEditing ? "Edit Task" : localTask.title
						}), /* @__PURE__ */ jsx(DialogDescription, {
							className: "sr-only",
							children: isEditing ? "Edit the task details below." : "View task details, checklist items, and metadata."
						})]
					})
				})
			}), /* @__PURE__ */ jsx("div", {
				className: "min-h-0 flex-1 overflow-y-auto px-6 pt-6",
				children: isEditing ? /* @__PURE__ */ jsx(TaskForm, {
					task: localTask ?? void 0,
					projects,
					sections,
					tags,
					onClose: () => {
						setIsEditing(false);
						handleOpenChange(false);
					},
					renderActions: ({ submit, isSubmitting, isValid }) => /* @__PURE__ */ jsxs(DialogFooter, {
						className: "bg-bg border-border sticky bottom-0 mt-4 flex-row justify-end gap-2 border-t px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]",
						children: [/* @__PURE__ */ jsx(Button, {
							type: "button",
							variant: "ghost",
							onClick: () => setIsEditing(false),
							children: "Cancel"
						}), /* @__PURE__ */ jsx(Button, {
							type: "button",
							onClick: submit,
							disabled: !isValid || isSubmitting,
							children: isSubmitting ? "Saving..." : "Update Task"
						})]
					})
				}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(TaskDetail, {
					task: localTask,
					onToggleChecklistItem: readOnly ? void 0 : handleToggleChecklistItem,
					readOnly
				}), /* @__PURE__ */ jsxs(DialogFooter, {
					className: "bg-bg border-border sticky bottom-0 flex-row items-center justify-between gap-2 border-t px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-text-tertiary text-xs",
						children: localTask.status !== "completed" ? `Status: ${localTask.status.charAt(0).toUpperCase() + localTask.status.slice(1)}` : "Completed"
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex gap-2",
						children: [!readOnly && /* @__PURE__ */ jsxs(Button, {
							type: "button",
							variant: "outline",
							size: "sm",
							onClick: () => setIsEditing(true),
							children: [/* @__PURE__ */ jsx(Pencil, { className: "h-3.5 w-3.5" }), "Edit"]
						}), /* @__PURE__ */ jsx(Button, {
							type: "button",
							variant: "ghost",
							size: "sm",
							onClick: () => handleOpenChange(false),
							children: "Close"
						})]
					})]
				})] })
			})]
		})
	});
}
//#endregion
export { TaskItem as n, TaskDetailDialog as t };
