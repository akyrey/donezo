import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Users, Plus, Crown, ChevronRight } from 'lucide-react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import type { Group, PageProps } from '@/types';
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
import { useCreateGroupMutation } from '@/hooks/useGroups';
import { cn } from '@/lib/utils';

interface Props extends PageProps {
    groups: Group[];
}

function CreateGroupDialog({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const createMutation = useCreateGroupMutation();

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!name.trim()) return;

        createMutation.mutate(
            {
                name: name.trim(),
                description: description.trim() || undefined,
            },
            {
                onSuccess: () => {
                    setName('');
                    setDescription('');
                    onOpenChange(false);
                    // Reload to get fresh server-rendered data
                    window.location.reload();
                },
            },
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Group</DialogTitle>
                    <DialogDescription>
                        Create a new group to collaborate with others on shared
                        tasks.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Group Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Marketing Team"
                        autoFocus
                    />
                    <Input
                        label="Description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="What is this group for?"
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
                                !name.trim() || createMutation.isPending
                            }
                        >
                            {createMutation.isPending
                                ? 'Creating...'
                                : 'Create Group'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function GroupsIndex({ groups }: Props) {
    const [createDialogOpen, setCreateDialogOpen] = useState(false);

    return (
        <AuthenticatedLayout>
            <Head title="Groups" />

            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                        <Users className="h-5 w-5 text-primary" />
                    </div>
                    <h1 className="text-xl font-semibold text-text">Groups</h1>
                </div>
                <Button
                    onClick={() => setCreateDialogOpen(true)}
                    className="gap-2"
                >
                    <Plus className="h-4 w-4" />
                    New Group
                </Button>
            </div>

            {/* Groups list */}
            {groups.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-text-tertiary">
                    <Users className="mb-3 h-12 w-12 stroke-1" />
                    <p className="text-sm font-medium text-text-secondary">
                        No groups yet
                    </p>
                    <p className="mt-1 text-xs">
                        Create a group to collaborate on tasks with others.
                    </p>
                    <Button
                        className="mt-4 gap-2"
                        onClick={() => setCreateDialogOpen(true)}
                    >
                        <Plus className="h-4 w-4" />
                        Create your first group
                    </Button>
                </div>
            ) : (
                <div className="space-y-1">
                    {groups.map((group) => (
                        <Link
                            key={group.id}
                            href={`/groups/${group.id}`}
                            className={cn(
                                'flex items-center gap-4 rounded-lg px-4 py-3 transition-colors',
                                'hover:bg-bg-secondary',
                            )}
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Users className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="truncate text-sm font-medium text-text">
                                        {group.name}
                                    </p>
                                    {group.owner && (
                                        <span className="flex items-center gap-0.5 text-xs text-text-tertiary">
                                            <Crown className="h-3 w-3" />
                                            {group.owner.name}
                                        </span>
                                    )}
                                </div>
                                {group.description && (
                                    <p className="mt-0.5 truncate text-xs text-text-tertiary">
                                        {group.description}
                                    </p>
                                )}
                                <p className="mt-0.5 text-xs text-text-tertiary">
                                    {group.member_count}{' '}
                                    {group.member_count === 1
                                        ? 'member'
                                        : 'members'}
                                </p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-text-tertiary" />
                        </Link>
                    ))}
                </div>
            )}

            <CreateGroupDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
            />
        </AuthenticatedLayout>
    );
}
