import React, { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import {
  Users,
  Crown,
  Download,
  UserPlus,
  UserMinus,
  Settings,
  Trash2,
  Mail,
  X,
  Clock,
} from 'lucide-react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import type { Group, GroupInvitation, GroupMember, Task, PageProps, User } from '@/types';
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
  useInviteMemberMutation,
  useCancelInvitationMutation,
  useGroupInvitationsQuery,
  useRemoveMemberMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
} from '@/hooks/useGroups';
import { useGroupExport } from '@/hooks/useExport';
import { cn } from '@/lib/utils';

interface Props extends PageProps {
  group: Group;
  members: GroupMember[];
  tasks: Task[];
}

function InviteMemberDialog({
  open,
  onOpenChange,
  groupId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: number;
}) {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const inviteMutation = useInviteMemberMutation();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    inviteMutation.mutate(
      { groupId, email: email.trim() },
      {
        onSuccess: (data) => {
          setSuccessMessage(data.message);
          setEmail('');
        },
      },
    );
  }

  function handleClose() {
    setEmail('');
    setSuccessMessage('');
    inviteMutation.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
          <DialogDescription>
            Enter the email address of the person you want to invite. They will receive an email
            with instructions to join the group.
          </DialogDescription>
        </DialogHeader>

        {successMessage ? (
          <div className="space-y-4">
            <div className="border-success/30 bg-success/5 flex items-start gap-3 rounded-lg border p-4">
              <Mail className="text-success mt-0.5 h-4 w-4 shrink-0" />
              <p className="text-text text-sm">{successMessage}</p>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSuccessMessage('');
                  inviteMutation.reset();
                }}
              >
                Invite another
              </Button>
              <Button type="button" onClick={handleClose}>
                Done
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@example.com"
              autoFocus
            />
            {inviteMutation.isError && (
              <p className="text-danger text-sm">
                {(
                  inviteMutation.error as {
                    response?: { data?: { message?: string } };
                  }
                )?.response?.data?.message ?? 'Something went wrong. Please try again.'}
              </p>
            )}
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!email.trim() || inviteMutation.isPending}>
                {inviteMutation.isPending ? 'Sending...' : 'Send Invitation'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function PendingInvitationItem({
  invitation,
  groupId,
}: {
  invitation: GroupInvitation;
  groupId: number;
}) {
  const cancelMutation = useCancelInvitationMutation();

  return (
    <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
      <div className="bg-warning/10 flex h-8 w-8 items-center justify-center rounded-full">
        <Clock className="text-warning h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-text truncate text-sm font-medium">{invitation.email}</p>
        <p className="text-text-tertiary text-xs">
          Invite pending &middot; expires {new Date(invitation.expires_at).toLocaleDateString()}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="text-text-tertiary hover:text-danger h-7 w-7"
        onClick={() =>
          cancelMutation.mutate({
            groupId,
            invitationId: invitation.id,
          })
        }
        disabled={cancelMutation.isPending}
        title="Cancel invitation"
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
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
          <DialogDescription>Update the group name and description.</DialogDescription>
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
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
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
      <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium">
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
          <p className="text-text truncate text-sm font-medium">{member.name}</p>
          {isOwner && (
            <span className="bg-warning/10 text-warning flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium">
              <Crown className="h-2.5 w-2.5" />
              Owner
            </span>
          )}
          {member.pivot?.role === 'admin' && !isOwner && (
            <span className="bg-primary/10 text-primary rounded-full px-1.5 py-0.5 text-[10px] font-medium">
              Admin
            </span>
          )}
        </div>
        <p className="text-text-tertiary truncate text-xs">{member.email}</p>
      </div>

      {/* Actions */}
      {canManage && !isOwner && (
        <Button
          variant="ghost"
          size="icon"
          className="text-text-tertiary hover:text-danger h-7 w-7"
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
  const [inviteMemberOpen, setInviteMemberOpen] = useState(false);
  const [editGroupOpen, setEditGroupOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const isCurrentUserOwner = auth.user.id === group.owner.id;
  const deleteGroupMutation = useDeleteGroupMutation();
  const { isPending: isExporting, mutate: requestExport } = useGroupExport(group.id);
  const { data: invitationsData } = useGroupInvitationsQuery(isCurrentUserOwner ? group.id : 0);
  const pendingInvitations = invitationsData?.data ?? [];

  function handleDeleteGroup() {
    if (!confirm('Are you sure you want to delete this group? This cannot be undone.')) return;

    deleteGroupMutation.mutate(group.id, {
      onSuccess: () => {
        window.location.href = '/groups';
      },
    });
  }

  return (
    <AuthenticatedLayout defaultGroupId={group.id}>
      <Head title={group.name} />

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
              <Users className="text-primary h-5 w-5" />
            </div>
            <div>
              <h1 className="text-text text-xl font-semibold">{group.name}</h1>
              {group.description && (
                <p className="text-text-secondary text-sm">{group.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => requestExport()}
              disabled={isExporting}
              title="Export group tasks as CSV"
              className="text-text-tertiary"
            >
              <Download className="h-4 w-4" />
              {isExporting ? 'Requesting…' : 'Export CSV'}
            </Button>
            {isCurrentUserOwner && (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>

      {/* Members section */}
      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-text-secondary text-sm font-semibold">Members ({members.length})</h2>
          {isCurrentUserOwner && (
            <Button
              variant="ghost"
              className="text-text-secondary gap-1.5 text-xs"
              onClick={() => setInviteMemberOpen(true)}
            >
              <UserPlus className="h-3.5 w-3.5" />
              Invite Member
            </Button>
          )}
        </div>
        <div className="border-border bg-bg space-y-0.5 rounded-lg border p-1">
          {members.map((member) => (
            <MemberItem
              key={member.id}
              member={member}
              groupId={group.id}
              isOwner={member.id === group.owner.id}
              canManage={isCurrentUserOwner}
            />
          ))}
          {pendingInvitations.map((invitation) => (
            <PendingInvitationItem key={invitation.id} invitation={invitation} groupId={group.id} />
          ))}
        </div>
      </div>

      <Separator className="mb-6" />

      {/* Shared Tasks */}
      <div>
        <h2 className="text-text-secondary mb-3 text-sm font-semibold">Shared Tasks</h2>
        <TaskList
          tasks={tasks}
          emptyMessage="No tasks shared with this group yet."
          showProject
          onSelectTask={setSelectedTask}
        />
      </div>

      {/* Dialogs */}
      <InviteMemberDialog
        open={inviteMemberOpen}
        onOpenChange={setInviteMemberOpen}
        groupId={group.id}
      />
      <EditGroupDialog open={editGroupOpen} onOpenChange={setEditGroupOpen} group={group} />
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
