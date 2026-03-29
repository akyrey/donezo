import { a as cn, i as Button, n as queryParams, t as applyUrlDefaults } from "./wayfinder-C_mx6M06.js";
import { t as Input } from "./Input-BktEiBB2.js";
import { t as axios_default } from "./axios-BY0CCud-.js";
import { t as Checkbox } from "./Checkbox-Bar4Ffhq.js";
import { Link, router, usePage } from "@inertiajs/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as React$1 from "react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Archive, BookOpen, Calendar, Check, CheckCircle, ChevronRight, Circle, FileText, FolderOpen, GripVertical, Inbox, Info, Layers, LayoutList, Loader2, LogOut, Menu, MoreHorizontal, Palette, Pencil, Plus, Search, Settings, Sun, Tag, Trash2, Users, X, XCircle } from "lucide-react";
import { DndContext, DragOverlay, PointerSensor, useDraggable, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { createPortal } from "react-dom";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
//#region resources/js/components/ui/ScrollArea.tsx
var ScrollArea = React$1.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(ScrollAreaPrimitive.Root, {
	ref,
	className: cn("relative overflow-hidden", className),
	...props,
	children: [
		/* @__PURE__ */ jsx(ScrollAreaPrimitive.Viewport, {
			className: "h-full w-full rounded-[inherit]",
			children
		}),
		/* @__PURE__ */ jsx(ScrollBar, {}),
		/* @__PURE__ */ jsx(ScrollAreaPrimitive.Corner, {})
	]
}));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;
var ScrollBar = React$1.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ jsx(ScrollAreaPrimitive.ScrollAreaScrollbar, {
	ref,
	orientation,
	className: cn("flex touch-none transition-colors select-none", orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]", orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]", className),
	...props,
	children: /* @__PURE__ */ jsx(ScrollAreaPrimitive.ScrollAreaThumb, { className: "bg-border relative flex-1 rounded-full" })
}));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;
//#endregion
//#region resources/js/components/ui/Separator.tsx
var Separator = React$1.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ jsx(SeparatorPrimitive.Root, {
	ref,
	decorative,
	orientation,
	className: cn("bg-border shrink-0", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className),
	...props
}));
Separator.displayName = SeparatorPrimitive.Root.displayName;
//#endregion
//#region resources/js/components/ui/DropdownMenu.tsx
var DropdownMenu = DropdownMenuPrimitive.Root;
var DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
DropdownMenuPrimitive.Group;
DropdownMenuPrimitive.Portal;
DropdownMenuPrimitive.Sub;
DropdownMenuPrimitive.RadioGroup;
var DropdownMenuSubTrigger = React$1.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ jsxs(DropdownMenuPrimitive.SubTrigger, {
	ref,
	className: cn("flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none select-none", "focus:bg-bg-secondary", "data-[state=open]:bg-bg-secondary", "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ jsx(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;
var DropdownMenuSubContent = React$1.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.SubContent, {
	ref,
	className: cn("border-border bg-bg text-text z-50 min-w-[8rem] overflow-hidden rounded-lg border p-1 shadow-lg", "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95", "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95", "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2", "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className),
	...props
}));
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;
var DropdownMenuContent = React$1.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.Content, {
	ref,
	sideOffset,
	className: cn("border-border bg-bg text-text z-50 min-w-[8rem] overflow-hidden rounded-lg border p-1 shadow-lg", "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95", "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95", "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2", "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className),
	...props
}) }));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;
var DropdownMenuItem = React$1.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Item, {
	ref,
	className: cn("relative flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors outline-none select-none", "focus:bg-bg-secondary focus:text-text", "data-[disabled]:pointer-events-none data-[disabled]:opacity-50", "[&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;
var DropdownMenuCheckboxItem = React$1.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ jsxs(DropdownMenuPrimitive.CheckboxItem, {
	ref,
	className: cn("relative flex cursor-pointer items-center rounded-md py-1.5 pr-2 pl-8 text-sm transition-colors outline-none select-none", "focus:bg-bg-secondary focus:text-text", "data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	checked,
	...props,
	children: [/* @__PURE__ */ jsx("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;
var DropdownMenuRadioItem = React$1.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DropdownMenuPrimitive.RadioItem, {
	ref,
	className: cn("relative flex cursor-pointer items-center rounded-md py-1.5 pr-2 pl-8 text-sm transition-colors outline-none select-none", "focus:bg-bg-secondary focus:text-text", "data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ jsx("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ jsx(DropdownMenuPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;
var DropdownMenuLabel = React$1.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Label, {
	ref,
	className: cn("text-text px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;
var DropdownMenuSeparator = React$1.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DropdownMenuPrimitive.Separator, {
	ref,
	className: cn("bg-border -mx-1 my-1 h-px", className),
	...props
}));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;
function DropdownMenuShortcut({ className, ...props }) {
	return /* @__PURE__ */ jsx("span", {
		className: cn("text-text-tertiary ml-auto text-xs tracking-widest", className),
		...props
	});
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
//#endregion
//#region resources/js/hooks/useSearch.ts
var SEARCH_KEY = ["search"];
async function fetchSearchResults(query) {
	const { data } = await axios_default.get("/api/v1/search", { params: {
		q: query,
		limit: 10
	} });
	return data;
}
/**
* Custom hook that provides debounced search across tasks, projects, sections, and tags.
*/
function useSearch(debounceMs = 250) {
	const [query, setQuery] = useState("");
	const [debouncedQuery, setDebouncedQuery] = useState("");
	useEffect(() => {
		if (!query.trim()) {
			setDebouncedQuery("");
			return;
		}
		const timer = setTimeout(() => {
			setDebouncedQuery(query.trim());
		}, debounceMs);
		return () => clearTimeout(timer);
	}, [query, debounceMs]);
	const searchQuery = useQuery({
		queryKey: [...SEARCH_KEY, debouncedQuery],
		queryFn: () => fetchSearchResults(debouncedQuery),
		enabled: debouncedQuery.length > 0,
		staleTime: 3e4,
		placeholderData: (previousData) => previousData
	});
	const isEmpty = useMemo(() => {
		if (!searchQuery.data) return true;
		const { tasks, projects, sections, tags } = searchQuery.data;
		return tasks.length === 0 && projects.length === 0 && sections.length === 0 && tags.length === 0;
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
		totalResults
	};
}
//#endregion
//#region resources/js/components/CommandPalette.tsx
/** Static navigation commands shown when the search query is empty. */
var NAVIGATION_COMMANDS = [
	{
		label: "Inbox",
		href: "/inbox",
		icon: Inbox
	},
	{
		label: "Today",
		href: "/today",
		icon: Sun
	},
	{
		label: "Upcoming",
		href: "/upcoming",
		icon: Calendar
	},
	{
		label: "Anytime",
		href: "/anytime",
		icon: Layers
	},
	{
		label: "Someday",
		href: "/someday",
		icon: Archive
	},
	{
		label: "Logbook",
		href: "/logbook",
		icon: BookOpen
	}
];
function CommandPalette({ open, onOpenChange }) {
	const { query, setQuery, results, isLoading, isEmpty } = useSearch(200);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const listRef = useRef(null);
	const flatItems = React.useMemo(() => {
		const items = [];
		if (!query.trim()) NAVIGATION_COMMANDS.forEach((cmd) => {
			items.push({
				type: "nav",
				id: `nav-${cmd.href}`,
				label: cmd.label,
				onSelect: () => {
					onOpenChange(false);
					router.visit(cmd.href);
				}
			});
		});
		else if (results) {
			results.tasks.forEach((task) => {
				items.push({
					type: "task",
					id: `task-${task.id}`,
					label: task.title,
					onSelect: () => {
						onOpenChange(false);
						if (task.project_id) router.visit(`/projects/${task.project_id}`);
						else router.visit({
							inbox: "/inbox",
							today: "/today",
							upcoming: "/upcoming",
							anytime: "/anytime",
							someday: "/someday",
							completed: "/logbook",
							cancelled: "/logbook"
						}[task.status] ?? "/inbox");
					}
				});
			});
			results.projects.forEach((project) => {
				items.push({
					type: "project",
					id: `project-${project.id}`,
					label: project.name,
					onSelect: () => {
						onOpenChange(false);
						router.visit(`/projects/${project.id}`);
					}
				});
			});
			results.sections.forEach((section) => {
				items.push({
					type: "section",
					id: `section-${section.id}`,
					label: section.name,
					onSelect: () => {
						onOpenChange(false);
						router.visit(`/sections/${section.id}`);
					}
				});
			});
			results.tags.forEach((tag) => {
				items.push({
					type: "tag",
					id: `tag-${tag.id}`,
					label: tag.name,
					onSelect: () => {
						onOpenChange(false);
						router.visit("/anytime");
					}
				});
			});
		}
		return items;
	}, [
		query,
		results,
		onOpenChange
	]);
	useEffect(() => {
		setSelectedIndex(0);
	}, [flatItems.length, query]);
	useEffect(() => {
		if (!open) {
			setQuery("");
			setSelectedIndex(0);
		}
	}, [open, setQuery]);
	useEffect(() => {
		if (!listRef.current) return;
		listRef.current.querySelector("[data-selected=\"true\"]")?.scrollIntoView({ block: "nearest" });
	}, [selectedIndex]);
	const handleKeyDown = useCallback((e) => {
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setSelectedIndex((i) => i < flatItems.length - 1 ? i + 1 : 0);
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setSelectedIndex((i) => i > 0 ? i - 1 : flatItems.length - 1);
		} else if (e.key === "Enter") {
			e.preventDefault();
			flatItems[selectedIndex]?.onSelect();
		}
	}, [flatItems, selectedIndex]);
	function renderIcon(type) {
		switch (type) {
			case "task": return /* @__PURE__ */ jsx(FileText, { className: "text-text-tertiary h-4 w-4" });
			case "project": return /* @__PURE__ */ jsx(FolderOpen, { className: "text-text-tertiary h-4 w-4" });
			case "section": return /* @__PURE__ */ jsx(LayoutList, { className: "text-text-tertiary h-4 w-4" });
			case "tag": return /* @__PURE__ */ jsx(Tag, { className: "text-text-tertiary h-4 w-4" });
			default: return null;
		}
	}
	function renderNavIcon(href) {
		const cmd = NAVIGATION_COMMANDS.find((c) => c.href === href);
		if (!cmd) return null;
		const Icon = cmd.icon;
		return /* @__PURE__ */ jsx(Icon, { className: "text-text-tertiary h-4 w-4" });
	}
	const groupedResults = React.useMemo(() => {
		if (!query.trim() || !results) return null;
		const groups = [];
		const tasks = flatItems.filter((i) => i.type === "task");
		const projects = flatItems.filter((i) => i.type === "project");
		const sections = flatItems.filter((i) => i.type === "section");
		const tags = flatItems.filter((i) => i.type === "tag");
		if (tasks.length > 0) groups.push({
			label: "Tasks",
			items: tasks
		});
		if (projects.length > 0) groups.push({
			label: "Projects",
			items: projects
		});
		if (sections.length > 0) groups.push({
			label: "Sections",
			items: sections
		});
		if (tags.length > 0) groups.push({
			label: "Tags",
			items: tags
		});
		return groups;
	}, [
		query,
		results,
		flatItems
	]);
	return /* @__PURE__ */ jsx(DialogPrimitive.Root, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ jsxs(DialogPrimitive.Portal, { children: [/* @__PURE__ */ jsx(DialogPrimitive.Overlay, { className: cn("fixed inset-0 z-50 bg-black/40 backdrop-blur-sm", "data-[state=open]:animate-in data-[state=open]:fade-in-0", "data-[state=closed]:animate-out data-[state=closed]:fade-out-0") }), /* @__PURE__ */ jsxs(DialogPrimitive.Content, {
			className: cn("border-border bg-bg fixed top-[20%] left-1/2 z-50 w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-xl border shadow-2xl", "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-4", "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-4", "duration-150"),
			onKeyDown: handleKeyDown,
			children: [
				/* @__PURE__ */ jsx(DialogPrimitive.Title, {
					className: "sr-only",
					children: "Quick Find"
				}),
				/* @__PURE__ */ jsx(DialogPrimitive.Description, {
					className: "sr-only",
					children: "Search tasks, projects, sections, and tags, or navigate to a page."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "border-border flex items-center gap-3 border-b px-4",
					children: [
						/* @__PURE__ */ jsx(Search, { className: "text-text-tertiary h-4.5 w-4.5 shrink-0" }),
						/* @__PURE__ */ jsx("input", {
							value: query,
							onChange: (e) => setQuery(e.target.value),
							placeholder: "Search or jump to...",
							className: "text-text placeholder:text-text-tertiary h-12 flex-1 bg-transparent text-sm outline-none",
							autoFocus: true
						}),
						isLoading && /* @__PURE__ */ jsx(Loader2, { className: "text-text-tertiary h-4 w-4 shrink-0 animate-spin" }),
						/* @__PURE__ */ jsx("kbd", {
							className: "border-border bg-bg-secondary text-text-tertiary hidden shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-medium sm:inline-block",
							children: "ESC"
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					ref: listRef,
					className: "max-h-80 overflow-y-auto p-2",
					role: "listbox",
					children: [
						!query.trim() && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
							className: "text-text-tertiary mb-1 px-2 text-xs font-semibold tracking-wider uppercase",
							children: "Navigate"
						}), flatItems.map((item, index) => /* @__PURE__ */ jsxs("button", {
							"data-selected": index === selectedIndex,
							className: cn("flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors", index === selectedIndex ? "bg-sidebar-active text-primary" : "text-text-secondary hover:bg-bg-secondary"),
							onClick: item.onSelect,
							onMouseEnter: () => setSelectedIndex(index),
							role: "option",
							"aria-selected": index === selectedIndex,
							children: [renderNavIcon(NAVIGATION_COMMANDS[index]?.href ?? ""), item.label]
						}, item.id))] }),
						query.trim() && groupedResults && groupedResults.length > 0 && /* @__PURE__ */ jsx("div", {
							className: "space-y-3",
							children: groupedResults.map((group) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("p", {
								className: "text-text-tertiary mb-1 px-2 text-xs font-semibold tracking-wider uppercase",
								children: group.label
							}), group.items.map((item) => {
								const globalIndex = flatItems.indexOf(item);
								return /* @__PURE__ */ jsxs("button", {
									"data-selected": globalIndex === selectedIndex,
									className: cn("flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors", globalIndex === selectedIndex ? "bg-sidebar-active text-primary" : "text-text-secondary hover:bg-bg-secondary"),
									onClick: item.onSelect,
									onMouseEnter: () => setSelectedIndex(globalIndex),
									role: "option",
									"aria-selected": globalIndex === selectedIndex,
									children: [renderIcon(item.type), /* @__PURE__ */ jsx("span", {
										className: "truncate",
										children: item.label
									})]
								}, item.id);
							})] }, group.label))
						}),
						query.trim() && !isLoading && isEmpty && /* @__PURE__ */ jsxs("div", {
							className: "text-text-tertiary flex flex-col items-center justify-center py-8",
							children: [
								/* @__PURE__ */ jsx(Search, { className: "mb-2 h-8 w-8 stroke-1" }),
								/* @__PURE__ */ jsx("p", {
									className: "text-sm",
									children: "No results found"
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-1 text-xs",
									children: "Try a different search term"
								})
							]
						})
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "border-border flex items-center justify-between border-t px-4 py-2",
					children: /* @__PURE__ */ jsxs("div", {
						className: "text-text-tertiary flex items-center gap-3 text-xs",
						children: [/* @__PURE__ */ jsxs("span", {
							className: "flex items-center gap-1",
							children: [
								/* @__PURE__ */ jsx("kbd", {
									className: "border-border bg-bg-secondary rounded border px-1 py-0.5 text-[10px] font-medium",
									children: "↑"
								}),
								/* @__PURE__ */ jsx("kbd", {
									className: "border-border bg-bg-secondary rounded border px-1 py-0.5 text-[10px] font-medium",
									children: "↓"
								}),
								"Navigate"
							]
						}), /* @__PURE__ */ jsxs("span", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ jsx("kbd", {
								className: "border-border bg-bg-secondary rounded border px-1 py-0.5 text-[10px] font-medium",
								children: "↵"
							}), "Open"]
						})]
					})
				})
			]
		})] })
	});
}
//#endregion
//#region resources/js/components/ui/Dialog.tsx
var Dialog = DialogPrimitive.Root;
DialogPrimitive.Trigger;
DialogPrimitive.Close;
var DialogPortal = DialogPrimitive.Portal;
var DialogOverlay = React$1.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DialogPrimitive.Overlay, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/40 backdrop-blur-sm", "data-[state=open]:animate-in data-[state=open]:fade-in-0", "data-[state=closed]:animate-out data-[state=closed]:fade-out-0", className),
	...props
}));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
var DialogContent = React$1.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [/* @__PURE__ */ jsx(DialogOverlay, {}), /* @__PURE__ */ jsxs(DialogPrimitive.Content, {
	ref,
	className: cn("border-border bg-bg fixed inset-0 z-50 grid w-full gap-4 p-6 shadow-lg", "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-full", "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-bottom-full", "sm:inset-auto sm:top-1/2 sm:left-1/2 sm:max-w-lg sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl sm:border", "sm:data-[state=open]:slide-in-from-bottom-0 sm:data-[state=open]:zoom-in-95 sm:data-[state=open]:slide-in-from-left-1/2 sm:data-[state=open]:slide-in-from-top-[48%]", "sm:data-[state=closed]:slide-out-to-bottom-0 sm:data-[state=closed]:zoom-out-95 sm:data-[state=closed]:slide-out-to-left-1/2 sm:data-[state=closed]:slide-out-to-top-[48%]", "duration-200", className),
	...props,
	children: [children, /* @__PURE__ */ jsxs(DialogPrimitive.Close, {
		className: "ring-offset-bg focus:ring-primary/50 absolute top-4 right-4 cursor-pointer rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none",
		children: [/* @__PURE__ */ jsx(X, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
		...props
	});
}
DialogHeader.displayName = "DialogHeader";
function DialogFooter({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
		...props
	});
}
DialogFooter.displayName = "DialogFooter";
var DialogTitle = React$1.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DialogPrimitive.Title, {
	ref,
	className: cn("text-text text-lg leading-none font-semibold tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
var DialogDescription = React$1.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(DialogPrimitive.Description, {
	ref,
	className: cn("text-text-secondary text-sm", className),
	...props
}));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
//#endregion
//#region resources/js/components/ui/Popover.tsx
var Popover = PopoverPrimitive.Root;
var PopoverTrigger = PopoverPrimitive.Trigger;
PopoverPrimitive.Anchor;
var PopoverContent = React$1.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsx(PopoverPrimitive.Portal, { children: /* @__PURE__ */ jsx(PopoverPrimitive.Content, {
	ref,
	align,
	sideOffset,
	className: cn("border-border bg-bg text-text z-50 w-72 rounded-lg border p-4 shadow-lg outline-none", "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95", "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95", "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2", "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", className),
	...props
}) }));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;
//#endregion
//#region resources/js/hooks/useTasks.ts
/**
* Reload current Inertia page props so server-rendered task lists update
* after a client-side API mutation.
*/
function reloadInertiaProps() {
	router.reload();
}
var TASKS_KEY = ["tasks"];
function useTaskMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data) => {
			return (await axios_default.post("/api/v1/tasks", data)).data.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: TASKS_KEY });
			reloadInertiaProps();
		}
	});
}
function useUpdateTaskMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, ...data }) => {
			return (await axios_default.put(`/api/v1/tasks/${id}`, data)).data.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: TASKS_KEY });
			reloadInertiaProps();
		}
	});
}
function useDeleteTaskMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id) => {
			await axios_default.delete(`/api/v1/tasks/${id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: TASKS_KEY });
			reloadInertiaProps();
		}
	});
}
function useCompleteTaskMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, completed }) => {
			const endpoint = completed ? `/api/v1/tasks/${id}/complete` : `/api/v1/tasks/${id}/uncomplete`;
			return (await axios_default.post(endpoint)).data.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: TASKS_KEY });
			reloadInertiaProps();
		}
	});
}
function useToggleChecklistItemMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id) => {
			return (await axios_default.post(`/api/v1/checklist-items/${id}/toggle`)).data.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: TASKS_KEY });
			reloadInertiaProps();
		}
	});
}
function useReorderTasksMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (tasks) => {
			return (await axios_default.post("/api/v1/tasks/reorder", { tasks })).data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: TASKS_KEY });
			reloadInertiaProps();
		}
	});
}
function useReorderHeadingsMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (headings) => {
			return (await axios_default.post("/api/v1/headings/reorder", { headings })).data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: TASKS_KEY });
			reloadInertiaProps();
		}
	});
}
//#endregion
//#region resources/js/hooks/useTags.ts
var TAGS_KEY = ["tags"];
function useTagsQuery() {
	return useQuery({
		queryKey: TAGS_KEY,
		queryFn: async () => {
			const { data } = await axios_default.get("/api/v1/tags");
			return data;
		}
	});
}
function useTagMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data) => {
			return (await axios_default.post("/api/v1/tags", data)).data.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: TAGS_KEY });
		}
	});
}
//#endregion
//#region resources/js/components/tasks/TaskForm.tsx
var TAG_COLORS = [
	"#ef4444",
	"#f97316",
	"#eab308",
	"#22c55e",
	"#14b8a6",
	"#3b82f6",
	"#8b5cf6",
	"#ec4899",
	"#6b7280",
	"#000000"
];
function TaskForm({ task, projects = [], sections = [], tags = [], onClose, defaultProjectId, defaultSectionId, placeholder = "Task title", context, projectId: projectIdProp, inline, defaultGroupId, renderActions }) {
	const isEditing = !!task;
	const isInline = inline ?? false;
	const [title, setTitle] = useState(task?.title ?? "");
	const [description, setDescription] = useState(task?.description ?? "");
	const [scheduledAt, setScheduledAt] = useState(task?.scheduled_at ? task.scheduled_at.substring(0, 10) : "");
	const [deadlineAt, setDeadlineAt] = useState(task?.deadline_at ? task.deadline_at.substring(0, 10) : "");
	const [isEvening, setIsEvening] = useState(task?.is_evening ?? false);
	const [projectId, setProjectId] = useState(task?.project_id ?? projectIdProp ?? defaultProjectId);
	const [headingId, setHeadingId] = useState(task?.heading_id ?? void 0);
	const [sectionId, setSectionId] = useState(task?.section_id ?? defaultSectionId);
	const [selectedTagIds, setSelectedTagIds] = useState(task?.tags?.map((t) => t.id) ?? []);
	const [checklistItems, setChecklistItems] = useState(task?.checklist_items?.map((item) => ({
		id: item.id,
		title: item.title,
		is_completed: item.is_completed,
		position: item.position
	})) ?? []);
	const [reminders, setReminders] = useState(task?.reminders?.map((r) => ({
		id: r.id,
		remind_at: r.remind_at
	})) ?? []);
	const [newChecklistTitle, setNewChecklistTitle] = useState("");
	const [newReminderAt, setNewReminderAt] = useState("");
	const [showInlineDescription, setShowInlineDescription] = useState(false);
	const [newTagName, setNewTagName] = useState("");
	const [newTagColor, setNewTagColor] = useState(void 0);
	const createMutation = useTaskMutation();
	const updateMutation = useUpdateTaskMutation();
	const tagMutation = useTagMutation();
	const isSubmitting = createMutation.isPending || updateMutation.isPending;
	function getDefaultStatus() {
		switch (context) {
			case "today": return "today";
			case "upcoming": return "upcoming";
			case "anytime": return "anytime";
			case "someday": return "someday";
			default: return "inbox";
		}
	}
	function submitForm() {
		if (!title.trim()) return;
		const data = {
			title: title.trim(),
			description: description.trim() || void 0,
			status: getDefaultStatus(),
			scheduled_at: scheduledAt || void 0,
			deadline_at: deadlineAt || void 0,
			is_evening: isEvening,
			project_id: projectId,
			heading_id: headingId,
			section_id: sectionId,
			tags: selectedTagIds.length > 0 ? selectedTagIds : void 0,
			group_ids: defaultGroupId ? [defaultGroupId] : void 0,
			checklist_items: checklistItems.map((item, idx) => ({
				title: item.title,
				position: idx
			})),
			reminders: reminders.map((r) => ({ remind_at: r.remind_at }))
		};
		if (isEditing && task) updateMutation.mutate({
			id: task.id,
			...data
		}, { onSuccess: () => onClose?.() });
		else createMutation.mutate(data, { onSuccess: () => {
			setTitle("");
			setDescription("");
			setScheduledAt("");
			setDeadlineAt("");
			setIsEvening(false);
			setHeadingId(void 0);
			setChecklistItems([]);
			setReminders([]);
			setSelectedTagIds([]);
			setShowInlineDescription(false);
			onClose?.();
		} });
	}
	function handleSubmit(e) {
		e.preventDefault();
		submitForm();
	}
	function addChecklistItem() {
		if (!newChecklistTitle.trim()) return;
		setChecklistItems((prev) => [...prev, {
			title: newChecklistTitle.trim(),
			is_completed: false,
			position: prev.length
		}]);
		setNewChecklistTitle("");
	}
	function removeChecklistItem(index) {
		setChecklistItems((prev) => prev.filter((_, i) => i !== index));
	}
	function addReminder() {
		if (!newReminderAt) return;
		setReminders((prev) => [...prev, { remind_at: newReminderAt }]);
		setNewReminderAt("");
	}
	function removeReminder(index) {
		setReminders((prev) => prev.filter((_, i) => i !== index));
	}
	function toggleTag(tagId) {
		setSelectedTagIds((prev) => prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]);
	}
	function createTag() {
		const name = newTagName.trim();
		if (!name) return;
		tagMutation.mutate({
			name,
			color: newTagColor
		}, { onSuccess: (tag) => {
			setSelectedTagIds((prev) => [...prev, tag.id]);
			setNewTagName("");
			setNewTagColor(void 0);
		} });
	}
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("form", {
		onSubmit: handleSubmit,
		className: "space-y-4 pb-4",
		children: [
			/* @__PURE__ */ jsx(Input, {
				placeholder,
				value: title,
				onChange: (e) => setTitle(e.target.value),
				autoFocus: true,
				className: cn(isInline ? "border-border/60 focus-visible:border-primary rounded-none border-0 border-b bg-transparent px-1 text-base font-medium shadow-none transition-colors focus-visible:ring-0" : "border-none px-0 text-base font-medium shadow-none focus-visible:ring-0")
			}),
			isInline && /* @__PURE__ */ jsx(Fragment, { children: showInlineDescription ? /* @__PURE__ */ jsx("textarea", {
				placeholder: "Add notes...",
				value: description,
				onChange: (e) => setDescription(e.target.value),
				rows: 2,
				autoFocus: true,
				className: cn("border-border/60 bg-bg-secondary/50 text-text w-full resize-none rounded-md border px-3 py-2 text-sm", "placeholder:text-text-tertiary", "focus:ring-primary/40 focus:border-primary/40 focus:ring-1 focus:outline-none", "transition-all")
			}) : /* @__PURE__ */ jsxs("button", {
				type: "button",
				onClick: () => setShowInlineDescription(true),
				className: cn("text-text-tertiary flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs", "hover:text-text-secondary hover:bg-bg-secondary/70 transition-all"),
				children: [/* @__PURE__ */ jsx(FileText, { className: "h-3.5 w-3.5" }), "Add notes"]
			}) }),
			!isInline && /* @__PURE__ */ jsxs(Fragment, { children: [
				/* @__PURE__ */ jsx("textarea", {
					placeholder: "Add notes...",
					value: description,
					onChange: (e) => setDescription(e.target.value),
					rows: 3,
					className: cn("border-border bg-bg text-text-secondary w-full resize-none rounded-lg border px-3 py-2 text-sm", "placeholder:text-text-tertiary", "focus:ring-primary/50 focus:ring-2 focus:outline-none")
				}),
				/* @__PURE__ */ jsx(Separator, {}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col gap-1.5",
						children: [/* @__PURE__ */ jsx("label", {
							className: "text-text text-sm font-medium",
							children: "Scheduled date"
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ jsx("input", {
								type: "date",
								value: scheduledAt,
								onChange: (e) => setScheduledAt(e.target.value),
								className: "border-border bg-bg text-text focus-visible:ring-primary/50 flex h-9 w-full min-w-0 cursor-pointer rounded-lg border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none"
							}), scheduledAt && /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setScheduledAt(""),
								className: "text-text-tertiary hover:text-danger shrink-0",
								"aria-label": "Clear scheduled date",
								children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
							})]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex flex-col gap-1.5",
						children: [/* @__PURE__ */ jsx("label", {
							className: "text-text text-sm font-medium",
							children: "Deadline"
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ jsx("input", {
								type: "date",
								value: deadlineAt,
								onChange: (e) => setDeadlineAt(e.target.value),
								className: "border-border bg-bg text-text focus-visible:ring-primary/50 flex h-9 w-full min-w-0 cursor-pointer rounded-lg border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none"
							}), deadlineAt && /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setDeadlineAt(""),
								className: "text-text-tertiary hover:text-danger shrink-0",
								"aria-label": "Clear deadline",
								children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
							})]
						})]
					})]
				}),
				/* @__PURE__ */ jsxs("label", {
					className: "text-text-secondary flex items-center gap-2 text-sm",
					children: [/* @__PURE__ */ jsx(Checkbox, {
						checked: isEvening,
						onCheckedChange: (checked) => setIsEvening(checked === true)
					}), "Evening task"]
				}),
				/* @__PURE__ */ jsx(Separator, {}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex flex-col gap-1.5",
						children: [/* @__PURE__ */ jsx("label", {
							className: "text-text text-sm font-medium",
							children: "Project"
						}), /* @__PURE__ */ jsxs("select", {
							value: projectId ?? "",
							onChange: (e) => {
								setProjectId(e.target.value ? Number(e.target.value) : void 0);
								setHeadingId(void 0);
							},
							className: "border-border bg-bg text-text focus:ring-primary/50 h-9 w-full cursor-pointer rounded-lg border px-3 text-sm shadow-sm transition-colors focus:ring-2 focus:ring-offset-1 focus:outline-none",
							children: [/* @__PURE__ */ jsx("option", {
								value: "",
								children: "No project"
							}), projects.map((project) => /* @__PURE__ */ jsx("option", {
								value: project.id,
								children: project.name
							}, project.id))]
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex flex-col gap-1.5",
						children: [/* @__PURE__ */ jsx("label", {
							className: "text-text text-sm font-medium",
							children: "Section"
						}), /* @__PURE__ */ jsxs("select", {
							value: sectionId ?? "",
							onChange: (e) => setSectionId(e.target.value ? Number(e.target.value) : void 0),
							className: "border-border bg-bg text-text focus:ring-primary/50 h-9 w-full cursor-pointer rounded-lg border px-3 text-sm shadow-sm transition-colors focus:ring-2 focus:ring-offset-1 focus:outline-none",
							children: [/* @__PURE__ */ jsx("option", {
								value: "",
								children: "No section"
							}), sections.map((section) => /* @__PURE__ */ jsx("option", {
								value: section.id,
								children: section.name
							}, section.id))]
						})]
					})]
				}),
				(() => {
					const availableHeadings = (projectId ? projects.find((p) => p.id === projectId) : void 0)?.headings?.filter((h) => !h.archived_at);
					if (!availableHeadings || availableHeadings.length === 0) return null;
					return /* @__PURE__ */ jsxs("div", {
						className: "flex flex-col gap-1.5",
						children: [/* @__PURE__ */ jsx("label", {
							className: "text-text text-sm font-medium",
							children: "Heading"
						}), /* @__PURE__ */ jsxs("select", {
							value: headingId ?? "",
							onChange: (e) => setHeadingId(e.target.value ? Number(e.target.value) : void 0),
							className: "border-border bg-bg text-text focus:ring-primary/50 h-9 w-full cursor-pointer rounded-lg border px-3 text-sm shadow-sm transition-colors focus:ring-2 focus:ring-offset-1 focus:outline-none",
							children: [/* @__PURE__ */ jsx("option", {
								value: "",
								children: "No heading"
							}), availableHeadings.map((heading) => /* @__PURE__ */ jsx("option", {
								value: heading.id,
								children: heading.name
							}, heading.id))]
						})]
					});
				})(),
				/* @__PURE__ */ jsx(Separator, {}),
				/* @__PURE__ */ jsxs("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ jsx("label", {
							className: "text-text text-sm font-medium",
							children: "Tags"
						}),
						/* @__PURE__ */ jsx("div", {
							className: "flex flex-wrap gap-2",
							children: tags.map((tag) => /* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => toggleTag(tag.id),
								className: cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors", selectedTagIds.includes(tag.id) ? "bg-primary text-white" : "bg-bg-tertiary text-text-secondary hover:bg-bg-secondary"),
								children: [tag.color && /* @__PURE__ */ jsx("span", {
									className: "h-2 w-2 rounded-full",
									style: { backgroundColor: tag.color }
								}), tag.name]
							}, tag.id))
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ jsx(Input, {
									type: "text",
									placeholder: "New tag...",
									value: newTagName,
									onChange: (e) => setNewTagName(e.target.value),
									onKeyDown: (e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											createTag();
										}
									},
									disabled: tagMutation.isPending,
									wrapperClassName: "min-w-0 flex-1"
								}),
								/* @__PURE__ */ jsxs(Popover, { children: [/* @__PURE__ */ jsx(PopoverTrigger, {
									asChild: true,
									children: /* @__PURE__ */ jsx("button", {
										type: "button",
										className: cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors", newTagColor ? "border-transparent" : "border-border bg-bg hover:border-primary/50 hover:bg-bg-secondary"),
										style: newTagColor ? { backgroundColor: newTagColor } : void 0,
										title: "Pick a color",
										children: !newTagColor && /* @__PURE__ */ jsx(Palette, { className: "text-text-tertiary h-4 w-4" })
									})
								}), /* @__PURE__ */ jsxs(PopoverContent, {
									className: "w-auto p-3",
									align: "end",
									children: [/* @__PURE__ */ jsx("p", {
										className: "text-text-secondary mb-2 text-xs font-medium",
										children: "Tag color"
									}), /* @__PURE__ */ jsxs("div", {
										className: "grid grid-cols-5 gap-2",
										children: [/* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => setNewTagColor(void 0),
											className: cn("bg-bg-tertiary h-6 w-6 rounded-full border-2 transition-colors", !newTagColor ? "border-primary" : "hover:border-border border-transparent"),
											title: "No color"
										}), TAG_COLORS.map((color) => /* @__PURE__ */ jsx("button", {
											type: "button",
											onClick: () => setNewTagColor(color),
											className: cn("h-6 w-6 rounded-full border-2 transition-colors", newTagColor === color ? "border-primary scale-110" : "hover:border-border border-transparent"),
											style: { backgroundColor: color },
											title: color
										}, color))]
									})]
								})] }),
								/* @__PURE__ */ jsx(Button, {
									type: "button",
									variant: "ghost",
									size: "icon",
									onClick: createTag,
									disabled: !newTagName.trim() || tagMutation.isPending,
									children: /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" })
								})
							]
						})
					]
				}),
				/* @__PURE__ */ jsx(Separator, {}),
				/* @__PURE__ */ jsxs("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ jsx("label", {
							className: "text-text text-sm font-medium",
							children: "Checklist"
						}),
						checklistItems.map((item, index) => /* @__PURE__ */ jsxs("div", {
							className: "bg-bg-secondary flex items-center gap-2 rounded-md px-2 py-1.5",
							children: [
								/* @__PURE__ */ jsx(GripVertical, { className: "text-text-tertiary h-3.5 w-3.5" }),
								/* @__PURE__ */ jsx("span", {
									className: "text-text flex-1 text-sm",
									children: item.title
								}),
								/* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => removeChecklistItem(index),
									className: "text-text-tertiary hover:text-danger",
									children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" })
								})
							]
						}, index)),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(Input, {
								placeholder: "Add checklist item...",
								value: newChecklistTitle,
								onChange: (e) => setNewChecklistTitle(e.target.value),
								onKeyDown: (e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										addChecklistItem();
									}
								},
								wrapperClassName: "min-w-0 flex-1"
							}), /* @__PURE__ */ jsx(Button, {
								type: "button",
								variant: "ghost",
								size: "icon",
								onClick: addChecklistItem,
								children: /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" })
							})]
						})
					]
				}),
				/* @__PURE__ */ jsx(Separator, {}),
				/* @__PURE__ */ jsxs("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ jsx("label", {
							className: "text-text text-sm font-medium",
							children: "Reminders"
						}),
						reminders.map((reminder, index) => /* @__PURE__ */ jsxs("div", {
							className: "bg-bg-secondary flex items-center gap-2 rounded-md px-2 py-1.5",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-text flex-1 text-sm",
								children: new Date(reminder.remind_at).toLocaleString()
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => removeReminder(index),
								className: "text-text-tertiary hover:text-danger",
								children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" })
							})]
						}, index)),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ jsx(Input, {
									type: "datetime-local",
									value: newReminderAt,
									onChange: (e) => setNewReminderAt(e.target.value),
									wrapperClassName: "min-w-0 flex-1"
								}),
								newReminderAt && /* @__PURE__ */ jsx("button", {
									type: "button",
									onClick: () => setNewReminderAt(""),
									className: "text-text-tertiary hover:text-danger shrink-0",
									"aria-label": "Clear reminder date",
									children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ jsx(Button, {
									type: "button",
									variant: "ghost",
									size: "icon",
									onClick: addReminder,
									children: /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" })
								})
							]
						})
					]
				}),
				/* @__PURE__ */ jsx(Separator, {})
			] }),
			!renderActions && /* @__PURE__ */ jsxs("div", {
				className: "flex justify-end gap-2",
				children: [onClose && /* @__PURE__ */ jsx(Button, {
					type: "button",
					variant: "ghost",
					onClick: onClose,
					children: "Cancel"
				}), /* @__PURE__ */ jsx(Button, {
					type: "submit",
					disabled: !title.trim() || isSubmitting,
					children: isSubmitting ? "Saving..." : isEditing ? "Update Task" : "Add Task"
				})]
			})
		]
	}), renderActions?.({
		submit: submitForm,
		isSubmitting,
		isEditing,
		isValid: !!title.trim()
	})] });
}
//#endregion
//#region resources/js/hooks/useSections.ts
var SECTIONS_KEY = ["sections"];
function useSectionsQuery() {
	return useQuery({
		queryKey: SECTIONS_KEY,
		queryFn: async () => {
			const { data } = await axios_default.get("/api/v1/sections");
			return data;
		}
	});
}
function useSectionMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data) => {
			return (await axios_default.post("/api/v1/sections", data)).data.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: SECTIONS_KEY });
			router.reload();
		}
	});
}
function useUpdateSectionMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, ...data }) => {
			return (await axios_default.put(`/api/v1/sections/${id}`, data)).data.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: SECTIONS_KEY });
			router.reload();
		}
	});
}
function useDeleteSectionMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id) => {
			await axios_default.delete(`/api/v1/sections/${id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: SECTIONS_KEY });
			router.reload();
		}
	});
}
//#endregion
//#region resources/js/components/tasks/AddTaskDialog.tsx
function AddTaskDialog({ open, onOpenChange, context, defaultProjectId, defaultGroupId }) {
	const { projects } = usePage().props;
	const { data: tagsResponse } = useTagsQuery();
	const tags = tagsResponse?.data ?? [];
	const { data: sectionsResponse } = useSectionsQuery();
	const sections = sectionsResponse?.data ?? [];
	return /* @__PURE__ */ jsx(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ jsxs(DialogContent, {
			className: "!flex !grid-cols-none !grid-rows-none flex-col !gap-0 p-0 sm:max-h-[85vh] sm:max-w-2xl",
			children: [/* @__PURE__ */ jsxs(DialogHeader, {
				className: "shrink-0 px-6 pt-6 pb-2",
				children: [/* @__PURE__ */ jsx(DialogTitle, { children: "New Task" }), /* @__PURE__ */ jsx(DialogDescription, {
					className: "sr-only",
					children: "Fill in the details to create a new task."
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "min-h-0 flex-1 overflow-y-auto px-6 pt-2",
				children: /* @__PURE__ */ jsx(TaskForm, {
					projects,
					sections,
					tags,
					context,
					defaultProjectId,
					defaultGroupId,
					onClose: () => onOpenChange(false),
					renderActions: ({ submit, isSubmitting, isEditing, isValid }) => /* @__PURE__ */ jsxs(DialogFooter, {
						className: "bg-bg border-border sticky bottom-0 mt-4 flex-row justify-end gap-2 border-t px-6 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]",
						children: [/* @__PURE__ */ jsx(Button, {
							type: "button",
							variant: "ghost",
							onClick: () => onOpenChange(false),
							children: "Cancel"
						}), /* @__PURE__ */ jsx(Button, {
							type: "button",
							onClick: submit,
							disabled: !isValid || isSubmitting,
							children: isSubmitting ? "Saving..." : isEditing ? "Update Task" : "Add Task"
						})]
					})
				})
			})]
		})
	});
}
//#endregion
//#region resources/js/components/ui/UndoToast.tsx
function UndoToast({ message, duration = 4e3, onUndo, onDismiss }) {
	const [visible, setVisible] = useState(false);
	const timerRef = useRef(null);
	useEffect(() => {
		const frame = requestAnimationFrame(() => setVisible(true));
		timerRef.current = setTimeout(() => {
			setVisible(false);
			setTimeout(onDismiss, 300);
		}, duration);
		return () => {
			cancelAnimationFrame(frame);
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, []);
	function handleUndo() {
		if (timerRef.current) clearTimeout(timerRef.current);
		onUndo();
		setVisible(false);
		setTimeout(onDismiss, 300);
	}
	return createPortal(/* @__PURE__ */ jsxs("div", {
		className: cn("fixed bottom-8 left-1/2 z-50 -translate-x-1/2", "border-border bg-bg flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg", "transition-all duration-300", visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"),
		role: "status",
		"aria-live": "polite",
		children: [
			/* @__PURE__ */ jsx("span", {
				className: "text-text text-sm",
				children: message
			}),
			/* @__PURE__ */ jsx("button", {
				onClick: handleUndo,
				className: "text-primary hover:text-primary-dark text-sm font-semibold transition-colors",
				children: "Undo"
			}),
			/* @__PURE__ */ jsx("div", {
				className: "absolute bottom-0 left-0 h-0.5 w-full overflow-hidden rounded-b-xl",
				children: /* @__PURE__ */ jsx("div", {
					className: "bg-primary h-full origin-left",
					style: { animation: `shrink ${duration}ms linear forwards` }
				})
			})
		]
	}), document.body);
}
//#endregion
//#region resources/js/lib/toast.ts
var EVENT_NAME = "app:toast";
/** Subscribe to toast events. Returns an unsubscribe function. */
function onToast(handler) {
	function listener(e) {
		handler(e.detail);
	}
	window.addEventListener(EVENT_NAME, listener);
	return () => window.removeEventListener(EVENT_NAME, listener);
}
//#endregion
//#region resources/js/components/ui/Toast.tsx
var ICONS = {
	success: /* @__PURE__ */ jsx(CheckCircle, { className: "text-success h-4 w-4 shrink-0" }),
	error: /* @__PURE__ */ jsx(XCircle, { className: "text-danger h-4 w-4 shrink-0" }),
	info: /* @__PURE__ */ jsx(Info, { className: "text-primary h-4 w-4 shrink-0" })
};
var BORDER = {
	success: "border-success/30",
	error: "border-danger/30",
	info: "border-primary/30"
};
var BAR = {
	success: "bg-success",
	error: "bg-danger",
	info: "bg-primary"
};
function ToastItem({ id, message, variant, duration = 4e3, onDismiss }) {
	const [visible, setVisible] = useState(false);
	useEffect(() => {
		const frame = requestAnimationFrame(() => setVisible(true));
		const timer = setTimeout(() => {
			setVisible(false);
			setTimeout(() => onDismiss(id), 300);
		}, duration);
		return () => {
			cancelAnimationFrame(frame);
			clearTimeout(timer);
		};
	}, []);
	function handleClose() {
		setVisible(false);
		setTimeout(() => onDismiss(id), 300);
	}
	return /* @__PURE__ */ jsxs("div", {
		role: "alert",
		"aria-live": "assertive",
		className: cn("relative flex w-full max-w-sm items-start gap-3 overflow-hidden", "bg-bg rounded-xl border px-4 py-3 shadow-lg", "transition-all duration-300", BORDER[variant], visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"),
		children: [
			ICONS[variant],
			/* @__PURE__ */ jsx("p", {
				className: "text-text flex-1 text-sm",
				children: message
			}),
			/* @__PURE__ */ jsx("button", {
				onClick: handleClose,
				className: "text-text-tertiary hover:text-text shrink-0 transition-colors",
				"aria-label": "Dismiss",
				children: /* @__PURE__ */ jsx(X, { className: "h-3.5 w-3.5" })
			}),
			/* @__PURE__ */ jsx("div", {
				className: "absolute bottom-0 left-0 h-0.5 w-full overflow-hidden rounded-b-xl",
				children: /* @__PURE__ */ jsx("div", {
					className: cn("h-full origin-left", BAR[variant]),
					style: { animation: `shrink ${duration}ms linear forwards` }
				})
			})
		]
	});
}
var nextId = 0;
/**
* Mount this once in the authenticated layout. It listens for `showToast()`
* calls and renders stacked toasts in the bottom-right corner.
*/
function ToastRegion() {
	const [toasts, setToasts] = useState([]);
	useEffect(() => {
		return onToast((event) => {
			const id = ++nextId;
			setToasts((prev) => [...prev, {
				...event,
				id
			}]);
		});
	}, []);
	function dismiss(id) {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}
	if (toasts.length === 0) return null;
	return createPortal(/* @__PURE__ */ jsx("div", {
		"aria-label": "Notifications",
		className: "fixed right-4 bottom-8 z-50 flex flex-col items-end gap-2 sm:right-6",
		children: toasts.map((toast) => /* @__PURE__ */ jsx(ToastItem, {
			...toast,
			onDismiss: dismiss
		}, toast.id))
	}), document.body);
}
//#endregion
//#region resources/js/hooks/useProjects.ts
var PROJECTS_KEY = ["projects"];
function useUpdateProjectMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({ id, ...data }) => {
			return (await axios_default.put(`/api/v1/projects/${id}`, data)).data.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: PROJECTS_KEY });
			router.reload();
		}
	});
}
function useDeleteProjectMutation() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (id) => {
			await axios_default.delete(`/api/v1/projects/${id}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: PROJECTS_KEY });
			router.reload();
		}
	});
}
//#endregion
//#region resources/js/echo.ts
window.Pusher = Pusher;
var cfg = typeof window !== "undefined" ? window.__CONFIG__ : null;
var key = cfg?.reverbAppKey ?? null;
var echo = key ? new Echo({
	broadcaster: "reverb",
	key,
	wsHost: cfg?.reverbHost ?? "",
	wsPort: cfg?.reverbPort ?? 80,
	wssPort: cfg?.reverbPort ?? 443,
	forceTLS: (cfg?.reverbScheme ?? "https") === "https",
	enabledTransports: ["ws", "wss"]
}) : null;
//#endregion
//#region resources/js/hooks/useBroadcast.ts
/**
* Debounce a function so rapid-fire calls (e.g. reordering N tasks) only
* trigger one refresh.
*/
function debounce(fn, ms) {
	let timer;
	return ((...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => fn(...args), ms);
	});
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
function useBroadcast() {
	const queryClient = useQueryClient();
	const { auth, groups } = usePage().props;
	const groupsRef = useRef(groups);
	groupsRef.current = groups;
	const userId = auth.user?.id;
	useEffect(() => {
		if (!userId || !echo) return;
		const echoInstance = echo;
		const refresh = debounce(() => {
			queryClient.invalidateQueries();
			router.reload();
		}, 150);
		echoInstance.private(`App.Models.User.${userId}`).listen("TaskCreated", refresh).listen("TaskUpdated", refresh).listen("TaskDeleted", refresh).listen("TaskCompleted", refresh).listen("TaskUncompleted", refresh).listen("TasksReordered", refresh).listen("ProjectCreated", refresh).listen("ProjectUpdated", refresh).listen("ProjectDeleted", refresh).listen("SectionCreated", refresh).listen("SectionUpdated", refresh).listen("SectionDeleted", refresh).listen("HeadingCreated", refresh).listen("HeadingUpdated", refresh).listen("HeadingDeleted", refresh).listen("HeadingsReordered", refresh).listen("ChecklistItemChanged", refresh).listen("ReminderChanged", refresh).listen("GroupMemberRemoved", refresh).listen("GroupDeleted", refresh);
		const groupChannels = groupsRef.current.map((group) => {
			const ch = echoInstance.private(`groups.${group.id}`);
			ch.listen("TaskCreated", refresh).listen("TaskUpdated", refresh).listen("TaskDeleted", refresh).listen("TaskCompleted", refresh).listen("TaskUncompleted", refresh).listen("GroupUpdated", refresh).listen("GroupMemberRemoved", refresh).listen("GroupMemberJoined", refresh).listen("GroupTasksShared", refresh).listen("ChecklistItemChanged", refresh);
			return {
				id: group.id,
				channel: ch
			};
		});
		return () => {
			echoInstance.leave(`App.Models.User.${userId}`);
			groupChannels.forEach(({ id }) => echoInstance.leave(`groups.${id}`));
		};
	}, [userId, groups.map((g) => g.id).join(",")]);
}
//#endregion
//#region resources/js/routes/projects/headings/index.ts
/**
* @see \App\Http\Controllers\Web\HeadingController::store
* @see Http/Controllers/Web/HeadingController.php:20
* @route '/projects/{project}/headings'
*/
var store$1 = (args, options) => ({
	url: store$1.url(args, options),
	method: "post"
});
store$1.definition = {
	methods: ["post"],
	url: "/projects/{project}/headings"
};
/**
* @see \App\Http\Controllers\Web\HeadingController::store
* @see Http/Controllers/Web/HeadingController.php:20
* @route '/projects/{project}/headings'
*/
store$1.url = (args, options) => {
	if (typeof args === "string" || typeof args === "number") args = { project: args };
	if (typeof args === "object" && !Array.isArray(args) && "id" in args) args = { project: args.id };
	if (Array.isArray(args)) args = { project: args[0] };
	args = applyUrlDefaults(args);
	const parsedArgs = { project: typeof args.project === "object" ? args.project.id : args.project };
	return store$1.definition.url.replace("{project}", parsedArgs.project.toString()).replace(/\/+$/, "") + queryParams(options);
};
/**
* @see \App\Http\Controllers\Web\HeadingController::store
* @see Http/Controllers/Web/HeadingController.php:20
* @route '/projects/{project}/headings'
*/
store$1.post = (args, options) => ({
	url: store$1.url(args, options),
	method: "post"
});
var headings = { store: Object.assign(store$1, store$1) };
//#endregion
//#region resources/js/routes/projects/index.ts
/**
* @see \App\Http\Controllers\Web\ProjectController::index
* @see Http/Controllers/Web/ProjectController.php:41
* @route '/projects'
*/
var index = (options) => ({
	url: index.url(options),
	method: "get"
});
index.definition = {
	methods: ["get", "head"],
	url: "/projects"
};
/**
* @see \App\Http\Controllers\Web\ProjectController::index
* @see Http/Controllers/Web/ProjectController.php:41
* @route '/projects'
*/
index.url = (options) => {
	return index.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Web\ProjectController::index
* @see Http/Controllers/Web/ProjectController.php:41
* @route '/projects'
*/
index.get = (options) => ({
	url: index.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Web\ProjectController::index
* @see Http/Controllers/Web/ProjectController.php:41
* @route '/projects'
*/
index.head = (options) => ({
	url: index.url(options),
	method: "head"
});
/**
* @see \App\Http\Controllers\Web\ProjectController::create
* @see Http/Controllers/Web/ProjectController.php:55
* @route '/projects/create'
*/
var create = (options) => ({
	url: create.url(options),
	method: "get"
});
create.definition = {
	methods: ["get", "head"],
	url: "/projects/create"
};
/**
* @see \App\Http\Controllers\Web\ProjectController::create
* @see Http/Controllers/Web/ProjectController.php:55
* @route '/projects/create'
*/
create.url = (options) => {
	return create.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Web\ProjectController::create
* @see Http/Controllers/Web/ProjectController.php:55
* @route '/projects/create'
*/
create.get = (options) => ({
	url: create.url(options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Web\ProjectController::create
* @see Http/Controllers/Web/ProjectController.php:55
* @route '/projects/create'
*/
create.head = (options) => ({
	url: create.url(options),
	method: "head"
});
/**
* @see \App\Http\Controllers\Web\ProjectController::store
* @see Http/Controllers/Web/ProjectController.php:70
* @route '/projects'
*/
var store = (options) => ({
	url: store.url(options),
	method: "post"
});
store.definition = {
	methods: ["post"],
	url: "/projects"
};
/**
* @see \App\Http\Controllers\Web\ProjectController::store
* @see Http/Controllers/Web/ProjectController.php:70
* @route '/projects'
*/
store.url = (options) => {
	return store.definition.url + queryParams(options);
};
/**
* @see \App\Http\Controllers\Web\ProjectController::store
* @see Http/Controllers/Web/ProjectController.php:70
* @route '/projects'
*/
store.post = (options) => ({
	url: store.url(options),
	method: "post"
});
/**
* @see \App\Http\Controllers\Web\ProjectController::show
* @see Http/Controllers/Web/ProjectController.php:88
* @route '/projects/{project}'
*/
var show = (args, options) => ({
	url: show.url(args, options),
	method: "get"
});
show.definition = {
	methods: ["get", "head"],
	url: "/projects/{project}"
};
/**
* @see \App\Http\Controllers\Web\ProjectController::show
* @see Http/Controllers/Web/ProjectController.php:88
* @route '/projects/{project}'
*/
show.url = (args, options) => {
	if (typeof args === "string" || typeof args === "number") args = { project: args };
	if (typeof args === "object" && !Array.isArray(args) && "id" in args) args = { project: args.id };
	if (Array.isArray(args)) args = { project: args[0] };
	args = applyUrlDefaults(args);
	const parsedArgs = { project: typeof args.project === "object" ? args.project.id : args.project };
	return show.definition.url.replace("{project}", parsedArgs.project.toString()).replace(/\/+$/, "") + queryParams(options);
};
/**
* @see \App\Http\Controllers\Web\ProjectController::show
* @see Http/Controllers/Web/ProjectController.php:88
* @route '/projects/{project}'
*/
show.get = (args, options) => ({
	url: show.url(args, options),
	method: "get"
});
/**
* @see \App\Http\Controllers\Web\ProjectController::show
* @see Http/Controllers/Web/ProjectController.php:88
* @route '/projects/{project}'
*/
show.head = (args, options) => ({
	url: show.url(args, options),
	method: "head"
});
Object.assign(index, index), Object.assign(create, create), Object.assign(store, store), Object.assign(show, show), Object.assign(headings, headings);
//#endregion
//#region resources/js/layouts/AuthenticatedLayout.tsx
var NAV_ITEMS = [
	{
		label: "Inbox",
		href: "/inbox",
		context: "inbox",
		icon: Inbox,
		showBadge: true
	},
	{
		label: "Today",
		href: "/today",
		context: "today",
		icon: Sun,
		showBadge: true
	},
	{
		label: "Upcoming",
		href: "/upcoming",
		context: "upcoming",
		icon: Calendar,
		showBadge: true
	},
	{
		label: "Anytime",
		href: "/anytime",
		context: "anytime",
		icon: Layers,
		showBadge: true
	},
	{
		label: "Someday",
		href: "/someday",
		context: "someday",
		icon: Archive,
		showBadge: true
	},
	{
		label: "Logbook",
		href: "/logbook",
		context: "logbook",
		icon: BookOpen,
		showBadge: false
	}
];
/** Droppable ID helpers */
var navDropId = (context) => `nav:${context}`;
var projDropId = (id) => `project:${id}`;
var sectDropId = (id) => `section:${id}`;
function isActive(href, currentUrl) {
	return currentUrl === href || currentUrl.startsWith(href + "/") || currentUrl.startsWith(href + "?");
}
function DroppableNavItem({ item, currentUrl, isDragging, onNavigate, count }) {
	const { setNodeRef, isOver } = useDroppable({ id: navDropId(item.context) });
	const Icon = item.icon;
	const active = isActive(item.href, currentUrl);
	const showCount = item.showBadge && count != null && count > 0;
	return /* @__PURE__ */ jsxs(Link, {
		ref: setNodeRef,
		href: item.href,
		onClick: onNavigate,
		className: cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors", active ? "bg-sidebar-active text-primary" : "text-text-secondary hover:bg-sidebar-hover hover:text-text", isDragging && isOver && "ring-primary bg-primary/10 text-primary ring-2 ring-inset"),
		children: [
			/* @__PURE__ */ jsx(Icon, { className: cn("h-4.5 w-4.5 shrink-0", active || isDragging && isOver ? "text-primary" : "text-text-tertiary") }),
			/* @__PURE__ */ jsx("span", {
				className: "flex-1 truncate",
				children: item.label
			}),
			showCount && /* @__PURE__ */ jsx("span", {
				className: cn("ml-auto min-w-[1.25rem] rounded-full px-1.5 py-0.5 text-center text-xs leading-none font-medium tabular-nums", active || isDragging && isOver ? "bg-primary/15 text-primary" : "bg-bg-tertiary text-text-tertiary"),
				children: count
			})
		]
	});
}
function DroppableProjectItem({ project, currentUrl, isDragging, onNavigate, onAction }) {
	const { setNodeRef, isOver } = useDroppable({ id: projDropId(project.id) });
	const projectUrl = `/projects/${project.id}`;
	const active = isActive(projectUrl, currentUrl);
	const incompleteCount = project.task_count - project.completed_task_count;
	const showCount = incompleteCount > 0;
	return /* @__PURE__ */ jsxs("div", {
		ref: setNodeRef,
		className: cn("group/item flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors", active ? "bg-sidebar-active text-primary" : "text-text-secondary hover:bg-sidebar-hover hover:text-text", isDragging && isOver && "ring-primary bg-primary/10 text-primary ring-2 ring-inset"),
		children: [/* @__PURE__ */ jsxs(Link, {
			href: projectUrl,
			onClick: onNavigate,
			className: "flex min-w-0 flex-1 items-center gap-3",
			children: [/* @__PURE__ */ jsx(FolderOpen, { className: cn("h-4 w-4 shrink-0", isDragging && isOver ? "text-primary" : "text-text-tertiary") }), /* @__PURE__ */ jsx("span", {
				className: "flex-1 truncate",
				children: project.name
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "relative h-5 w-5 shrink-0",
			children: [showCount && /* @__PURE__ */ jsx("span", {
				className: cn("absolute inset-0 hidden items-center justify-center rounded-full text-xs leading-none font-medium tabular-nums lg:flex lg:group-hover/item:invisible", active || isDragging && isOver ? "bg-primary/15 text-primary" : "bg-bg-tertiary text-text-tertiary"),
				children: incompleteCount
			}), /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
				asChild: true,
				children: /* @__PURE__ */ jsx("button", {
					className: cn("text-text-tertiary hover:text-text absolute inset-0 flex items-center justify-center rounded transition-colors lg:invisible lg:group-hover/item:visible", active && "text-primary/60 hover:text-primary"),
					onClick: (e) => e.stopPropagation(),
					children: /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-3.5 w-3.5" })
				})
			}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
				align: "start",
				side: "bottom",
				className: "w-40",
				children: [
					/* @__PURE__ */ jsxs(DropdownMenuItem, {
						onSelect: () => onAction("rename", project),
						children: [/* @__PURE__ */ jsx(Pencil, { className: "mr-2 h-4 w-4" }), "Rename"]
					}),
					/* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
					/* @__PURE__ */ jsxs(DropdownMenuItem, {
						onSelect: () => onAction("delete", project),
						className: "text-danger focus:text-danger",
						children: [/* @__PURE__ */ jsx(Trash2, { className: "mr-2 h-4 w-4" }), "Delete"]
					})
				]
			})] })]
		})]
	});
}
function DroppableSectionItem({ section, isDragging, onAction }) {
	const { setNodeRef, isOver } = useDroppable({ id: sectDropId(section.id) });
	return /* @__PURE__ */ jsxs("div", {
		ref: setNodeRef,
		className: cn("group/item text-text-secondary flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors", isDragging && "hover:bg-sidebar-hover cursor-copy", isDragging && isOver && "ring-primary bg-primary/10 text-primary ring-2 ring-inset", !isDragging && "hover:bg-sidebar-hover hover:text-text"),
		children: [
			/* @__PURE__ */ jsx(LayoutList, { className: cn("h-4 w-4 shrink-0", isDragging && isOver ? "text-primary" : "text-text-tertiary") }),
			/* @__PURE__ */ jsx("span", {
				className: "flex-1 truncate",
				children: section.name
			}),
			/* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
				asChild: true,
				children: /* @__PURE__ */ jsx("button", {
					className: "text-text-tertiary hover:text-text flex h-5 w-5 shrink-0 items-center justify-center rounded transition-colors lg:invisible lg:group-hover/item:visible",
					onClick: (e) => e.stopPropagation(),
					children: /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-3.5 w-3.5" })
				})
			}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
				align: "start",
				side: "bottom",
				className: "w-40",
				children: [
					/* @__PURE__ */ jsxs(DropdownMenuItem, {
						onSelect: () => onAction("rename", section),
						children: [/* @__PURE__ */ jsx(Pencil, { className: "mr-2 h-4 w-4" }), "Rename"]
					}),
					/* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
					/* @__PURE__ */ jsxs(DropdownMenuItem, {
						onSelect: () => onAction("delete", section),
						className: "text-danger focus:text-danger",
						children: [/* @__PURE__ */ jsx(Trash2, { className: "mr-2 h-4 w-4" }), "Delete"]
					})
				]
			})] })
		]
	});
}
function DraggableFab({ onTap, isDragging }) {
	const { attributes, listeners, setNodeRef, transform, isDragging: selfDragging } = useDraggable({ id: "fab" });
	return /* @__PURE__ */ jsx("button", {
		ref: setNodeRef,
		style: selfDragging ? { opacity: 0 } : transform ? { transform: CSS.Translate.toString(transform) } : void 0,
		...listeners,
		...attributes,
		onClick: onTap,
		className: cn("fixed right-6 bottom-6 z-30", "bg-primary flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg", "hover:bg-primary-dark transition-colors duration-150", isDragging && "cursor-grabbing"),
		"aria-label": "New task",
		children: /* @__PURE__ */ jsx(Plus, { className: "h-6 w-6" })
	});
}
function AddSectionDialog({ open, onOpenChange }) {
	const [name, setName] = useState("");
	const [error, setError] = useState("");
	const createSection = useSectionMutation();
	function handleSubmit(e) {
		e.preventDefault();
		setError("");
		if (!name.trim()) {
			setError("Section name is required.");
			return;
		}
		createSection.mutate({ name: name.trim() }, {
			onSuccess: () => {
				setName("");
				setError("");
				onOpenChange(false);
			},
			onError: (err) => {
				const axiosError = err;
				setError(axiosError.response?.data?.errors?.name?.[0] ?? axiosError.response?.data?.message ?? "Failed to create section.");
			}
		});
	}
	return /* @__PURE__ */ jsx(DialogPrimitive.Root, {
		open,
		onOpenChange: (value) => {
			if (!value) {
				setName("");
				setError("");
			}
			onOpenChange(value);
		},
		children: /* @__PURE__ */ jsxs(DialogPrimitive.Portal, { children: [/* @__PURE__ */ jsx(DialogPrimitive.Overlay, { className: "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 fixed inset-0 bg-black/40" }), /* @__PURE__ */ jsxs(DialogPrimitive.Content, {
			className: "border-border bg-bg text-text data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-6 shadow-lg focus:outline-none",
			children: [
				/* @__PURE__ */ jsx(DialogPrimitive.Title, {
					className: "text-text text-lg font-semibold",
					children: "New Section"
				}),
				/* @__PURE__ */ jsx(DialogPrimitive.Description, {
					className: "text-text-secondary mt-1 text-sm",
					children: "Create a new section to group your projects."
				}),
				/* @__PURE__ */ jsxs("form", {
					onSubmit: handleSubmit,
					className: "mt-6 space-y-4",
					children: [/* @__PURE__ */ jsx(Input, {
						label: "Section name",
						value: name,
						onChange: (e) => setName(e.target.value),
						error,
						placeholder: "e.g., Work, Personal",
						autoFocus: true
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex justify-end gap-3 pt-2",
						children: [/* @__PURE__ */ jsx(DialogPrimitive.Close, {
							asChild: true,
							children: /* @__PURE__ */ jsx(Button, {
								type: "button",
								variant: "ghost",
								children: "Cancel"
							})
						}), /* @__PURE__ */ jsx(Button, {
							type: "submit",
							disabled: createSection.isPending,
							children: createSection.isPending ? "Creating..." : "Create Section"
						})]
					})]
				})
			]
		})] })
	});
}
function RenameDialog({ open, onOpenChange, currentName, entityType, onRename, isPending }) {
	const [name, setName] = useState(currentName);
	const [error, setError] = useState("");
	useEffect(() => {
		if (open) {
			setName(currentName);
			setError("");
		}
	}, [open, currentName]);
	function handleSubmit(e) {
		e.preventDefault();
		setError("");
		if (!name.trim()) {
			setError("Name is required.");
			return;
		}
		onRename(name.trim());
	}
	const label = entityType === "project" ? "Project" : "Section";
	return /* @__PURE__ */ jsx(DialogPrimitive.Root, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ jsxs(DialogPrimitive.Portal, { children: [/* @__PURE__ */ jsx(DialogPrimitive.Overlay, { className: "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 fixed inset-0 bg-black/40" }), /* @__PURE__ */ jsxs(DialogPrimitive.Content, {
			className: "border-border bg-bg text-text data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-6 shadow-lg focus:outline-none",
			children: [
				/* @__PURE__ */ jsxs(DialogPrimitive.Title, {
					className: "text-text text-lg font-semibold",
					children: ["Rename ", label]
				}),
				/* @__PURE__ */ jsxs(DialogPrimitive.Description, {
					className: "text-text-secondary mt-1 text-sm",
					children: [
						"Enter a new name for this ",
						entityType,
						"."
					]
				}),
				/* @__PURE__ */ jsxs("form", {
					onSubmit: handleSubmit,
					className: "mt-6 space-y-4",
					children: [/* @__PURE__ */ jsx(Input, {
						label: `${label} name`,
						value: name,
						onChange: (e) => setName(e.target.value),
						error,
						autoFocus: true
					}), /* @__PURE__ */ jsxs("div", {
						className: "flex justify-end gap-3 pt-2",
						children: [/* @__PURE__ */ jsx(DialogPrimitive.Close, {
							asChild: true,
							children: /* @__PURE__ */ jsx(Button, {
								type: "button",
								variant: "ghost",
								children: "Cancel"
							})
						}), /* @__PURE__ */ jsx(Button, {
							type: "submit",
							disabled: isPending,
							children: isPending ? "Saving..." : "Save"
						})]
					})]
				})
			]
		})] })
	});
}
function DeleteConfirmDialog({ open, onOpenChange, entityName, entityType, onConfirm, isPending }) {
	const label = entityType === "project" ? "project" : "section";
	return /* @__PURE__ */ jsx(DialogPrimitive.Root, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ jsxs(DialogPrimitive.Portal, { children: [/* @__PURE__ */ jsx(DialogPrimitive.Overlay, { className: "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 fixed inset-0 bg-black/40" }), /* @__PURE__ */ jsxs(DialogPrimitive.Content, {
			className: "border-border bg-bg text-text data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-6 shadow-lg focus:outline-none",
			children: [
				/* @__PURE__ */ jsxs(DialogPrimitive.Title, {
					className: "text-text text-lg font-semibold",
					children: ["Delete ", entityType === "project" ? "Project" : "Section"]
				}),
				/* @__PURE__ */ jsxs(DialogPrimitive.Description, {
					className: "text-text-secondary mt-1 text-sm",
					children: [
						"Are you sure you want to delete",
						" ",
						/* @__PURE__ */ jsx("span", {
							className: "text-text font-medium",
							children: entityName
						}),
						"?",
						entityType === "project" ? " The project and its headings will be removed. Tasks will be kept but unassigned from the project." : " Projects and tasks in this section will be kept but unassigned from the section."
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6 flex justify-end gap-3",
					children: [/* @__PURE__ */ jsx(DialogPrimitive.Close, {
						asChild: true,
						children: /* @__PURE__ */ jsx(Button, {
							type: "button",
							variant: "ghost",
							children: "Cancel"
						})
					}), /* @__PURE__ */ jsx(Button, {
						variant: "destructive",
						onClick: onConfirm,
						disabled: isPending,
						children: isPending ? "Deleting..." : `Delete ${label}`
					})]
				})
			]
		})] })
	});
}
function SidebarContent({ currentUrl, projects, sections, groups, user, isDragging, onNavigate, taskCounts, onAddSection, onProjectAction, onSectionAction }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex h-full flex-col",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "flex h-14 items-center px-5",
				children: /* @__PURE__ */ jsx(Link, {
					href: "/",
					className: "text-text text-lg font-bold tracking-tight",
					onClick: onNavigate,
					children: "Donezo"
				})
			}),
			/* @__PURE__ */ jsxs(ScrollArea, {
				className: "flex-1 px-3",
				children: [
					/* @__PURE__ */ jsx("nav", {
						className: "space-y-0.5 py-2",
						children: NAV_ITEMS.map((item) => /* @__PURE__ */ jsx(DroppableNavItem, {
							item,
							currentUrl,
							isDragging,
							onNavigate,
							count: taskCounts[item.context]
						}, item.href))
					}),
					/* @__PURE__ */ jsx(Separator, { className: "my-2" }),
					/* @__PURE__ */ jsxs("div", {
						className: "py-2",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between px-3 py-1.5",
							children: [/* @__PURE__ */ jsx(Link, {
								href: index.url(),
								onClick: onNavigate,
								className: "text-text-tertiary hover:text-text text-xs font-semibold tracking-wider uppercase transition-colors",
								children: "Projects"
							}), /* @__PURE__ */ jsx(Link, {
								href: "/projects/create",
								onClick: onNavigate,
								children: /* @__PURE__ */ jsx(Button, {
									variant: "ghost",
									size: "icon",
									className: "text-text-tertiary hover:text-text h-5 w-5",
									children: /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" })
								})
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "space-y-0.5",
							children: [projects.map((project) => /* @__PURE__ */ jsx(DroppableProjectItem, {
								project,
								currentUrl,
								isDragging,
								onNavigate,
								onAction: onProjectAction
							}, project.id)), projects.length === 0 && /* @__PURE__ */ jsx("p", {
								className: "text-text-tertiary px-3 py-2 text-xs",
								children: "No projects yet"
							})]
						})]
					}),
					/* @__PURE__ */ jsx(Separator, { className: "my-2" }),
					/* @__PURE__ */ jsxs("div", {
						className: "py-2",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between px-3 py-1.5",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-text-tertiary text-xs font-semibold tracking-wider uppercase",
								children: "Sections"
							}), /* @__PURE__ */ jsx(Button, {
								variant: "ghost",
								size: "icon",
								className: "text-text-tertiary hover:text-text h-5 w-5",
								onClick: onAddSection,
								children: /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" })
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "space-y-0.5",
							children: [sections.map((section) => /* @__PURE__ */ jsx(DroppableSectionItem, {
								section,
								isDragging,
								onAction: onSectionAction
							}, section.id)), sections.length === 0 && /* @__PURE__ */ jsx("p", {
								className: "text-text-tertiary px-3 py-2 text-xs",
								children: "No sections yet"
							})]
						})]
					}),
					/* @__PURE__ */ jsx(Separator, { className: "my-2" }),
					/* @__PURE__ */ jsxs("div", {
						className: "py-2",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between px-3 py-1.5",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-text-tertiary text-xs font-semibold tracking-wider uppercase",
								children: "Groups"
							}), /* @__PURE__ */ jsx(Link, {
								href: "/groups",
								onClick: onNavigate,
								children: /* @__PURE__ */ jsx(Button, {
									variant: "ghost",
									size: "icon",
									className: "text-text-tertiary hover:text-text h-5 w-5",
									children: /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" })
								})
							})]
						}), /* @__PURE__ */ jsxs("div", {
							className: "space-y-0.5",
							children: [groups.map((group) => {
								const groupUrl = `/groups/${group.id}`;
								return /* @__PURE__ */ jsxs(Link, {
									href: groupUrl,
									onClick: onNavigate,
									className: cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors", isActive(groupUrl, currentUrl) ? "bg-sidebar-active text-primary" : "text-text-secondary hover:bg-sidebar-hover hover:text-text"),
									children: [/* @__PURE__ */ jsx(Users, { className: "text-text-tertiary h-4 w-4" }), /* @__PURE__ */ jsx("span", {
										className: "truncate",
										children: group.name
									})]
								}, group.id);
							}), groups.length === 0 && /* @__PURE__ */ jsx("p", {
								className: "text-text-tertiary px-3 py-2 text-xs",
								children: "No groups yet"
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "px-5 pb-1",
				children: /* @__PURE__ */ jsxs("span", {
					className: "text-text-tertiary text-[10px]",
					children: ["v", usePage().props.app_version]
				})
			}),
			/* @__PURE__ */ jsx("div", {
				className: "border-border border-t p-3",
				children: /* @__PURE__ */ jsxs(DropdownMenu, { children: [/* @__PURE__ */ jsx(DropdownMenuTrigger, {
					asChild: true,
					children: /* @__PURE__ */ jsxs("button", {
						className: "hover:bg-sidebar-hover flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
						children: [/* @__PURE__ */ jsx("div", {
							className: "bg-primary flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium text-white",
							children: user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
						}), /* @__PURE__ */ jsxs("div", {
							className: "min-w-0 flex-1 text-left",
							children: [/* @__PURE__ */ jsx("p", {
								className: "text-text truncate text-sm font-medium",
								children: user.name
							}), /* @__PURE__ */ jsx("p", {
								className: "text-text-tertiary truncate text-xs",
								children: user.email
							})]
						})]
					})
				}), /* @__PURE__ */ jsxs(DropdownMenuContent, {
					align: "start",
					side: "top",
					className: "w-56",
					children: [
						/* @__PURE__ */ jsxs(DropdownMenuItem, {
							onSelect: () => router.visit("/settings"),
							children: [/* @__PURE__ */ jsx(Settings, { className: "mr-2 h-4 w-4" }), "Settings"]
						}),
						/* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
						/* @__PURE__ */ jsxs(DropdownMenuItem, {
							onSelect: () => router.post("/logout"),
							className: "text-danger focus:text-danger",
							children: [/* @__PURE__ */ jsx(LogOut, { className: "mr-2 h-4 w-4" }), "Log out"]
						})
					]
				})] })
			})
		]
	});
}
function AuthenticatedLayout({ children, title, taskContext, defaultProjectId, defaultGroupId }) {
	const { auth, task_counts: taskCounts = {}, projects = [], sections = [], groups = [] } = usePage().props;
	const currentUrl = usePage().url;
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
	const [addTaskOpen, setAddTaskOpen] = useState(false);
	const [addSectionOpen, setAddSectionOpen] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const [undoTask, setUndoTask] = useState(null);
	const completeTaskMutation = useCompleteTaskMutation();
	const [renameTarget, setRenameTarget] = useState(null);
	const [deleteTarget, setDeleteTarget] = useState(null);
	useBroadcast();
	const updateProject = useUpdateProjectMutation();
	const deleteProject = useDeleteProjectMutation();
	const updateSection = useUpdateSectionMutation();
	const deleteSection = useDeleteSectionMutation();
	function handleProjectAction(action, project) {
		if (action === "rename") setRenameTarget({
			id: project.id,
			name: project.name,
			type: "project"
		});
		else setDeleteTarget({
			id: project.id,
			name: project.name,
			type: "project"
		});
	}
	function handleSectionAction(action, section) {
		if (action === "rename") setRenameTarget({
			id: section.id,
			name: section.name,
			type: "section"
		});
		else setDeleteTarget({
			id: section.id,
			name: section.name,
			type: "section"
		});
	}
	function handleRename(newName) {
		if (!renameTarget) return;
		(renameTarget.type === "project" ? updateProject : updateSection).mutate({
			id: renameTarget.id,
			name: newName
		}, { onSuccess: () => setRenameTarget(null) });
	}
	function handleDeleteConfirm() {
		if (!deleteTarget) return;
		(deleteTarget.type === "project" ? deleteProject : deleteSection).mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
	}
	useEffect(() => {
		function handleTaskCompleted(e) {
			const { id, title } = e.detail;
			setUndoTask({
				id,
				title
			});
		}
		window.addEventListener("task-completed", handleTaskCompleted);
		return () => window.removeEventListener("task-completed", handleTaskCompleted);
	}, []);
	const [resolvedContext, setResolvedContext] = useState(taskContext);
	const [resolvedProjectId, setResolvedProjectId] = useState(defaultProjectId);
	const [resolvedGroupId, setResolvedGroupId] = useState(defaultGroupId);
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
	useEffect(() => {
		function handleKeyDown(e) {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				setCommandPaletteOpen((prev) => !prev);
			}
		}
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, []);
	function handleDragStart(event) {
		if (String(event.active.id) !== "fab") return;
		setIsDragging(true);
		setSidebarOpen(true);
	}
	function handleDragEnd(event) {
		setIsDragging(false);
		const { over } = event;
		if (!over) return;
		const id = String(over.id);
		if (id.startsWith("nav:")) {
			const context = id.slice(4);
			if (context === "logbook") return;
			setResolvedContext(context);
			setResolvedProjectId(void 0);
		} else if (id.startsWith("project:")) {
			const projectId = Number(id.slice(8));
			setResolvedContext("project");
			setResolvedProjectId(projectId);
		} else if (id.startsWith("section:")) {
			setResolvedContext("inbox");
			setResolvedProjectId(void 0);
		} else return;
		setAddTaskOpen(true);
	}
	function handleFabTap() {
		setResolvedContext(taskContext);
		setResolvedProjectId(defaultProjectId);
		setResolvedGroupId(defaultGroupId);
		setAddTaskOpen(true);
	}
	return /* @__PURE__ */ jsx(DndContext, {
		sensors,
		onDragStart: handleDragStart,
		onDragEnd: handleDragEnd,
		children: /* @__PURE__ */ jsxs("div", {
			className: "bg-bg-secondary text-text flex h-screen",
			children: [
				sidebarOpen && /* @__PURE__ */ jsx("div", {
					className: "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-200 lg:hidden",
					onClick: () => {
						if (!isDragging) setSidebarOpen(false);
					}
				}),
				/* @__PURE__ */ jsxs("aside", {
					className: cn("border-border bg-sidebar fixed inset-y-0 left-0 z-50 w-64 transform border-r transition-transform duration-250 ease-in-out lg:static lg:translate-x-0", sidebarOpen ? "translate-x-0" : "-translate-x-full"),
					children: [/* @__PURE__ */ jsx("div", {
						className: "absolute top-3 right-2 lg:hidden",
						children: /* @__PURE__ */ jsx(Button, {
							variant: "ghost",
							size: "icon",
							onClick: () => setSidebarOpen(false),
							className: "text-text-tertiary h-8 w-8",
							children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
						})
					}), /* @__PURE__ */ jsx(SidebarContent, {
						currentUrl,
						projects,
						sections,
						groups,
						user: auth.user,
						isDragging,
						onNavigate: () => setSidebarOpen(false),
						taskCounts,
						onAddSection: () => setAddSectionOpen(true),
						onProjectAction: handleProjectAction,
						onSectionAction: handleSectionAction
					})]
				}),
				/* @__PURE__ */ jsxs("main", {
					className: "flex flex-1 flex-col overflow-hidden",
					children: [/* @__PURE__ */ jsxs("header", {
						className: "border-border-light bg-bg flex h-14 items-center gap-3 border-b px-4 lg:px-6",
						children: [
							/* @__PURE__ */ jsx(Button, {
								variant: "ghost",
								size: "icon",
								className: "lg:hidden",
								onClick: () => setSidebarOpen(true),
								children: /* @__PURE__ */ jsx(Menu, { className: "h-5 w-5" })
							}),
							title && /* @__PURE__ */ jsx("h1", {
								className: "text-text text-lg font-semibold",
								children: title
							}),
							/* @__PURE__ */ jsx("div", { className: "flex-1" }),
							/* @__PURE__ */ jsxs(Button, {
								variant: "ghost",
								className: "text-text-secondary gap-2",
								onClick: () => setCommandPaletteOpen(true),
								children: [
									/* @__PURE__ */ jsx(Search, { className: "h-4 w-4" }),
									/* @__PURE__ */ jsx("span", {
										className: "hidden text-sm sm:inline",
										children: "Quick Find"
									}),
									/* @__PURE__ */ jsxs("kbd", {
										className: "border-border bg-bg-secondary text-text-tertiary hidden rounded border px-1.5 py-0.5 text-[10px] font-medium sm:inline-block",
										children: [navigator.platform?.includes("Mac") ? "⌘" : "Ctrl+", "K"]
									})
								]
							})
						]
					}), /* @__PURE__ */ jsx("div", {
						className: "flex-1 overflow-y-auto pb-24",
						children: /* @__PURE__ */ jsx("div", {
							className: "mx-auto max-w-3xl px-4 py-6 lg:px-8",
							children
						})
					})]
				}),
				/* @__PURE__ */ jsx(DraggableFab, {
					onTap: handleFabTap,
					isDragging
				}),
				/* @__PURE__ */ jsx(DragOverlay, {
					dropAnimation: null,
					children: isDragging && /* @__PURE__ */ jsx("div", {
						className: "bg-primary flex h-14 w-14 scale-110 items-center justify-center rounded-full text-white opacity-90 shadow-2xl",
						children: /* @__PURE__ */ jsx(Plus, { className: "h-6 w-6" })
					})
				}),
				/* @__PURE__ */ jsx(CommandPalette, {
					open: commandPaletteOpen,
					onOpenChange: setCommandPaletteOpen
				}),
				/* @__PURE__ */ jsx(AddTaskDialog, {
					open: addTaskOpen,
					onOpenChange: setAddTaskOpen,
					context: resolvedContext,
					defaultProjectId: resolvedProjectId,
					defaultGroupId: resolvedGroupId
				}),
				/* @__PURE__ */ jsx(AddSectionDialog, {
					open: addSectionOpen,
					onOpenChange: setAddSectionOpen
				}),
				/* @__PURE__ */ jsx(RenameDialog, {
					open: renameTarget !== null,
					onOpenChange: (open) => {
						if (!open) setRenameTarget(null);
					},
					currentName: renameTarget?.name ?? "",
					entityType: renameTarget?.type ?? "project",
					onRename: handleRename,
					isPending: updateProject.isPending || updateSection.isPending
				}),
				/* @__PURE__ */ jsx(DeleteConfirmDialog, {
					open: deleteTarget !== null,
					onOpenChange: (open) => {
						if (!open) setDeleteTarget(null);
					},
					entityName: deleteTarget?.name ?? "",
					entityType: deleteTarget?.type ?? "project",
					onConfirm: handleDeleteConfirm,
					isPending: deleteProject.isPending || deleteSection.isPending
				}),
				undoTask && /* @__PURE__ */ jsx(UndoToast, {
					message: `"${undoTask.title}" completed`,
					onUndo: () => completeTaskMutation.mutate({
						id: undoTask.id,
						completed: false
					}),
					onDismiss: () => setUndoTask(null)
				}),
				/* @__PURE__ */ jsx(ToastRegion, {})
			]
		})
	});
}
//#endregion
export { Separator as C, DropdownMenuTrigger as S, DialogHeader as _, useSectionsQuery as a, DropdownMenuContent as b, useCompleteTaskMutation as c, useReorderTasksMutation as d, useToggleChecklistItemMutation as f, DialogFooter as g, DialogDescription as h, store$1 as i, useDeleteTaskMutation as l, DialogContent as m, show as n, TaskForm as o, Dialog as p, store as r, useTagsQuery as s, AuthenticatedLayout as t, useReorderHeadingsMutation as u, DialogTitle as v, DropdownMenuItem as x, DropdownMenu as y };
