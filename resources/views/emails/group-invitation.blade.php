<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Group Invitation</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f9fafb; margin: 0; padding: 0; color: #111827; }
        .wrapper { max-width: 560px; margin: 40px auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
        .header { background: #2563eb; padding: 32px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
        .body { padding: 36px; }
        .body p { margin: 0 0 16px; line-height: 1.6; color: #374151; font-size: 15px; }
        .group-badge { display: inline-block; background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; border-radius: 8px; padding: 6px 14px; font-weight: 600; font-size: 15px; margin: 4px 0 20px; }
        .btn { display: inline-block; background: #2563eb; color: #ffffff !important; text-decoration: none; padding: 13px 28px; border-radius: 8px; font-weight: 600; font-size: 15px; margin: 8px 0 24px; }
        .note { font-size: 13px; color: #6b7280; margin-top: 24px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
        .footer { background: #f9fafb; padding: 20px 36px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header">
            <h1>{{ $appName }}</h1>
        </div>
        <div class="body">
            <p>Hi there,</p>
            <p><strong>{{ $inviterName }}</strong> has invited you to join their group:</p>
            <div><span class="group-badge">{{ $groupName }}</span></div>

            @if($isNewUser)
                <p>You don't have a {{ $appName }} account yet. Click the button below to create your account and automatically join the group.</p>
                <a href="{{ $acceptUrl }}" class="btn">Create Account &amp; Join Group</a>
            @else
                <p>Click the button below to accept the invitation and join the group.</p>
                <a href="{{ $acceptUrl }}" class="btn">Accept Invitation</a>
            @endif

            <p class="note">
                This invitation expires on {{ $expiresAt->format('F j, Y \a\t g:i A') }}.
                If you did not expect this invitation, you can safely ignore this email.
            </p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} {{ $appName }}. All rights reserved.
        </div>
    </div>
</body>
</html>
