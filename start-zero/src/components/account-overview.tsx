import { authClient, signOut } from '@/lib/auth-client'
import { Loader2 } from 'lucide-react' // Assuming this might be needed later
import { useCallback, useEffect, useState } from 'react'
import { Button } from './ui/button'
// import { useQuery, useZero } from '@rocicorp/zero/react'
// import { Schema } from '@/lib/zero/schema'

// Helper function to decode Base64Url
function base64UrlDecode(inputStr: string): string {
	// Replace Base64Url specific characters
	let base64 = inputStr.replace(/-/g, '+').replace(/_/g, '/')
	// Pad string with '=' to make it valid Base64
	while (base64.length % 4) {
		base64 += '='
	}
	try {
		return atob(base64)
	} catch (e) {
		console.error('Base64Url decode failed:', e)
		return ''
	}
}

const AccountOverview = () => {
	const { data, isPending, error } = authClient.useSession()
	const [jwt, setJwt] = useState<string | null>(null)
	const [decodedPayload, setDecodedPayload] = useState<object | null>(null)
	// Placeholder state for subscription loading, adapt as needed
	const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(false)
	// const z = useZero<Schema>()

	const fetchToken = useCallback(async () => {
		try {
			const response = await fetch('/api/auth/token')
			// Log all headers for debugging
			console.log('Response headers:', [...response.headers.entries()])

			// Prefer getting JWT from header if available
			const authJwt = response.headers.get('set-auth-jwt')
			if (authJwt) {
				console.log('Found JWT in headers:', authJwt)
				setJwt(authJwt)
			} else {
				// Fallback to response body if not in header
				const tokenData = await response.json()
				console.log('Token response data:', tokenData)
				if (tokenData.token) {
					setJwt(tokenData.token)
				} else {
					setJwt(null) // Clear JWT if not found
				}
			}
		} catch (err) {
			console.error('Error fetching JWT:', err)
			setJwt(null) // Clear JWT on error
		}
	}, [])

	useEffect(() => {
		if (data) {
			console.log('Session Data:', data)
			fetchToken() // Fetch initial token when session loads
		}
	}, [data, fetchToken])

	// Decode JWT when it changes
	useEffect(() => {
		if (jwt) {
			try {
				const payloadBase64Url = jwt.split('.')[1]
				if (payloadBase64Url) {
					const decodedJson = base64UrlDecode(payloadBase64Url)
					setDecodedPayload(JSON.parse(decodedJson))
				} else {
					setDecodedPayload(null)
				}
			} catch (err) {
				console.error('Error decoding JWT payload:', err)
				setDecodedPayload({ error: 'Failed to decode payload' })
			}
		} else {
			setDecodedPayload(null)
		}
	}, [jwt])

	// Placeholder functions, adapt as needed
	const refetchSubscription = () => {
		console.log('Refetching subscription...')
		// Add actual logic later
		setIsSubscriptionLoading(true)
		setTimeout(() => setIsSubscriptionLoading(false), 1000) // Simulate loading
	}

	const handleLogout = () => {
		signOut()
		// Add navigation logic if needed, e.g., navigate('/')
	}

	const deleteUser = async () => {
		if (
			!window.confirm(
				'Are you sure you want to delete your account? This cannot be undone.',
			)
		) {
			return
		}
		console.log('Deleting user...')
		// Add actual deletion logic here, including Zero DB deletion if integrated
		handleLogout() // Logout after deletion attempt
	}

	return (
		<div className='space-y-6'>
			<div className='pt-12'>
				<h1 className='text-2xl font-bold mb-4'>Account</h1>
				<p className='text-muted-foreground mb-6'>
					Manage your account settings and preferences.
				</p>

				{isPending && <p>Loading account data...</p>}
				{error && <p className='text-destructive'>Error: {error.message}</p>}

				{data ? (
					<div className='space-y-4'>
						{/* Profile Information - Zero DB Placeholder */}
						<div className='p-4 border rounded-md'>
							<h2 className='font-medium mb-4 px-2 py-1 bg-pink-50 text-pink-800 rounded border border-pink-200 dark:bg-pink-950/40 dark:text-pink-50 dark:border-pink-900 inline-block'>
								Zero (Placeholder)
							</h2>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div>
									<p className='text-sm text-muted-foreground'>Name</p>
									{/* Replace with Zero data when available */}
									<p>{data.user.name || 'Not available'}</p>
								</div>
								<div>
									<p className='text-sm text-muted-foreground'>User ID</p>
									{/* Replace with Zero data when available */}
									<p>{'Zero User ID Placeholder'}</p>
								</div>
								<div>
									<p className='text-sm text-muted-foreground'>Email</p>
									{/* Replace with Zero data when available */}
									<p>{data.user.email || 'Not available'}</p>
								</div>
								<div>
									<p className='text-sm text-muted-foreground'>Zero DB Plan</p>
									{/* Replace with Zero data when available */}
									<p>{'Plan Placeholder'}</p>
								</div>
							</div>
						</div>

						{/* Account Actions - Better Auth */}
						<div className='p-4 border rounded-md space-y-4'>
							<h2 className='font-medium mb-4'>
								<span className='px-2 py-1 bg-blue-50 text-blue-800 rounded border border-blue-200 dark:bg-blue-950/40 dark:text-blue-50 dark:border-blue-900 inline-block'>
									Better Auth
								</span>
							</h2>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div>
									<p className='text-sm text-muted-foreground'>Name</p>
									<p>{data.user.name || 'Not available'}</p>
								</div>
								<div>
									<p className='text-sm text-muted-foreground'>User ID</p>
									<p>{data.user.id}</p>
								</div>
								<div>
									<p className='text-sm text-muted-foreground'>Email</p>
									<p>{data.user.email || 'Not available'}</p>
								</div>
								<div>
									<p className='text-sm text-muted-foreground'>
										Email Verified
									</p>
									{/* Assuming emailVerified might be available in session data later */}
									<p>{data.user.emailVerified ? 'Yes' : 'No'}</p>
								</div>
							</div>

							{/* JWT Info */}
							<div className='mt-4'>
								<h3 className='text-lg font-medium mb-2'>JWT Status:</h3>
								<Button onClick={fetchToken} className='mb-2' variant='outline'>
									Refresh Token
								</Button>
								{jwt && (
									<div className='mt-2'>
										<h4 className='text-md font-medium'>Raw JWT:</h4>
										<pre className='bg-gray-100 p-4 mt-1 rounded overflow-auto max-h-48 text-xs'>
											{jwt}
										</pre>
									</div>
								)}
								{decodedPayload && (
									<div className='mt-4'>
										<h4 className='text-md font-medium'>Decoded Payload:</h4>
										<pre className='bg-gray-100 p-4 mt-1 rounded overflow-auto max-h-96 text-sm'>
											{JSON.stringify(decodedPayload, null, 2)}
										</pre>
									</div>
								)}
							</div>

							<div className='flex gap-2 w-full justify-between flex-wrap'>
								<Button
									variant='outline'
									onClick={handleLogout}
									className='w-full sm:w-auto flex-grow sm:flex-grow-0'
								>
									Log Out
								</Button>
								<Button
									variant='destructive'
									onClick={() => deleteUser()}
									className='w-full sm:w-auto flex-grow sm:flex-grow-0'
								>
									Delete Account
								</Button>
							</div>
						</div>

						{/* Subscription - Polar Placeholder */}
						<div className='p-4 border rounded-md'>
							<div className='flex justify-between items-center mb-4'>
								<h2 className='font-medium mb-4 px-2 py-1 bg-green-50 text-green-800 rounded border border-green-200 dark:bg-green-950/40 dark:text-green-50 dark:border-green-900'>
									Polar (Placeholder)
								</h2>
								<Button
									variant='ghost'
									size='sm'
									onClick={refetchSubscription}
									disabled={isSubscriptionLoading}
								>
									{isSubscriptionLoading ? (
										<Loader2 className='h-4 w-4 animate-spin' />
									) : (
										'Refresh'
									)}
								</Button>
							</div>

							{/* Placeholder for subscription error handling */}
							{/* <div className="text-destructive mb-4">Error loading subscription: {subscriptionError}</div> */}

							<div className='space-y-6'>
								{/* Subscription Status Placeholder */}
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div>
										<p className='text-sm text-muted-foreground'>
											Current Plan
										</p>
										<p className='font-medium'>{'Free (Placeholder)'}</p>
									</div>
									{/* Placeholder for next payment info */}
									{/* <div>
                                    <p className="text-sm text-muted-foreground">Next Payment</p>
                                    <p className="font-medium">{'Date Placeholder'}</p>
                                </div> */}
								</div>

								{/* Action Buttons Placeholder */}
								<div className='flex flex-wrap gap-2'>
									<Button
										variant='outline' /* onClick={() => goToCheckout('pro')} */
									>
										{'Upgrade to Pro (Placeholder)'}
									</Button>
									{/* Placeholder for Manage Subscription button */}
									{/* <Button variant="outline" onClick={() => goToPortal()}>Manage Subscription</Button> */}
									<Button
										variant='outline' /* onClick={handleProFeatureClick} */
									>
										Test Pro Feature (Placeholder)
									</Button>
								</div>
							</div>
						</div>
					</div>
				) : (
					!isPending && <p>Please log in to view account details.</p> // Show only if not loading and no data
				)}
			</div>
		</div>
	)
}

export default AccountOverview
