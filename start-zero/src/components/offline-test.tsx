import { NavOfflineBadge } from '@/components/nav-offline-badge'
import { Switch } from '@/components/ui/switch'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

export function OfflineTest() {
	const queryClient = useQueryClient()

	// Use TanStack Query to persist offline state
	const { data: isOnline = true } = useQuery({
		queryKey: ['networkStatus'],
		queryFn: () => (typeof navigator !== 'undefined' ? navigator.onLine : true),
		staleTime: Number.POSITIVE_INFINITY,
		gcTime: Number.POSITIVE_INFINITY,
	})

	useEffect(() => {
		const handleOnline = () => {
			queryClient.setQueryData(['networkStatus'], true)
			// When coming back online, attempt to refetch any stale queries
			queryClient.invalidateQueries()
		}

		const handleOffline = () => {
			queryClient.setQueryData(['networkStatus'], false)
		}

		window.addEventListener('online', handleOnline)
		window.addEventListener('offline', handleOffline)

		return () => {
			window.removeEventListener('online', handleOnline)
			window.removeEventListener('offline', handleOffline)
		}
	}, [queryClient])

	const simulateOffline = () => {
		window.dispatchEvent(new Event('offline'))
	}

	const simulateOnline = () => {
		window.dispatchEvent(new Event('online'))
	}

	return (
		<div className='container'>
			<div className='flex flex-col border m-4 bg-background'>
				<div className='flex items-center gap-2 w-full justify-between px-4 border-b pb-2 pt-2 h-10'>
					<h2 className='font-semibold text-sm'>Network Status</h2>
					<NavOfflineBadge />
				</div>
				<div className='p-4 flex flex-col gap-4'>
					<p className='text-sm text-muted-foreground'>
						This app works seamlessly offline using a combination of local
						caching strategies. Your data and changes are automatically
						synchronized when you reconnect.
					</p>

					<div className='space-y-4'>
						<div>
							<h3 className='text-sm font-medium mb-2'>Authentication</h3>
							<p className='text-sm text-muted-foreground'>
								Your authentication token is cached locally and checked first,
								even when online. When offline, expired tokens are still
								accepted to maintain functionality.
							</p>
						</div>

						<div>
							<h3 className='text-sm font-medium mb-2'>Data Synchronization</h3>
							<p className='text-sm text-muted-foreground'>
								Zero Sync maintains a local cache of your data that works
								offline. Changes made while offline are stored locally and
								automatically synchronized when you reconnect.
							</p>
						</div>

						<div>
							<h3 className='text-sm font-medium mb-2'>Route Caching</h3>
							<p className='text-sm text-muted-foreground'>
								TanStack Query caches route data with extended stale times (1
								hour) and keeps it indefinitely while offline (24 hour garbage
								collection). Routes automatically refresh when back online.
							</p>
						</div>

						<div className='flex items-center space-x-2 pt-2'>
							<Switch
								checked={!isOnline}
								onCheckedChange={(checked) => {
									if (checked) {
										simulateOffline()
									} else {
										simulateOnline()
									}
								}}
								id='airplane-mode'
							/>
							<label
								htmlFor='airplane-mode'
								className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
							>
								Airplane Mode
							</label>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
