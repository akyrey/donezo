import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import {
    Users,
    Crown,
    UserPlus,
    UserMinus,
    Settings,
    Trash2,
} from 'lucide-react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import type { Group, GroupMember, Task, PageProps, User } from '@/types';
import { Button } from '@/components/ui/Button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Separator } from '@/components/ui/Separator';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskDetailDialog } from '@/components/tasks/TaskDetailDialog';
import {
    useAddMemberMutation,
    useRemoveMemberMutation,
    useUpdateGroupMutation,
    useDeleteGroupMutation,
} from '@/hooks/useGroups';
import { cn } from '@/lib/utils';

interface Props extends PageProps {
    group: Group;
    members: GroupMember[];
    tasks: Task[];
}

function AddMemberDialog({
    open,
    onOpenChange,
    groupId,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    groupId: number;
}) {
    const [userId, setUserId] = useState('');
    const addMemberMutation = useAddMemberMutation();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const id = parseInt(userId, 10);
        if (!id || isNaN(id)) return;

        addMemberMutation.mutate(
            { groupId, userId: id },
            {
                onSuccess: () => {
                    setUserId('');
                    onOpenChange(false);
                    window.location.reload();
                },
            },
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Member</DialogTitle>
                    <DialogDescription>
                        Add a user to this group by their user ID.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="User ID"
                        type="number"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        placeholder="Enter user ID"
                        autoFocus
                    />
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={!userId || addMemberMutation.isPending}
                        >
                            {addMemberMutation.isPending
                                ? 'Adding...'
                                : 'Add Member'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function EditGroupDialog({
    open,
    onOpenChange,
    group,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    group: Group;
}) {
    const [name, setName] = useState(group.name);
    const [description, setDescription] = useState(group.description ?? '');
    const updateMutation = useUpdateGroupMutation();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!name.trim()) return;

        updateMutation.mutate(
            {
                id: group.id,
                name: name.trim(),
                description: description.trim() || undefined,
            },
            {
                onSuccess: () => {
                    onOpenChange(false);
                    window.location.reload();
                },
            },
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Group</DialogTitle>
                    <DialogDescription>
                        Update the group name and description.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Group Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                    />
                    <Input
                        label="Description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                !name.trim() || updateMutation.isPending
                            }
                        >
                            {updateMutation.isPending
                                ? 'Saving...'
                                : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function MemberItem({
    member,
    groupId,
    isOwner,
    canManage,
}: {
    member: GroupMember;
    groupId: number;
    isOwner: boolean;
    canManage: boolean;
}) {
    const removeMemberMutation = useRemoveMemberMutation();

    function handleRemove() {
        if (!confirm(`Remove ${member.name} from this group?`)) return;
        removeMemberMutation.mutate(
            { groupId, userId: member.id },
            {
                onSuccess: () => {
                    window.location.reload();
                },
            },
        );
    }

    return (
        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
            {/* Avatar */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                {member.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2)}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-text">
                        {member.name}
                    </p>
                    {isOwner && (
                        <span className="flex items-center gap-0.5 rounded-full bg-warning/10 px-1.5 py-0.5 text-[10px] font-medium text-warning">
                            <Crown className="h-2.5 w-2.5" />
                            Owner
                        </span>
                    )}
                    {member.pivot?.role === 'admin' && !isOwner && (
                        <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                            Admin
                        </span>
                    )}
                </div>
                <p className="truncate text-xs text-text-tertiary">
                    {member.email}
                </p>
            </div>

            {/* Actions */}
            {canManage && !isOwner && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-text-tertiary hover:text-danger"
                    onClick={handleRemove}
                    disabled={removeMemberMutation.isPending}
                >
                    <UserMinus className="h-3.5 w-3.5" />
                </Button>
            )}
        </div>
    );
}

export default function GroupsShow({ group, members, tasks }: Props) {
    const { auth } = usePage<PageProps>().props;
    const [addMemberOpen, setAddMemberOpen] = useState(false);
    const [editGroupOpen, setEditGroupOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    const isCurrentUserOwner = auth.user.id === group.owner.id;
    const deleteGroupMutation = useDeleteGroupMutation();

    function handleDeleteGroup() {
        if (
            !confirm(
                'Are you sure you want to delete this group? This cannot be undone.',
            )
        )
            return;

        deleteGroupMutation.mutate(group.id, {
            onSuccess: () => {
                window.location.href = '/groups';
            },
        });
    }

    return (
        <AuthenticatedLayout>
            <Head title={group.name} />

            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-text">
                                {group.name}
                            </h1>
                            {group.description && (
                                <p className="text-sm text-text-secondary">
                                    {group.description}
                                </p>
                            )}
                        </div>
                    </div>

                    {isCurrentUserOwner && (
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditGroupOpen(true)}
                                className="text-text-tertiary"
                            >
                                <Settings className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleDeleteGroup}
                                className="text-text-tertiary hover:text-danger"
                                disabled={deleteGroupMutation.isPending}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Members section */}
            <div className="mb-8">
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-text-secondary">
                        Members ({members.length})
                    </h2>
                    {isCurrentUserOwner && (
                        <Button
                            variant="ghost"
                            className="gap-1.5 text-xs text-text-secondary"
                            onClick={() => setAddMemberOpen(true)}
                        >
                            <UserPlus className="h-3.5 w-3.5" />
                            Add Member
                        </Button>
                    )}
                </div>
                <div className="space-y-0.5 rounded-lg border border-border bg-bg p-1">
                    {members.map((member) => (
                        <MemberItem
                            key={member.id}
                            member={member}
                            groupId={group.id}
                            isOwner={member.id === group.owner.id}
                            canManage={isCurrentUserOwner}
                        />
                    ))}
                </div>
            </div>

            <Separator className="mb-6" />

            {/* Shared Tasks */}
            <div>
                <h2 className="mb-3 text-sm font-semibold text-text-secondary">
                    Shared Tasks
                </h2>
                <TaskList
                    tasks={tasks}
                    emptyMessage="No tasks shared with this group yet."
                    showProject
                    onSelectTask={setSelectedTask}
                />
            </div>

            {/* Dialogs */}
            <AddMemberDialog
                open={addMemberOpen}
                onOpenChange={setAddMemberOpen}
                groupId={group.id}
            />
            <EditGroupDialog
                open={editGroupOpen}
                onOpenChange={setEditGroupOpen}
                group={group}
            />
            <TaskDetailDialog
                task={selectedTask}
                open={!!selectedTask}
                onOpenChange={(open) => {
                    if (!open) setSelectedTask(null);
                }}
            />
        </AuthenticatedLayout>
    );
}
