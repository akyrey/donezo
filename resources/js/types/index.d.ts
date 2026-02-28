import { PageProps as InertiaPageProps } from '@inertiajs/core';

export type User = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    avatar?: string;
    timezone?: string;
    created_at: string;
    updated_at: string;
};

export type ChecklistItem = {
    id: number;
    task_id: number;
    title: string;
    is_completed: boolean;
    position: number;
    created_at: string;
    updated_at: string;
};

export type Reminder = {
    id: number;
    task_id: number;
    remind_at: string;
    type: string;
    created_at: string;
    updated_at: string;
};

export type Tag = {
    id: number;
    user_id: number;
    name: string;
    color?: string;
    created_at: string;
    updated_at: string;
};

export type Heading = {
    id: number;
    section_id: number;
    title: string;
    position: number;
    created_at: string;
    updated_at: string;
};

export type Task = {
    id: number;
    user_id: number;
    project_id?: number;
    section_id?: number;
    heading_id?: number;
    title: string;
    notes?: string;
    due_date?: string;
    due_time?: string;
    is_completed: boolean;
    completed_at?: string;
    position: number;
    is_evening: boolean;
    created_at: string;
    updated_at: string;
    tags?: Tag[];
    checklist_items?: ChecklistItem[];
    reminders?: Reminder[];
};

export type Section = {
    id: number;
    project_id: number;
    title: string;
    position: number;
    created_at: string;
    updated_at: string;
    headings?: Heading[];
    tasks?: Task[];
};

export type Project = {
    id: number;
    user_id: number;
    group_id?: number;
    title: string;
    description?: string;
    color?: string;
    icon?: string;
    position: number;
    is_archived: boolean;
    created_at: string;
    updated_at: string;
    sections?: Section[];
    tasks?: Task[];
};

export type Group = {
    id: number;
    user_id: number;
    title: string;
    position: number;
    created_at: string;
    updated_at: string;
    projects?: Project[];
};

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T &
    InertiaPageProps & {
        auth: {
            user: User;
        };
    };
