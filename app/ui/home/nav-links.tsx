'use client';

import {
  HomeIcon,
  IdentificationIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useActionState } from "react";
import { logout } from '@/app/lib/login';

const links = [
	{ name: 'Home',
		href: '/home',
		icon: HomeIcon
	},
	{
		name: 'Verify',
		href: '/home/verify',
		icon: IdentificationIcon
	}
];

export default function NavLinks() {
	const pathname = usePathname();
	const [errorMessage, logoutAction, isPending] = useActionState(
			logout,
			undefined,
		);
	return (
		<>
		{links.map((link) => {
			const LinkIcon = link.icon;
			return (
			<Link
				key={link.name}
				href={link.href}
				className={clsx(
					'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
					{
						'bg-sky-100 text-blue-600': pathname === link.href,
					},
				)}
			>
				<LinkIcon className="w-6" />
				<p className="hidden md:block">{link.name}</p>
			</Link>
			);
		})}
		<div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
		<form
			action={logoutAction}
		>
			<button className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
				<XCircleIcon className="w-6" />
				<div className="hidden md:block">Sign Out</div>
			</button>
		</form>
		</>
	);
}