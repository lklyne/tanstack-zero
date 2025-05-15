import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export function useNetworkStatus() {
	const [isOnline, setIsOnline] = useState(
		typeof navigator !== 'undefined' ? navigator.onLine : true,
	)
	const queryClient = useQueryClient()

	useEffect(() => {
		const handleOnline = () => {
			setIsOnline(true)
			// When coming back online, attempt to refetch any stale queries
			queryClient.invalidateQueries()
		}

		const handleOffline = () => {
			setIsOnline(false)
		}

		window.addEventListener('online', handleOnline)
		window.addEventListener('offline', handleOffline)

		return () => {
			window.removeEventListener('online', handleOnline)
			window.removeEventListener('offline', handleOffline)
		}
	}, [queryClient])

	return { isOnline }
}
