import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import { Button } from '@/components/ui/Button';

export default function VerifyEmail({ status }: { status?: string }) {
  const { post: postResend, processing: resendProcessing } = useForm({});
  const { post: postLogout, processing: logoutProcessing } = useForm({});

  return (
    <GuestLayout>
      <Head title="Verify Email" />

      <div className="mx-auto w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-text text-2xl font-semibold">Verify your email</h1>
          <p className="text-text-secondary mt-2 text-sm">
            Thanks for signing up! Please check your inbox for a verification link before
            continuing.
          </p>
        </div>

        {status === 'verification-link-sent' && (
          <div className="bg-success/10 text-success mb-4 rounded-lg px-4 py-3 text-sm">
            A new verification link has been sent to your email address.
          </div>
        )}

        <div className="space-y-3">
          <Button
            className="w-full"
            disabled={resendProcessing}
            onClick={() => postResend(route('verification.send'))}
          >
            {resendProcessing ? 'Sending...' : 'Resend verification email'}
          </Button>

          <Button
            variant="outline"
            className="w-full"
            disabled={logoutProcessing}
            onClick={() => postLogout(route('logout'))}
          >
            Log out
          </Button>
        </div>
      </div>
    </GuestLayout>
  );
}
