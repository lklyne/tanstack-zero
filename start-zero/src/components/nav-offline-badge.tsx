import { Badge } from '@/components/ui/badge'
import { useNetworkStatus } from '@/hooks/use-network-status'

export function NavOfflineBadge() {
	const { isOnline } = useNetworkStatus()

	if (isOnline) return null

	return (
		<Badge
			className='text-amber-950 border border-amber-400/60 flex items-center gap-1 relative'
			style={{
				background: 'white',
				backgroundImage:
					'repeating-linear-gradient(45deg, rgba(245, 158, 11, 0.1) 0px, rgba(245, 158, 11, 0.1) 4px, transparent 5px, transparent 8px)',
			}}
		>
			<span className='font-medium'>Offline Mode</span>
		</Badge>
	)
}
