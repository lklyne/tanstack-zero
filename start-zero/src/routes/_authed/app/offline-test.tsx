import { OfflineTest } from '@/components/offline-test'
import { Button } from '@/components/ui/button'
import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/app/offline-test')({
	component: OfflineTestPage,
})

function OfflineTestPage() {
	return (
		<div className='p-8 max-w-4xl mx-auto'>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-2xl font-bold'>Offline-First Testing</h1>
				<Link to='/app'>
					<Button variant='outline'>Back to App</Button>
				</Link>
			</div>

			<OfflineTest />

			<div className='bg-white p-6 rounded-lg shadow-md'>
				<h2 className='text-lg font-medium mb-4'>Testing Instructions</h2>

				<div className='mb-4'>
					<p className='mb-2'>
						This page is designed to help test our offline-first implementation.
						Follow these steps:
					</p>

					<ol className='list-decimal pl-6 space-y-2'>
						<li>Browse around the app while online to ensure data is cached</li>
						<li>Open Chrome DevTools (F12) and go to the Network tab</li>
						<li>Check the "Offline" checkbox to simulate being offline</li>
						<li>Try navigating between different routes</li>
						<li>Observe that navigation works without network errors</li>
						<li>Check that the "Offline Mode" indicator appears</li>
						<li>Try interacting with data to verify Zero cache is working</li>
						<li>Uncheck "Offline" to come back online</li>
						<li>Verify data syncs correctly when back online</li>
					</ol>
				</div>

				<div className='text-sm text-gray-500'>
					Note: The "Simulate Offline" button in the test panel only triggers
					the offline event but doesn't actually disable network connections.
					Use the DevTools Network tab for proper testing.
				</div>
			</div>
		</div>
	)
}
