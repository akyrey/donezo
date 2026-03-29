import { a as cn } from "./wayfinder-C_mx6M06.js";
import { n as TaskItem } from "./TaskDetailDialog-i5waCmjV.js";
import "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Inbox } from "lucide-react";
//#region resources/js/components/tasks/TaskList.tsx
function TaskListSkeleton() {
	return /* @__PURE__ */ jsx("div", {
		className: "space-y-1",
		children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsxs("div", {
			className: "flex items-start gap-3 rounded-lg px-3 py-2.5",
			children: [/* @__PURE__ */ jsx("div", { className: "bg-bg-tertiary mt-0.5 h-5 w-5 animate-pulse rounded-full" }), /* @__PURE__ */ jsxs("div", {
				className: "flex-1 space-y-2",
				children: [/* @__PURE__ */ jsx("div", {
					className: "bg-bg-tertiary h-4 animate-pulse rounded",
					style: { width: `${60 + Math.random() * 30}%` }
				}), /* @__PURE__ */ jsx("div", {
					className: "bg-bg-tertiary h-3 animate-pulse rounded",
					style: { width: `${30 + Math.random() * 20}%` }
				})]
			})]
		}, i))
	});
}
function TaskList({ tasks, title, emptyMessage = "No tasks here.", isLoading = false, onSelectTask, showProject = false, className, readOnly = false }) {
	if (isLoading) return /* @__PURE__ */ jsxs("div", {
		className: cn("space-y-1", className),
		children: [title && /* @__PURE__ */ jsx("h2", {
			className: "text-text-secondary mb-2 px-3 text-sm font-semibold",
			children: title
		}), /* @__PURE__ */ jsx(TaskListSkeleton, {})]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: cn("space-y-0.5", className),
		children: [title && /* @__PURE__ */ jsx("h2", {
			className: "text-text-secondary mb-2 px-3 text-sm font-semibold",
			children: title
		}), tasks.length === 0 ? /* @__PURE__ */ jsxs("div", {
			className: "text-text-tertiary flex flex-col items-center justify-center py-12",
			children: [/* @__PURE__ */ jsx(Inbox, { className: "mb-3 h-10 w-10 stroke-1" }), /* @__PURE__ */ jsx("p", {
				className: "text-sm",
				children: emptyMessage
			})]
		}) : tasks.map((task) => /* @__PURE__ */ jsx(TaskItem, {
			task,
			onSelect: onSelectTask,
			showProject,
			readOnly
		}, task.id))]
	});
}
//#endregion
export { TaskList as t };
