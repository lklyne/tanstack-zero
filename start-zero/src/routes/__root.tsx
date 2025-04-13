import type { initZero } from '@/lib/zero'
import {
	HeadContent,
	Outlet,
	Scripts,
	createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

// Import global styles directly for side effects
import '../styles.css'

import { auth } from '@/lib/auth' // Assuming path alias is configured
// Add imports for server function, web request, auth, and session type
import { createServerFn } from '@tanstack/react-start'
import { getWebRequest } from '@tanstack/react-start/server'
import type { Session } from 'better-auth' // Assuming Session type exists

// Define the server function to fetch the session
const fetchAuthSession = createServerFn({ method: 'GET' }).handler(async () => {
	const request = getWebRequest()
	if (!request) {
		// Handle case where request context might not be available
		// This shouldn't happen in typical TanStack Start server-side rendering flow
		console.error(
			'Server request context not found when fetching auth session.',
		)
		return { session: null }
	}

	try {
		// Fetch session using headers from the request
		const session = await auth.api.getSession({
			headers: request.headers,
		})
		return { session }
	} catch (error) {
		// Log error and return null session
		console.error('Failed to fetch auth session:', error)
		return { session: null }
	}
})

// Update the router context to include the session
interface MyRouterContext {
	z: ReturnType<typeof initZero> | undefined
	session: Session | null // Add session state
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	// Add the beforeLoad hook to fetch the session
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
				title: 'TanStack Start Starter',
			},
		],
	}),

	component: () => (
		<RootDocument>
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
			<body>
				{children}
				<Scripts />
			</body>
		</html>
	)
}
