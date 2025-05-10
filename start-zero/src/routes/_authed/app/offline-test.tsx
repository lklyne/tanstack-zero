import NavApp from '@/components/nav-app'
import { OfflineTest } from '@/components/offline-test'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/app/offline-test')({
	component: OfflineTestPage,
})

function OfflineTestPage() {
	return (
		<div className='container flex flex-col h-full overflow-y-auto'>
			<NavApp title='Offline Testing' />
			<div className='flex flex-col grow overflow-y-auto'>
				<div className='flex flex-col gap-8'>
					<div className='flex flex-col gap-4 max-w-2xl'>
						<OfflineTest />
					</div>
				</div>
			</div>
		</div>
	)
}
