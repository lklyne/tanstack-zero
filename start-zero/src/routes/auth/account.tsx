import AccountOverview from '@/components/account-overview'
// import { AuthTest } from '@/components/AuthTest'
import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/auth/account')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div>
			<h1>Account</h1>
			<AccountOverview />
		</div>
	)
}
