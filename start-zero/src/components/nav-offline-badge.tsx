import { Badge } from '@/components/ui/badge'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

export function NavOfflineBadge() {
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

	if (isOnline) return null

	return (
		<Badge className='text-red-950 border border-red-400/40 starting:-translate-1 translate-x-0 bg-gradient-to-br from-red-50/50 to-red-100 flex items-center gap-1'>
			Offline Mode
		</Badge>
	)
}
