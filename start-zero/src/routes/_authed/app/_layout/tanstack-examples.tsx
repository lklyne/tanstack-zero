import { FormAddress } from '@/components/form-address'
import { FormSimple } from '@/components/form-simple'
import NavApp from '@/components/nav-app'
import {
	TsServerAction,
	tsServerActionLoader,
} from '@/components/ts-server-action'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/app/_layout/tanstack-examples')({
	component: RouteComponent,
	loader: async () => {
		try {
			// Load the counter value and mark the route as online
			const serverData = await tsServerActionLoader()
			return {
				initialCounter: serverData,
				offline: false,
			}
		} catch (error) {
			console.log('Offline mode detected for tanstack-examples')
			// In case of offline mode, check localStorage for a cached value
			let cachedValue = 0
			if (typeof window !== 'undefined') {
				const storedValue = localStorage.getItem('tsServerAction')
				if (storedValue) {
					cachedValue = Number(storedValue)
				}
			}
			return {
				initialCounter: cachedValue,
				offline: true,
			}
		}
	},
})

function RouteComponent() {
	return (
		<div className='container flex flex-col h-full overflow-y-auto'>
			<NavApp title='Tanstack Examples' />
			<div className='flex flex-col grow overflow-y-auto'>
				<div className='flex flex-col gap-8'>
					<div className='flex flex-col gap-4 max-w-2xl'>
						<FormSimple />
						<FormAddress />
						<TsServerAction />
					</div>
				</div>
			</div>
		</div>
	)
}
