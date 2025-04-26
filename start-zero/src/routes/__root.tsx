import { DefaultCatchBoundary } from '@/components/default-catch-boundry'
import type { initZero } from '@/lib/zero'
import type { ErrorComponentProps } from '@tanstack/react-router'
import {
	HeadContent,
	Outlet,
	Scripts,
	createRootRouteWithContext,
} from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

// Import CSS as a URL
import appCss from '@/styles.css?url'

// Import the server function from its dedicated file
import { fetchAuthSession } from '@/lib/session.server'
import type { Session } from 'better-auth' // Restore Session type import

// Update the router context to include the session
interface MyRouterContext {
	z: ReturnType<typeof initZero> | undefined
	session: Session | null // Restore session state
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	// Restore the beforeLoad hook
	beforeLoad: async () => {
		const { session } = await fetchAuthSession()
		// Return the session data to be added to the route context
		return { session }
	},
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
		errorComponent: (props: ErrorComponentProps) => {
			return (
				<RootDocument>
					<DefaultCatchBoundary {...props} />
				</RootDocument>
			)
		},
	}),

	component: () => (
		<>
			<RootDocument>
				<Outlet />
				{/* <TanStackRouterDevtools /> */}
			</RootDocument>
		</>
	),
})

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<head>
				<HeadContent />
			</head>
			<body>
				{children}
				<Scripts />
			</body>
		</html>
	)
}
