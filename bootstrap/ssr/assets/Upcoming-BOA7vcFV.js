import { a as cn, i as Button } from "./wayfinder-C_mx6M06.js";
import { t as AuthenticatedLayout } from "./AuthenticatedLayout-BBEUssZw.js";
import { t as TaskDetailDialog } from "./TaskDetailDialog-i5waCmjV.js";
import { t as TaskList } from "./TaskList-CuBdRVOZ.js";
import { t as useAllTasksExport } from "./useExport-Bf91jMFP.js";
import { i as upcoming } from "./routes-BacphFsi.js";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Calendar, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { addDays, format, isToday, isTomorrow, parse, startOfDay, subDays } from "date-fns";
//#region resources/js/pages/Upcoming.tsx
function CalendarStrip({ startDate, onNavigate }) {
	const days = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
	return /* @__PURE__ */ jsxs("div", {
		className: "mb-8 flex items-center gap-2",
		children: [
			/* @__PURE__ */ jsx(Button, {
				variant: "ghost",
				size: "icon",
				className: "text-text-tertiary hover:text-text h-8 w-8 shrink-0",
				onClick: () => onNavigate(subDays(startDate, 7)),
				disabled: !!isToday(startDate),
				children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex flex-1 gap-1 overflow-x-auto pb-1",
				children: days.map((day) => {
					return /* @__PURE__ */ jsxs("div", {
						className: cn("flex min-w-16 flex-col items-center rounded-xl px-3 py-2 text-center transition-colors", isToday(day) ? "bg-primary text-white" : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"),
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-[10px] font-medium tracking-wider uppercase",
							children: format(day, "EEE")
						}), /* @__PURE__ */ jsx("span", {
							className: "text-lg font-semibold",
							children: format(day, "d")
						})]
					}, day.toISOString());
				})
			}),
			/* @__PURE__ */ jsx(Button, {
				variant: "ghost",
				size: "icon",
				className: "text-text-tertiary hover:text-text h-8 w-8 shrink-0",
				onClick: () => onNavigate(addDays(startDate, 7)),
				children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
			})
		]
	});
}
function formatDateHeading(dateStr) {
	const date = parse(dateStr, "yyyy-MM-dd", /* @__PURE__ */ new Date());
	if (isToday(date)) return "Today";
	if (isTomorrow(date)) return "Tomorrow";
	return format(date, "EEEE, MMM d");
}
function Upcoming({ grouped_tasks, start_date }) {
	const [selectedTask, setSelectedTask] = useState(null);
	const { isPending: isExporting, mutate: requestExport } = useAllTasksExport({ status: "upcoming" });
	const currentStartDate = start_date ? parse(start_date, "yyyy-MM-dd", /* @__PURE__ */ new Date()) : startOfDay(/* @__PURE__ */ new Date());
	const dateKeys = Object.keys(grouped_tasks ?? {});
	const hasAnyTasks = dateKeys.some((key) => grouped_tasks[key].length > 0);
	function handleNavigate(date) {
		const today = startOfDay(/* @__PURE__ */ new Date());
		const targetDate = date < today ? today : date;
		router.get(upcoming.url(), { start_date: format(targetDate, "yyyy-MM-dd") }, {
			preserveState: true,
			preserveScroll: true
		});
	}
	return /* @__PURE__ */ jsxs(AuthenticatedLayout, {
		taskContext: "upcoming",
		children: [
			/* @__PURE__ */ jsx(Head, { title: "Upcoming" }),
			/* @__PURE__ */ jsxs("div", {
				className: "mx-auto max-w-2xl px-4 py-8",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "mb-6 flex items-center justify-between",
						children: [/* @__PURE__ */ jsxs("h1", {
							className: "text-text flex items-center gap-3 text-2xl font-semibold",
							children: [/* @__PURE__ */ jsx(Calendar, { className: "text-success h-6 w-6" }), "Upcoming"]
						}), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-1",
							children: [!isToday(currentStartDate) && /* @__PURE__ */ jsx(Button, {
								variant: "ghost",
								size: "sm",
								className: "text-text-secondary text-xs",
								onClick: () => handleNavigate(/* @__PURE__ */ new Date()),
								children: "Today"
							}), /* @__PURE__ */ jsxs(Button, {
								variant: "ghost",
								size: "sm",
								onClick: () => requestExport(),
								disabled: isExporting,
								title: "Export tasks as CSV",
								children: [/* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), isExporting ? "Requesting…" : "Export"]
							})]
						})]
					}),
					/* @__PURE__ */ jsx(CalendarStrip, {
						startDate: currentStartDate,
						onNavigate: handleNavigate
					}),
					hasAnyTasks ? /* @__PURE__ */ jsx("div", {
						className: "space-y-8",
						children: dateKeys.map((dateStr) => {
							const tasks = grouped_tasks[dateStr];
							if (tasks.length === 0) return null;
							return /* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h2", {
								className: "text-text-secondary mb-3 text-sm font-semibold tracking-wide uppercase",
								children: formatDateHeading(dateStr)
							}), /* @__PURE__ */ jsx(TaskList, {
								tasks,
								onSelectTask: setSelectedTask
							})] }, dateStr);
						})
					}) : /* @__PURE__ */ jsxs("div", {
						className: "flex flex-col items-center justify-center py-20 text-center",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "bg-bg-secondary mb-4 flex h-16 w-16 items-center justify-center rounded-full",
								children: /* @__PURE__ */ jsx(Calendar, { className: "text-text-tertiary h-8 w-8" })
							}),
							/* @__PURE__ */ jsx("h2", {
								className: "text-text text-lg font-medium",
								children: "No upcoming tasks"
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-text-secondary mt-1 text-sm",
								children: "Plan ahead!"
							})
						]
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
export { Upcoming as default };
