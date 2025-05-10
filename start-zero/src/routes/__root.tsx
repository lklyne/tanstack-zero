import { DefaultCatchBoundary } from '@/components/default-catch-boundry'
import { MutationCache, QueryClient, QueryClientProvider, onlineManager, useIsRestoring } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
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

// Create a storage persister using localStorage
const persister = createSyncStoragePersister({
	storage: typeof window !== 'undefined' ? window.localStorage : null,
	key: 'tanstack-query-cache', // Key to use in localStorage
	throttleTime: 1000, // Time (in ms) to throttle persistence
})

// Create a client
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			// Use "always" instead of "online" to ensure queries work on refresh
			networkMode: 'always',
			// Keep data for 24 hours in cache (increased for better offline support)
			gcTime: 1000 * 60 * 60 * 24,
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
	// Configure mutation cache for better offline behavior
	mutationCache: new MutationCache({
		onError: (error) => {
			// Handle mutation errors - typically network errors when offline
			if (typeof window !== 'undefined' && !window.navigator.onLine) {
				console.log('Mutation error while offline - will retry when online')
			}
		},
	}),
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

	component: () => {
		// Wrap with PersistQueryClientProvider for offline support
		return (
			<>
				<PersistQueryClientProvider
					client={queryClient}
					persistOptions={{ persister }}
					onSuccess={() => {
						// Resume mutations after successful restore from localStorage
						queryClient.resumePausedMutations().then(() => {
							// Invalidate queries to refresh when back online
							if (onlineManager.isOnline()) {
								queryClient.invalidateQueries()
							}
						})
					}}
				>
					<RootDocument>
						<Outlet />
						<TanStackRouterDevtools position='bottom-right' />
					</RootDocument>
				</PersistQueryClientProvider>
			</>
		)
	},
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
