import { authClient } from '@/lib/auth-client'

const AccountOverview = () => {
	const { data, isPending, error } = authClient.useSession()

	return (
		<div>
			<h1>Account overview</h1>
			{data ? (
				<>
					<p>Logged in as</p>
					<p>{data.user.name}</p>
					<p>{data.user.email}</p>
				</>
			) : (
				<p>Not logged in</p>
			)}
		</div>
	)
}

export default AccountOverview
