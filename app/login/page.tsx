import LoginForm from '@/app/ui/login/login-form';
import { Suspense } from "react";

export const metadata = {
  title: "Login",
  description: "Login for existing users"
}

export default function Page() {
  return (
    <>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm p-8 bg-white rounded shadow">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  </>
  );
}
