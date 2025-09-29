import { AusPostClientProviders } from "@/app/providers";
import { Suspense } from "react";
import VerifyForm from "@/app/ui/verify/verify-form";

export const metadata = {
  title: "Verify your address",
  description: "Verify your postcode, suburb and state"
}

export default function Page() {
  return (
    <AusPostClientProviders>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-sm p-8 bg-white rounded shadow">
          <div className="flex flex-col items-center mb-6">
            <h1 className="text-2xl font-bold">Verify Your Address</h1>
          </div>
          <Suspense>
            <VerifyForm />
          </Suspense>
        </div>
      </div>
    </AusPostClientProviders>
  );
}
