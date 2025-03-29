import type { initZero } from '@/lib/zero'
import {
	HeadContent,
	Outlet,
	Scripts,
	createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import Header from '../components/Header'

import appCss from '../styles.css?url'

interface MyRouterContext {
	z: ReturnType<typeof initZero> | undefined
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: 'utf-8',
			},
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1',
			},
			{
				title: 'Zero Start',
			},
		],
		links: [
			{
				rel: 'stylesheet',
				href: appCss,
			},
		],
	}),

	component: () => (
		<RootDocument>
			<Header />

			<Outlet />
			<TanStackRouterDevtools />
		</RootDocument>
	),
})

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<head>
				<HeadContent />
			</head>
			<body className='bg-background text-foreground flex min-h-screen flex-col'>
				{children}
				<Scripts />
			</body>
		</html>
	)
}
