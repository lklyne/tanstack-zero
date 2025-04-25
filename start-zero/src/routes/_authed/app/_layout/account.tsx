import { AccountDebug } from '@/components/account-debug'
import AccountOverview from '@/components/account-overview'
import NavApp from '@/components/nav-app'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/app/_layout/account')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className='container mx-auto flex flex-col justify-center min-h-screen'>
			<NavApp title='Account'>
				<div className='flex items-center'>
					<AccountDebug />
				</div>
			</NavApp>
			<AccountOverview />
		</div>
	)
}
