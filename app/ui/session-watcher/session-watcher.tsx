"use client";
import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";

export default function SessionWatcher() {
  const { data: session, status } = useSession();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      setShowPopup(true);
    } else if (status === "authenticated") {
      setShowPopup(false);
    }
  }, [status, session]);

  return (
    <>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Session Expired</h2>
            <p className="mb-6">Your session has expired. Please log in again.</p>
            <button
              onClick={() => signIn()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Re-Login
            </button>
          </div>
        </div>
      )}
    </>
  );
}