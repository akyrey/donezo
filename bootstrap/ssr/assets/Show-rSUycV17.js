import { n as show, t as AuthenticatedLayout } from "./AuthenticatedLayout-BBEUssZw.js";
import { t as TaskDetailDialog } from "./TaskDetailDialog-i5waCmjV.js";
import { t as TaskList } from "./TaskList-CuBdRVOZ.js";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { FolderKanban, LayoutGrid } from "lucide-react";
//#region resources/js/pages/Sections/Show.tsx
function ProjectCard({ project }) {
	const totalTasks = project.task_count ?? 0;
	const completedTasks = project.completed_task_count ?? 0;
	return /* @__PURE__ */ jsxs(Link, {
		href: show.url(project.id),
		className: "group border-border bg-bg hover:border-primary/30 flex flex-col rounded-xl border p-5 transition-all hover:shadow-sm",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "mb-3 flex items-center gap-3",
				children: [/* @__PURE__ */ jsx("div", {
					className: "bg-primary/10 flex h-9 w-9 items-center justify-center rounded-lg",
					children: /* @__PURE__ */ jsx(FolderKanban, { className: "text-primary h-4 w-4" })
				}), /* @__PURE__ */ jsx("h3", {
					className: "text-text group-hover:text-primary font-medium",
					children: project.name
				})]
			}),
			project.description && /* @__PURE__ */ jsx("p", {
				className: "text-text-secondary mb-2 line-clamp-2 text-sm",
				children: project.description
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "text-text-tertiary mt-auto text-xs",
				children: [
					completedTasks,
					"/",
					totalTasks,
					" tasks"
				]
			})
		]
	});
}
function SectionShow({ section, projects, tasks }) {
	const [selectedTask, setSelectedTask] = useState(null);
	return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [
		/* @__PURE__ */ jsx(Head, { title: section.name }),
		/* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-3xl px-4 py-8",
			children: [
				/* @__PURE__ */ jsx("div", {
					className: "mb-8",
					children: /* @__PURE__ */ jsxs("h1", {
						className: "text-text flex items-center gap-3 text-2xl font-semibold",
						children: [/* @__PURE__ */ jsx(LayoutGrid, { className: "text-text-secondary h-6 w-6" }), section.name]
					})
				}),
				projects.length > 0 && /* @__PURE__ */ jsxs("section", {
					className: "mb-10",
					children: [/* @__PURE__ */ jsx("h2", {
						className: "text-text-secondary mb-4 text-sm font-semibold tracking-wide uppercase",
						children: "Projects"
					}), /* @__PURE__ */ jsx("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: projects.map((project) => /* @__PURE__ */ jsx(ProjectCard, { project }, project.id))
					})]
				}),
				tasks.length > 0 && /* @__PURE__ */ jsxs("section", { children: [/* @__PURE__ */ jsx("h2", {
					className: "text-text-secondary mb-4 text-sm font-semibold tracking-wide uppercase",
					children: "Tasks"
				}), /* @__PURE__ */ jsx(TaskList, {
					tasks,
					onSelectTask: setSelectedTask
				})] }),
				projects.length === 0 && tasks.length === 0 && /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col items-center justify-center py-20 text-center",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "bg-bg-secondary mb-4 flex h-16 w-16 items-center justify-center rounded-full",
							children: /* @__PURE__ */ jsx(LayoutGrid, { className: "text-text-tertiary h-8 w-8" })
						}),
						/* @__PURE__ */ jsx("h2", {
							className: "text-text text-lg font-medium",
							children: "This section is empty"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-text-secondary mt-1 text-sm",
							children: "Add projects or tasks to this section."
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
	] });
}
//#endregion
export { SectionShow as default };
