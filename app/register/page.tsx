import Image from "next/image";
import RegisterForm from '@/app/ui/register/register-form';
import { Suspense } from "react";

export default function Page() {
  return (
    <>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm p-8 bg-white rounded shadow">
        <Suspense>
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  </>
  );
}
