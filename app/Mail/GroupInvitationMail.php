<?php

namespace App\Mail;

use App\Models\GroupInvitation;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class GroupInvitationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly GroupInvitation $invitation,
        public readonly bool $isNewUser,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'You have been invited to join ' . $this->invitation->group->name . ' on ' . config('app.name'),
        );
    }

    public function content(): Content
    {
        $acceptUrl = $this->isNewUser
            ? route('register', ['invitation' => $this->invitation->token])
            : route('invitations.accept', $this->invitation->token);

        return new Content(
            view: 'emails.group-invitation',
            with: [
                'invitation' => $this->invitation,
                'inviterName' => $this->invitation->inviter->name,
                'groupName' => $this->invitation->group->name,
                'acceptUrl' => $acceptUrl,
                'isNewUser' => $this->isNewUser,
                'appName' => config('app.name'),
                'expiresAt' => $this->invitation->expires_at,
            ],
        );
    }
}
