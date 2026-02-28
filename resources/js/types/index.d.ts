import { PageProps as InertiaPageProps } from '@inertiajs/core';

export type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string | null;
    timezone: string;
    email_verified_at: string | null;
};

export type ChecklistItem = {
    id: number;
    title: string;
    is_completed: boolean;
    position: number;
};

export type Reminder = {
    id: number;
    remind_at: string;
    is_sent: boolean;
};

export type Tag = {
    id: number;
    name: string;
    color?: string | null;
};

export type RepeatRule = {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    days_of_week?: string[] | null;
    end_date?: string | null;
};

export type Heading = {
    id: number;
    name: string;
    position: number;
    archived_at?: string | null;
    task_count: number;
};

export type Task = {
    id: number;
    title: string;
    description?: string | null;
    status: 'inbox' | 'today' | 'upcoming' | 'anytime' | 'someday' | 'completed' | 'cancelled';
    is_evening: boolean;
    scheduled_at?: string | null;
    deadline_at?: string | null;
    completed_at?: string | null;
    cancelled_at?: string | null;
    repeat_rule?: RepeatRule | null;
    position: number;
    project_id?: number | null;
    section_id?: number | null;
    heading_id?: number | null;
    creator?: User | null;
    assignee?: User | null;
    checklist_items?: ChecklistItem[];
    reminders?: Reminder[];
    tags?: Tag[];
    created_at: string;
    updated_at: string;
};

export type Project = {
    id: number;
    name: string;
    description?: string | null;
    status: 'active' | 'completed' | 'archived';
    position: number;
    section_id?: number | null;
    completed_at?: string | null;
    headings?: Heading[];
    task_count: number;
    completed_task_count: number;
    created_at: string;
    updated_at: string;
    tasks?: Task[];
};

export type Section = {
    id: number;
    name: string;
    position: number;
    projects?: Project[];
    created_at: string;
    updated_at: string;
};

export type Group = {
    id: number;
    name: string;
    description?: string | null;
    owner: User;
    member_count: number;
};

export type GroupMember = User & {
    pivot?: {
        role: 'admin' | 'member';
    };
};

export type PaginationLinks = {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
};

export type PaginationMeta = {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
};

export type Paginated<T> = {
    data: T[];
    links: PaginationLinks;
    meta: PaginationMeta;
};

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T &
    InertiaPageProps & {
        auth: {
            user: User;
        };
        projects: Project[];
        sections: Section[];
        groups: Group[];
    };
