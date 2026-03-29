import { i as Button } from "./wayfinder-C_mx6M06.js";
import { t as Input } from "./Input-BktEiBB2.js";
import { n as show, r as store, t as AuthenticatedLayout } from "./AuthenticatedLayout-BBEUssZw.js";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { CheckCircle2, ChevronDown, ChevronRight, FolderKanban, Plus } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
//#region resources/js/pages/Projects/Index.tsx
function ProjectCard({ project, completed = false }) {
	const totalTasks = project.task_count ?? 0;
	const completedTasks = project.completed_task_count ?? 0;
	const progress = totalTasks > 0 ? completedTasks / totalTasks * 100 : 0;
	const radius = 14;
	const circumference = 2 * Math.PI * radius;
	const strokeDashoffset = circumference - progress / 100 * circumference;
	return /* @__PURE__ */ jsxs(Link, {
		href: show.url(project.id),
		className: `group border-border bg-bg hover:border-primary/30 flex flex-col rounded-xl border p-5 transition-all hover:shadow-sm ${completed ? "opacity-60" : ""}`,
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "mb-3 flex items-start justify-between",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "bg-primary/10 relative flex h-10 w-10 items-center justify-center rounded-xl text-lg",
					children: [/* @__PURE__ */ jsx(FolderKanban, { className: "text-primary h-5 w-5" }), completed && /* @__PURE__ */ jsx(CheckCircle2, { className: "text-success bg-bg absolute -right-1 -bottom-1 h-4 w-4 rounded-full" })]
				}), totalTasks > 0 && /* @__PURE__ */ jsxs("svg", {
					width: "36",
					height: "36",
					viewBox: "0 0 36 36",
					className: "shrink-0",
					children: [/* @__PURE__ */ jsx("circle", {
						cx: "18",
						cy: "18",
						r: radius,
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "3",
						className: "text-border-light"
					}), /* @__PURE__ */ jsx("circle", {
						cx: "18",
						cy: "18",
						r: radius,
						fill: "none",
						stroke: "currentColor",
						strokeWidth: "3",
						strokeDasharray: circumference,
						strokeDashoffset,
						strokeLinecap: "round",
						className: completed ? "text-success" : "text-primary",
						transform: "rotate(-90 18 18)"
					})]
				})]
			}),
			/* @__PURE__ */ jsx("h3", {
				className: `text-text group-hover:text-primary font-medium ${completed ? "decoration-text-tertiary line-through" : ""}`,
				children: project.name
			}),
			project.description && /* @__PURE__ */ jsx("p", {
				className: "text-text-secondary mt-1 line-clamp-2 text-sm",
				children: project.description
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "text-text-tertiary mt-3 text-xs",
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
function CreateProjectDialog({ open, onOpenChange }) {
	const { data, setData, post, processing, errors, reset } = useForm({
		name: "",
		description: ""
	});
	const submit = (e) => {
		e.preventDefault();
		post(store.url(), { onSuccess: () => {
			reset();
			onOpenChange(false);
		} });
	};
	return /* @__PURE__ */ jsx(Dialog.Root, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ jsxs(Dialog.Portal, { children: [/* @__PURE__ */ jsx(Dialog.Overlay, { className: "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 fixed inset-0 bg-black/40" }), /* @__PURE__ */ jsxs(Dialog.Content, {
			className: "border-border bg-bg text-text data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed top-1/2 left-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-6 shadow-lg focus:outline-none",
			children: [
				/* @__PURE__ */ jsx(Dialog.Title, {
					className: "text-text text-lg font-semibold",
					children: "New Project"
				}),
				/* @__PURE__ */ jsx(Dialog.Description, {
					className: "text-text-secondary mt-1 text-sm",
					children: "Create a new project to organize your tasks."
				}),
				/* @__PURE__ */ jsxs("form", {
					onSubmit: submit,
					className: "mt-6 space-y-4",
					children: [
						/* @__PURE__ */ jsx(Input, {
							label: "Project name",
							value: data.name,
							onChange: (e) => setData("name", e.target.value),
							error: errors.name,
							placeholder: "e.g., Home Renovation",
							autoFocus: true
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-col gap-1.5",
							children: [
								/* @__PURE__ */ jsx("label", {
									className: "text-text text-sm font-medium",
									children: "Description (optional)"
								}),
								/* @__PURE__ */ jsx("textarea", {
									value: data.description,
									onChange: (e) => setData("description", e.target.value),
									className: "border-border bg-bg text-text placeholder:text-text-tertiary focus-visible:ring-primary/50 flex min-h-[80px] w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none",
									placeholder: "What's this project about?"
								}),
								errors.description && /* @__PURE__ */ jsx("p", {
									className: "text-danger text-xs",
									children: errors.description
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
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
								children: processing ? "Creating..." : "Create Project"
							})]
						})
					]
				})
			]
		})] })
	});
}
function ProjectsIndex({ projects, completed_projects, openDialog = false }) {
	const [dialogOpen, setDialogOpen] = useState(openDialog);
	const [showCompleted, setShowCompleted] = useState(false);
	const totalProjects = projects.length + completed_projects.length;
	const completedCount = completed_projects.length;
	const hasAnyProjects = totalProjects > 0;
	return /* @__PURE__ */ jsxs(AuthenticatedLayout, { children: [/* @__PURE__ */ jsx(Head, { title: "Projects" }), /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-3xl px-4 py-8",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "mb-6 flex items-center justify-between",
				children: [/* @__PURE__ */ jsxs("h1", {
					className: "text-text flex items-center gap-3 text-2xl font-semibold",
					children: [/* @__PURE__ */ jsx(FolderKanban, { className: "text-primary h-6 w-6" }), "Projects"]
				}), /* @__PURE__ */ jsxs(Button, {
					onClick: () => setDialogOpen(true),
					size: "sm",
					children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), "New Project"]
				})]
			}),
			hasAnyProjects && /* @__PURE__ */ jsxs("div", {
				className: "mb-6 flex items-center gap-4",
				children: [/* @__PURE__ */ jsxs("p", {
					className: "text-text-secondary text-sm",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "text-text font-medium",
							children: completedCount
						}),
						" of",
						" ",
						/* @__PURE__ */ jsx("span", {
							className: "text-text font-medium",
							children: totalProjects
						}),
						" projects completed"
					]
				}), totalProjects > 0 && /* @__PURE__ */ jsx("div", {
					className: "max-w-48 flex-1",
					children: /* @__PURE__ */ jsx("div", {
						className: "bg-bg-tertiary h-1.5 w-full overflow-hidden rounded-full",
						children: /* @__PURE__ */ jsx("div", {
							className: "bg-primary h-full rounded-full transition-all duration-300",
							style: { width: `${completedCount / totalProjects * 100}%` }
						})
					})
				})]
			}),
			hasAnyProjects ? /* @__PURE__ */ jsxs("div", {
				className: "space-y-8",
				children: [projects.length > 0 && /* @__PURE__ */ jsx("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: projects.map((project) => /* @__PURE__ */ jsx(ProjectCard, { project }, project.id))
				}), completed_projects.length > 0 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("button", {
					onClick: () => setShowCompleted((v) => !v),
					className: "text-text-secondary hover:text-text mb-4 flex items-center gap-1.5 text-sm font-medium transition-colors",
					children: [
						showCompleted ? /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" }),
						/* @__PURE__ */ jsx(CheckCircle2, { className: "text-success h-4 w-4" }),
						showCompleted ? "Hide" : "Show",
						" completed (",
						completed_projects.length,
						")"
					]
				}), showCompleted && /* @__PURE__ */ jsx("div", {
					className: "grid gap-4 sm:grid-cols-2",
					children: completed_projects.map((project) => /* @__PURE__ */ jsx(ProjectCard, {
						project,
						completed: true
					}, project.id))
				})] })]
			}) : /* @__PURE__ */ jsxs("div", {
				className: "flex flex-col items-center justify-center py-20 text-center",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "bg-bg-secondary mb-4 flex h-16 w-16 items-center justify-center rounded-full",
						children: /* @__PURE__ */ jsx(FolderKanban, { className: "text-text-tertiary h-8 w-8" })
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "text-text text-lg font-medium",
						children: "No projects yet"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-text-secondary mt-1 mb-4 text-sm",
						children: "Create a project to organize related tasks."
					}),
					/* @__PURE__ */ jsxs(Button, {
						onClick: () => setDialogOpen(true),
						size: "sm",
						children: [/* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }), "New Project"]
					})
				]
			}),
			/* @__PURE__ */ jsx(CreateProjectDialog, {
				open: dialogOpen,
				onOpenChange: setDialogOpen
			})
		]
	})] });
}
//#endregion
export { ProjectsIndex as default };
