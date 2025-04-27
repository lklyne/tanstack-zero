import { createFileRoute } from '@tanstack/react-router'

import { FormAddress } from '@/components/form-address'
import { FormSimple } from '@/components/form-simple'
import NavApp from '@/components/nav-app'
import {
	TsServerAction,
	tsServerActionLoader,
} from '@/components/ts-server-action'

export const Route = createFileRoute('/_authed/app/_layout/tanstack-examples')({
	component: RouteComponent,
	loader: async () => ({
		tsServerAction: await tsServerActionLoader(),
	}),
})

function RouteComponent() {
	return (
		<div>
			<NavApp title='Tanstack Examples' />
			<div className='flex flex-col gap-8 bg-secondary/40'>
				<div className='flex flex-col gap-4 max-w-2xl'>
					<FormSimple />
					<FormAddress />
					<TsServerAction />
				</div>
			</div>
		</div>
	)
}
