// app/reset-password/page.tsx
import { Suspense } from 'react';
import ResetPassword from './reset-password-from';

export default function ResetPasswordPage() {
  return (
    <main>
      <h1>Reset Your Password</h1>
      {/* The Suspense boundary MUST wrap the component calling the hook */}
      <Suspense fallback={<div>Loading form...</div>}>
        <ResetPassword />
      </Suspense>
    </main>
  );
}
