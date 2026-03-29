import { i as Button } from "./wayfinder-C_mx6M06.js";
import { t as AuthenticatedLayout } from "./AuthenticatedLayout-BBEUssZw.js";
import { t as TaskDetailDialog } from "./TaskDetailDialog-i5waCmjV.js";
import { t as TaskList } from "./TaskList-CuBdRVOZ.js";
import { t as useAllTasksExport } from "./useExport-Bf91jMFP.js";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { AlertCircle, Download, Moon, Star, Sun } from "lucide-react";
import { format } from "date-fns";
//#region resources/js/pages/Today.tsx
function Today({ morning_tasks, evening_tasks, overdue_tasks }) {
	const [selectedTask, setSelectedTask] = useState(null);
	const { isPending: isExporting, mutate: requestExport } = useAllTasksExport({ status: "today" });
	const dateLabel = format(/* @__PURE__ */ new Date(), "EEE, MMM d");
	const hasAnyTasks = morning_tasks?.length > 0 || evening_tasks?.length > 0 || overdue_tasks?.length > 0;
	return /* @__PURE__ */ jsxs(AuthenticatedLayout, {
		taskContext: "today",
		children: [
			/* @__PURE__ */ jsx(Head, { title: "Today" }),
			/* @__PURE__ */ jsxs("div", {
				className: "mx-auto max-w-2xl px-4 py-8",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "mb-8",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ jsxs("h1", {
							className: "text-text flex items-center gap-3 text-2xl font-semibold",
							children: [/* @__PURE__ */ jsx(Star, { className: "text-warning h-6 w-6" }), "Today"]
						}), /* @__PURE__ */ jsxs(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => requestExport(),
							disabled: isExporting,
							title: "Export tasks as CSV",
							children: [/* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), isExporting ? "Requesting…" : "Export"]
						})]
					}), /* @__PURE__ */ jsx("p", {
						className: "text-text-secondary mt-1 text-sm",
						children: dateLabel
					})]
				}), hasAnyTasks ? /* @__PURE__ */ jsxs("div", {
					className: "space-y-8",
					children: [
						overdue_tasks.length > 0 && /* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsxs("div", {
							className: "mb-3 flex items-center gap-2",
							children: [
								/* @__PURE__ */ jsx(AlertCircle, { className: "text-danger h-4 w-4" }),
								/* @__PURE__ */ jsx("h2", {
									className: "text-danger text-sm font-semibold tracking-wide uppercase",
									children: "Overdue"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "bg-danger/10 text-danger rounded-full px-2 py-0.5 text-xs font-medium",
									children: overdue_tasks.length
								})
							]
						}), /* @__PURE__ */ jsx(TaskList, {
							tasks: overdue_tasks,
							onSelectTask: setSelectedTask
						})] }),
						morning_tasks.length > 0 && /* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsxs("div", {
							className: "mb-3 flex items-center gap-2",
							children: [/* @__PURE__ */ jsx(Sun, { className: "text-warning h-4 w-4" }), /* @__PURE__ */ jsx("h2", {
								className: "text-text-secondary text-sm font-semibold tracking-wide uppercase",
								children: "Morning"
							})]
						}), /* @__PURE__ */ jsx(TaskList, {
							tasks: morning_tasks,
							onSelectTask: setSelectedTask
						})] }),
						evening_tasks.length > 0 && /* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsxs("div", {
							className: "border-border mb-3 flex items-center gap-2 border-t pt-6",
							children: [/* @__PURE__ */ jsx(Moon, { className: "text-primary h-4 w-4" }), /* @__PURE__ */ jsx("h2", {
								className: "text-text-secondary text-sm font-semibold tracking-wide uppercase",
								children: "This Evening"
							})]
						}), /* @__PURE__ */ jsx(TaskList, {
							tasks: evening_tasks,
							onSelectTask: setSelectedTask
						})] })
					]
				}) : /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col items-center justify-center py-20 text-center",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "bg-bg-secondary mb-4 flex h-16 w-16 items-center justify-center rounded-full",
							children: /* @__PURE__ */ jsx(Star, { className: "text-text-tertiary h-8 w-8" })
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "text-text text-lg font-medium",
							children: "Nothing planned for today"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-text-secondary mt-1 text-sm",
							children: "Enjoy your day!"
						})
					]
				})]
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
export { Today as default };
