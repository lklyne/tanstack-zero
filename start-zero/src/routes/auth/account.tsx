import AccountOverview from '@/components/account-overview'
// import { AuthTest } from '@/components/AuthTest'
import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/auth/account')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className='container mx-auto flex flex-col justify-center min-h-screen'>
			<div className='max-w-5xl w-full py-24'>
				<AccountOverview />
			</div>
		</div>
	)
}
