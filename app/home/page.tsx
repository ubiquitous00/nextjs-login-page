
export const metadata = {
  title: "Home"
}

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome</h1>
      <p className="text-lg text-gray-600">
        Try the <span className="font-semibold">Verify</span> button if you want to verify your address.
      </p>
    </div>
  );
}
