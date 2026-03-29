import { i as Button } from "./wayfinder-C_mx6M06.js";
import { t as AuthenticatedLayout } from "./AuthenticatedLayout-BBEUssZw.js";
import { t as TaskDetailDialog } from "./TaskDetailDialog-i5waCmjV.js";
import { t as TaskList } from "./TaskList-CuBdRVOZ.js";
import { t as useAllTasksExport } from "./useExport-Bf91jMFP.js";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Archive, Download } from "lucide-react";
//#region resources/js/pages/Someday.tsx
function Someday({ tasks }) {
	const [selectedTask, setSelectedTask] = useState(null);
	const { isPending: isExporting, mutate: requestExport } = useAllTasksExport({ status: "someday" });
	return /* @__PURE__ */ jsxs(AuthenticatedLayout, {
		taskContext: "someday",
		children: [
			/* @__PURE__ */ jsx(Head, { title: "Someday" }),
			/* @__PURE__ */ jsxs("div", {
				className: "mx-auto max-w-2xl px-4 py-8",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "mb-8 flex items-center justify-between",
					children: [/* @__PURE__ */ jsxs("h1", {
						className: "text-text flex items-center gap-3 text-2xl font-semibold",
						children: [/* @__PURE__ */ jsx(Archive, { className: "text-text-tertiary h-6 w-6" }), "Someday"]
					}), /* @__PURE__ */ jsxs(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => requestExport(),
						disabled: isExporting,
						title: "Export tasks as CSV",
						children: [/* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }), isExporting ? "Requesting…" : "Export"]
					})]
				}), tasks.length > 0 ? /* @__PURE__ */ jsx(TaskList, {
					tasks,
					onSelectTask: setSelectedTask
				}) : /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col items-center justify-center py-20 text-center",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "bg-bg-secondary mb-4 flex h-16 w-16 items-center justify-center rounded-full",
							children: /* @__PURE__ */ jsx(Archive, { className: "text-text-tertiary h-8 w-8" })
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "text-text text-lg font-medium",
							children: "No tasks parked for someday"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-text-secondary mt-1 text-sm",
							children: "Move tasks here when you want to revisit them later."
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
export { Someday as default };
