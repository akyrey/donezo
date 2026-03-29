import { a as cn, i as Button } from "./wayfinder-C_mx6M06.js";
import { _ as DialogHeader, c as useCompleteTaskMutation, g as DialogFooter, h as DialogDescription, m as DialogContent, p as Dialog, t as AuthenticatedLayout, v as DialogTitle } from "./AuthenticatedLayout-BBEUssZw.js";
import { t as Checkbox } from "./Checkbox-Bar4Ffhq.js";
import { t as useAllTasksExport } from "./useExport-Bf91jMFP.js";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { BookOpen, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { format } from "date-fns";
//#region resources/js/pages/Logbook.tsx
function Logbook({ tasks }) {
	const prevLink = tasks.links.prev;
	const nextLink = tasks.links.next;
	const [taskToUncomplete, setTaskToUncomplete] = useState(null);
	const completeTask = useCompleteTaskMutation();
	const { isPending: isExporting, mutate: requestExport } = useAllTasksExport({ include_completed: true });
	function handleConfirmUncomplete() {
		if (!taskToUncomplete) return;
		completeTask.mutate({
			id: taskToUncomplete.id,
			completed: false
		}, { onSuccess: () => setTaskToUncomplete(null) });
	}
	return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
		/* @__PURE__ */ jsx(Head, { title: "Logbook" }),
		/* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-2xl px-4 py-8",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "mb-8",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ jsxs("h1", {
						className: "text-text flex items-center gap-3 text-2xl font-semibold",
						children: [/* @__PURE__ */ jsx(BookOpen, { className: "text-success h-6 w-6" }), "Logbook"]
					}), /* @__PURE__ */ jsxs(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => requestExport(),
						disabled: isExporting,
						title: "Export completed tasks as CSV",
						children: [/* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), isExporting ? "Requesting…" : "Export"]
					})]
				}), tasks.meta.total > 0 && /* @__PURE__ */ jsxs("p", {
					className: "text-text-secondary mt-1 text-sm",
					children: [
						tasks.meta.total,
						" completed ",
						tasks.meta.total === 1 ? "task" : "tasks"
					]
				})]
			}), tasks.data.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("ul", {
				className: "divide-border-light divide-y",
				children: tasks.data.map((task) => /* @__PURE__ */ jsxs("li", {
					className: "flex items-start gap-3 py-3",
					children: [/* @__PURE__ */ jsx(Checkbox, {
						checked: true,
						className: "mt-0.5 cursor-pointer",
						onCheckedChange: () => setTaskToUncomplete(task)
					}), /* @__PURE__ */ jsxs("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ jsx("p", {
							className: cn("text-text-tertiary text-sm", task.status === "completed" && "line-through"),
							children: task.title
						}), task.completed_at && /* @__PURE__ */ jsxs("p", {
							className: "text-text-tertiary mt-0.5 text-xs",
							children: ["Completed ", format(new Date(task.completed_at), "MMM d, yyyy")]
						})]
					})]
				}, task.id))
			}), tasks.meta.last_page > 1 && /* @__PURE__ */ jsxs("div", {
				className: "border-border mt-8 flex items-center justify-between border-t pt-4",
				children: [
					/* @__PURE__ */ jsx(Button, {
						variant: "ghost",
						size: "sm",
						disabled: !prevLink,
						asChild: !!prevLink,
						children: prevLink ? /* @__PURE__ */ jsxs(Link, {
							href: prevLink,
							children: [/* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }), "Previous"]
						}) : /* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }), "Previous"] })
					}),
					/* @__PURE__ */ jsxs("span", {
						className: "text-text-secondary text-sm",
						children: [
							"Page ",
							tasks.meta.current_page,
							" of ",
							tasks.meta.last_page
						]
					}),
					/* @__PURE__ */ jsx(Button, {
						variant: "ghost",
						size: "sm",
						disabled: !nextLink,
						asChild: !!nextLink,
						children: nextLink ? /* @__PURE__ */ jsxs(Link, {
							href: nextLink,
							children: ["Next", /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })]
						}) : /* @__PURE__ */ jsxs("span", { children: ["Next", /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })] })
					})
				]
			})] }) : /* @__PURE__ */ jsxs("div", {
				className: "flex flex-col items-center justify-center py-20 text-center",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "bg-bg-secondary mb-4 flex h-16 w-16 items-center justify-center rounded-full",
						children: /* @__PURE__ */ jsx(BookOpen, { className: "text-text-tertiary h-8 w-8" })
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "text-text text-lg font-medium",
						children: "No completed tasks yet"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-text-secondary mt-1 text-sm",
						children: "Tasks you complete will show up here."
					})
				]
			})]
		}),
		/* @__PURE__ */ jsx(Dialog, {
			open: !!taskToUncomplete,
			onOpenChange: (open) => {
				if (!open) setTaskToUncomplete(null);
			},
			children: /* @__PURE__ */ jsxs(DialogContent, {
				className: "max-w-sm",
				children: [/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsx(DialogTitle, { children: "Mark as incomplete?" }), /* @__PURE__ */ jsxs(DialogDescription, { children: [
					"\"",
					taskToUncomplete?.title,
					"\" will be moved out of your Logbook and back to your tasks."
				] })] }), /* @__PURE__ */ jsxs(DialogFooter, {
					className: "mt-2 gap-2",
					children: [/* @__PURE__ */ jsx(Button, {
						variant: "ghost",
						onClick: () => setTaskToUncomplete(null),
						children: "Cancel"
					}), /* @__PURE__ */ jsx(Button, {
						onClick: handleConfirmUncomplete,
						disabled: completeTask.isPending,
						children: completeTask.isPending ? "Saving..." : "Mark incomplete"
					})]
				})]
			})
		})
	] });
}
//#endregion
export { Logbook as default };
