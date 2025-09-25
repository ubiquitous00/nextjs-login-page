'use client';

import Link from "next/link";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { useState, useActionState } from "react";
import { authenticate } from "@/app/lib/actions/login";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const formValid = username.trim() !== "" && password.trim() !== "";

	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") || "/home";
	const [errorMessage, formAction, isPending] = useActionState(
		authenticate,
		undefined,
	);

	return (
		<form action={formAction}>
			<div className="mb-4">
			<label className="block mb-1 font-medium" htmlFor="username">
				Username
			</label>
			<input
				className="w-full px-3 py-2 border rounded"
				type="text"
				id="username"
				name="username"
				required
				autoComplete="username"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
			/>
			</div>
			<div className="mb-6">
			<label className="block mb-1 font-medium" htmlFor="password">
				Password
			</label>
			<input
				className="w-full px-3 py-2 border rounded"
				type="password"
				id="password"
				name="password"
				required
				autoComplete="current-password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			</div>
			<div className="mb-6">
				<Link
					href="/register"
					className="text-blue-600 hover:underline"
				>
					Don't have an account? Sign up
				</Link>
			</div>
			<input type="hidden" name="redirectTo" value={callbackUrl} />
			<button
			type="submit"
			className={`w-full py-2 font-semibold rounded transition ${
          formValid && !isPending
            ? "text-white bg-blue-600 hover:bg-blue-700"
            : "text-gray-400 bg-gray-200 cursor-not-allowed"
        }`}
        disabled={!formValid || isPending}
			>
			Login
			</button>
			{errorMessage && (
				<>
					<ExclamationCircleIcon className="h-5 w-5 text-red-500" />
					<p className="text-sm text-red-500">{errorMessage}</p>
				</>
			)}
		</form>
	);
}