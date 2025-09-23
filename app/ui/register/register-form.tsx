'use client';

import {
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import Link from "next/link";
import { useState } from "react";

function isValidPassword(password: string) {
  // At least 12 chars, one number, one symbol
  return (
    password.length >= 12 &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

function isValidEmail(email: string) {
  // Simple regex: must contain at least one "@" character
  return /^[^@]+@[^@]+$/.test(email.trim());
}

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [touched, setTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordsMatch = password === confirmPassword;
  const passwordValid = isValidPassword(password);
  const emailValid = isValidEmail(email);

  const showMatchError = touched && !passwordsMatch;
  const showPasswordError = touched && !passwordValid;
  const showEmailError = emailTouched && !emailValid;

  const formValid = passwordsMatch && passwordValid && emailValid;

  return (
    <form>
      <div className="mb-4">
        <label className="block mb-1 font-medium" htmlFor="email">
          Email
        </label>
        <input
          className="w-full px-3 py-2 border rounded"
          type="email"
          id="email"
          name="email"
          required
          autoComplete="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onBlur={() => setEmailTouched(true)}
        />
        {showEmailError && (
          <p className="mt-2 text-sm text-red-600">
            Please enter a valid email address
          </p>
        )}
      </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium" htmlFor="password">
          Password
        </label>
        <div className="relative">
          <input
            className="w-full px-3 py-2 border rounded pr-10"
            type={showNewPassword ? "text" : "password"}
            id="password"
            name="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched(true)}
          />
          <button
            type="button"
            className="absolute top-1/2 right-2 -translate-y-1/2 p-1"
            onClick={() => setShowNewPassword((prev) => !prev)}
            tabIndex={-1}
            aria-label={showNewPassword ? "Hide password" : "Show password"}
          >
            {showNewPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Password must be at least 12 characters, contain a number, and a symbol.
        </p>
        {showPasswordError && (
          <p className="mt-2 text-sm text-red-600">
            Password does not meet the requirements
          </p>
        )}
      </div>
      <div className="mb-6">
        <label className="block mb-1 font-medium" htmlFor="confirm-password">
          Confirm Password
        </label>
        <div className="relative">
          <input
            className="w-full px-3 py-2 border rounded pr-10"
            type={showConfirmPassword ? "text" : "password"}
            id="confirm-password"
            name="confirm-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={() => setTouched(true)}
          />
          <button
            type="button"
            className="absolute top-1/2 right-2 -translate-y-1/2 p-1"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            tabIndex={-1}
            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
          >
            {showConfirmPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>
        {showMatchError && (
          <p className="mt-2 text-sm text-red-600">
            Passwords do not match
          </p>
        )}
      </div>
      <div className="mb-6">
        <Link
          href="/login"
          className="text-blue-600 hover:underline"
        >
          Already have an account? Log in
        </Link>
      </div>
      <button
        type="submit"
        className={`w-full py-2 font-semibold rounded transition ${
          formValid
            ? "text-white bg-blue-600 hover:bg-blue-700"
            : "text-gray-400 bg-gray-200 cursor-not-allowed"
        }`}
        disabled={!formValid}
      >
        Sign Up
      </button>
    </form>
  );
}