import { DefaultCatchBoundary } from '@/components/default-catch-boundry'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ErrorComponentProps } from '@tanstack/react-router'
import {
	HeadContent,
	Outlet,
	Scripts,
	createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

// Import CSS as a URL
import appCss from '@/styles.css?url'

// Create a client
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// Use "always" instead of "online" to ensure queries work on refresh
			networkMode: 'always',
			// Keep data for 5 minutes before refetching (reduced from 1 hour)
			staleTime: 1000 * 60 * 5,
			// Retry 3 times unless offline
			retry: (failureCount, error) => {
				if (typeof window !== 'undefined' && !window.navigator.onLine) {
					return false
				}
				return failureCount < 3
			},
		},
	},
})

export const Route = createRootRoute({
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
			<QueryClientProvider client={queryClient}>
				<RootDocument>
					<Outlet />
					<TanStackRouterDevtools position='bottom-right' />
				</RootDocument>
			</QueryClientProvider>
		</>
	),
})

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<head>
				<HeadContent />
			</head>
			<body className='overscroll-none'>
				{children}
				<Scripts />
			</body>
		</html>
	)
}
