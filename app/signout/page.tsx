
export const metadata = {
  title: "Signed Out"
}

export default function Page() {
  return (
    <>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm p-8 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">You have been signed out</h1>
        <p className="mb-4 text-center">Thank you for using our service. You have successfully signed out.</p>
        <p className="mb-6 text-center">If you wish to sign in again, please use the link below.</p>
        <div className="text-center">
          <a href="/login" className="text-blue-600 hover:underline">Go to Login Page</a>
        </div>
      </div>
    </div>
  </>
  );
}
