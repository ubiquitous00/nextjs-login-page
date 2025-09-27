'use client';

import {
  EyeIcon,
  EyeSlashIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import Link from "next/link";
import { useState, useActionState, useEffect } from "react";
import { register } from "@/app/lib/actions/register";
import { useRouter } from "next/navigation";


function isValidPassword(password: string) {
  // At least 12 chars, one number, one symbol
  return (
    password.length >= 12 &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

function isUsernameValid(username: string) {
  return /^[a-zA-Z0-9_-]{3,20}$/.test(username);
}

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordTouched, setNewPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordsMatch = newPassword === confirmPassword;
  const passwordValid = isValidPassword(newPassword);
  const usernameValid = isUsernameValid(username);

  const showMatchError = confirmPasswordTouched && !passwordsMatch;
  const showPasswordError = newPasswordTouched && !passwordValid;
  const showUsernameError = usernameTouched && !usernameValid;

  const formValid = passwordsMatch && passwordValid;

  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    register,
    undefined,
  );

  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => {
        router.push('/login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state, router]);

  return (
    <form className="space-y-6">
      <div>
        <label htmlFor="postcode" className="block text-sm font-medium text-gray-700">
          Postcode
        </label>
        <input
          type="text"
          id="postcode"
          name="postcode"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="suburb" className="block text-sm font-medium text-gray-700">
          Suburb
        </label>
        <input
          type="text"
          id="suburb"
          name="suburb"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="state" className="block text-sm font-medium text-gray-700">
          State
        </label>
        <input
          type="text"
          id="state"
          name="state"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Verify
      </button>
    </form>
  );
}