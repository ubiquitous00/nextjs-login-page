'use client';

import Link from "next/link";

export default function LoginForm() {
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
			<button
			type="submit"
			className="w-full py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition"
			>
			Login
			</button>
		</form>
	);
}