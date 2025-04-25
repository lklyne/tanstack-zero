import type { ZeroSchema } from '@/db/schema.zero'
import { authClient, signOut } from '@/lib/auth-client'
import { useQuery, useZero } from '@rocicorp/zero/react'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from './ui/button'

const AccountOverview = () => {
	const { data, isPending, error } = authClient.useSession()
	// Placeholder state for subscription loading, adapt as needed
	const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(false)
	const z = useZero<ZeroSchema>()

	const [zeroUser] = useQuery(
		z.query.users.where('id', data?.user?.id || '').one(),
	)

	console.log('zeroUser', zeroUser)

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
		<div className='space-y-6 max-w-5xl mx-auto min-h-screen'>
			<div className='pt-12 w-full'>
				<h1 className='text-2xl font-bold mb-4'>Account</h1>
				<div className='flex justify-between items-center'>
					<p className='text-muted-foreground mb-6'>
						Manage your account settings and preferences.
					</p>
					<div className='flex gap-2 justify-between flex-wrap'>
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

				{isPending && <p>Loading account data...</p>}
				{error && <p className='text-destructive'>Error: {error.message}</p>}

				{data ? (
					<div className='space-y-4'>
						{/* Profile Information - Zero DB Placeholder */}
						<div className='p-4 border rounded-md'>
							<h2 className='font-medium mb-4 px-2 py-0.5 bg-pink-50/50 text-pink-800 rounded border border-pink-200 dark:bg-pink-950/40 dark:text-pink-50 dark:border-pink-900 inline-block text-sm'>
								Zero
							</h2>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div>
									<p className='text-sm text-muted-foreground'>Name</p>
									<p>{zeroUser?.name || 'Not available'}</p>
								</div>
								<div>
									<p className='text-sm text-muted-foreground'>User ID</p>
									<p>{zeroUser?.id || 'Not available'}</p>
								</div>
								<div>
									<p className='text-sm text-muted-foreground'>Email</p>
									<p>{zeroUser?.email || 'Not available'}</p>
								</div>
								<div>
									<p className='text-sm text-muted-foreground'>Zero DB Plan</p>
									<p>{'Plan Placeholder'}</p>
								</div>
							</div>
						</div>

						{/* Account Actions - Better Auth */}
						<div className='p-4 border rounded-md space-y-4'>
							<h2 className='font-medium mb-4'>
								<span className='px-2 py-0.5 bg-blue-50/50 text-blue-800 rounded border border-blue-200 dark:bg-blue-950/40 dark:text-blue-50 dark:border-blue-900 inline-block text-sm'>
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
						</div>

						{/* Subscription - Polar Placeholder */}
						<div className='p-4 border rounded-md'>
							<div className='flex justify-between items-center mb-4'>
								<h2 className='font-medium mb-4 px-2 py-0.5 bg-green-50/50 text-green-800 rounded border border-green-200 dark:bg-green-950/40 dark:text-green-50 dark:border-green-900 text-sm'>
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
