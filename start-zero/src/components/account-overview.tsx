import { authClient, signOut } from '@/lib/auth-client'
import { useCallback, useEffect, useState } from 'react'
import { Button } from './ui/button'

const AccountOverview = () => {
	const { data, isPending, error } = authClient.useSession()
	const [jwt, setJwt] = useState<string | null>(null)

	const fetchToken = useCallback(async () => {
		try {
			const response = await fetch('/api/auth/token')
			// Log all headers for debugging
			console.log('Response headers:', [...response.headers.entries()])

			const authJwt = response.headers.get('set-auth-jwt')
			if (authJwt) {
				console.log('Found JWT in headers:', authJwt)
				setJwt(authJwt)
			}

			const tokenData = await response.json()
			console.log('Token response data:', tokenData)
		} catch (err) {
			console.error('Error fetching JWT:', err)
		}
	}, [])

	useEffect(() => {
		if (data) {
			console.log('Session Data:', data)
			fetchToken()
		}
	}, [data, fetchToken])

	return (
		<div className='space-y-4'>
			<h1>Account overview</h1>
			{isPending && <p>Loading...</p>}
			{error && <p>Error: {error.message}</p>}
			{data ? (
				<div className='space-y-4'>
					<div>
						<h2>User Info:</h2>
						<p>Name: {data.user.name}</p>
						<p>Email: {data.user.email}</p>
						<p>ID: {data.user.id}</p>
					</div>

					<div>
						<h2>JWT Status:</h2>
						<Button onClick={fetchToken}>Refresh Token</Button>
						{jwt && (
							<pre className='bg-gray-100 p-4 mt-2 rounded overflow-auto max-h-48'>
								{jwt}
							</pre>
						)}
					</div>

					<Button onClick={() => signOut()}>Sign Out</Button>

					<div>
						<h2>Debug Info:</h2>
						<pre className='bg-gray-100 p-4 rounded overflow-auto max-h-96'>
							{JSON.stringify(data, null, 2)}
						</pre>
					</div>
				</div>
			) : (
				<p>Not logged in</p>
			)}
		</div>
	)
}

export default AccountOverview
