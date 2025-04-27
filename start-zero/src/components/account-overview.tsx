import type { ZeroSchema } from '@/db/schema.zero'
import { authClient, signOut } from '@/lib/auth-client'
import { useQuery, useZero } from '@rocicorp/zero/react'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { AccountDelete } from './account-delete'
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
		<div className='m-4'>
			{isPending && <p>Loading account data...</p>}
			{error && <p className='text-destructive'>Error: {error.message}</p>}

			{data ? (
				<div className='space-y-4'>
					<div className='flex flex-col border bg-background'>
						<div className='flex items-center gap-2 w-full justify-between px-4 border-b pb-2 pt-2'>
							<h2 className='font-semibold text-sm'>Zero Database</h2>
							<span className='px-2 py-0.5 bg-pink-50/50 text-pink-800 rounded border border-pink-200 dark:bg-pink-950/40 dark:text-pink-50 dark:border-pink-900 text-sm'>
								Zero
							</span>
						</div>
						<div className='p-4'>
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
					</div>

					<div className='flex flex-col border bg-background'>
						<div className='flex items-center gap-2 w-full justify-between px-4 border-b pb-2 pt-2'>
							<h2 className='font-semibold text-sm'>Authentication</h2>
							<span className='px-2 py-0.5 bg-blue-50/50 text-blue-800 rounded border border-blue-200 dark:bg-blue-950/40 dark:text-blue-50 dark:border-blue-900 text-sm'>
								Better Auth
							</span>
						</div>
						<div className='p-4'>
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
									<p>{data.user.emailVerified ? 'Yes' : 'No'}</p>
								</div>
							</div>
						</div>
					</div>

					<div className='flex flex-col border bg-background'>
						<div className='flex items-center gap-2 w-full justify-between px-4 border-b pb-2 pt-2'>
							<h2 className='font-semibold text-sm'>Subscription</h2>
							<span className='px-2 py-0.5 bg-green-50/50 text-green-800 rounded border border-green-200 dark:bg-green-950/40 dark:text-green-50 dark:border-green-900 text-sm'>
								Polar
							</span>
						</div>
						<div className='p-4'>
							<div className='space-y-6'>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div>
										<p className='text-sm text-muted-foreground'>
											Current Plan
										</p>
										<p className='font-medium'>{'Free (Placeholder)'}</p>
									</div>
								</div>

								<div className='flex flex-wrap gap-2'>
									<Button variant='outline' size='sm'>
										{'Upgrade to Pro (Placeholder)'}
									</Button>
									<Button variant='outline' size='sm'>
										Test Pro Feature (Placeholder)
									</Button>
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
							</div>
						</div>
					</div>

					<div className='flex flex-col border bg-background'>
						<div className='flex items-center gap-2 w-full justify-between px-4 border-b pb-2 pt-2'>
							<h2 className='font-semibold text-sm'>Danger Zone</h2>
							<span className='px-2 py-0.5 bg-red-50/50 text-red-800 rounded border border-red-200 dark:bg-red-950/40 dark:text-red-50 dark:border-red-900 text-sm'>
								Destructive Actions
							</span>
						</div>
						<div className='p-4'>
							<div className='space-y-4'>
								<p className='text-sm text-muted-foreground'>
									Deleting your account will permanently remove all your data
									from Zero and Better Auth. This action cannot be undone.
								</p>
								<div>
									<AccountDelete />
								</div>
							</div>
						</div>
					</div>
				</div>
			) : (
				!isPending && <p>Please log in to view account details.</p>
			)}
		</div>
	)
}

export default AccountOverview
