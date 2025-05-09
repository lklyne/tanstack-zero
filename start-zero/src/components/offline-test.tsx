import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

export function OfflineTest() {
	const [isOnline, setIsOnline] = useState(
		typeof navigator !== 'undefined' ? navigator.onLine : true,
	)
	const [lastOnlineStatus, setLastOnlineStatus] = useState(
		'No changes detected yet',
	)
	const [lastNavigation, setLastNavigation] = useState('No navigation yet')

	useEffect(() => {
		const handleOnline = () => {
			setIsOnline(true)
			setLastOnlineStatus(`Went online at ${new Date().toLocaleTimeString()}`)
		}

		const handleOffline = () => {
			setIsOnline(false)
			setLastOnlineStatus(`Went offline at ${new Date().toLocaleTimeString()}`)
		}

		window.addEventListener('online', handleOnline)
		window.addEventListener('offline', handleOffline)

		return () => {
			window.removeEventListener('online', handleOnline)
			window.removeEventListener('offline', handleOffline)
		}
	}, [])

	// Helper to simulate network state changes
	const simulateOffline = () => {
		// This can only simulate the event, not actually change navigator.onLine
		window.dispatchEvent(new Event('offline'))
		alert(
			"Offline simulation triggered.\n\nPlease note: This just triggers the event but doesn't actually change navigator.onLine.\n\nTo properly test offline mode:\n1. Use browser DevTools Network tab\n2. Check 'Offline' option\n3. Try navigating between routes",
		)
	}

	const simulateOnline = () => {
		window.dispatchEvent(new Event('online'))
	}

	const recordNavigation = () => {
		setLastNavigation(
			`Navigation attempted at ${new Date().toLocaleTimeString()}`,
		)
	}

	return (
		<div className='p-4 bg-gray-100 rounded-lg mb-4'>
			<h2 className='text-lg font-bold mb-2'>Offline-First Testing</h2>

			<div className='mb-4'>
				<div className='font-medium'>Current Network Status:</div>
				<div
					className={`text-sm ${isOnline ? 'text-green-600' : 'text-red-600'} font-bold`}
				>
					{isOnline ? 'Online ✅' : 'Offline ⚠️'}
				</div>
			</div>

			<div className='mb-4'>
				<div className='font-medium'>Status Changes:</div>
				<div className='text-sm'>{lastOnlineStatus}</div>
			</div>

			<div className='mb-4'>
				<div className='font-medium'>Navigation Log:</div>
				<div className='text-sm'>{lastNavigation}</div>
			</div>

			<div className='flex flex-wrap gap-2'>
				<Button size='sm' variant='outline' onClick={simulateOffline}>
					Simulate Offline
				</Button>
				<Button size='sm' variant='outline' onClick={simulateOnline}>
					Simulate Online
				</Button>
				<Button size='sm' variant='outline' onClick={recordNavigation}>
					Record Navigation
				</Button>
			</div>

			<div className='mt-4 text-xs text-gray-500'>
				<p>To properly test offline functionality:</p>
				<ol className='list-decimal pl-5'>
					<li>Open DevTools (F12)</li>
					<li>Go to Network tab</li>
					<li>Check "Offline" checkbox</li>
					<li>Try navigating between routes</li>
				</ol>
			</div>
		</div>
	)
}
