import * as fs from 'node:fs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Route as TanstackExamplesRoute } from '@/routes/_authed/app/_layout/tanstack-examples'
import { useMutation, useQuery, useQueryClient, onlineManager } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { useEffect, useState } from 'react'

const filePath = 'count.txt'

async function readCount() {
	return Number.parseInt(
		await fs.promises.readFile(filePath, 'utf-8').catch(() => '0'),
	)
}

const getCount = createServerFn({
	method: 'GET',
}).handler(() => {
	return readCount()
})

const updateCount = createServerFn({
	method: 'POST',
	response: 'raw', // Tell TanStack we want to return a raw Response
})
	.validator((formData: FormData | unknown) => {
		if (!(formData instanceof FormData)) {
			const data = new FormData()
			data.set('addBy', '1')
			return data
		}
		return formData
	})
	.handler(async ({ data: formData }) => {
		const addBy = Number(formData.get('addBy') || '1')
		const count = await readCount()
		await fs.promises.writeFile(filePath, `${count + addBy}`)

		// Return a response that works both with JS and without JS
		return new Response('ok', {
			status: 303, // 303 See Other
			headers: {
				Location: '/_authed/app/_layout/tanstack-examples',
			},
		})
	})

// Create a loader function that we can use in the route
export const tsServerActionLoader = async () => await getCount()

// Fetch counter data using TanStack Query
const fetchCounterData = async () => {
	const data = await getCount()
	// Store in localStorage for offline use
	localStorage.setItem('tsServerAction', data.toString())
	return data
}

// Update counter data using TanStack Query
const updateCounterData = async (addBy: number) => {
	const formData = new FormData()
	formData.set('addBy', addBy.toString())
	await updateCount({ data: formData })
	return await getCount()
}

export function TsServerAction() {
	const { initialCounter, offline } = TanstackExamplesRoute.useLoaderData()
	const [addByValue, setAddByValue] = useState('1')
	const queryClient = useQueryClient()

	// Use TanStack Query to manage the counter state with offline support
	const { data: counter, isError } = useQuery({
		queryKey: ['counter'],
		queryFn: fetchCounterData,
		// Start with the initial value from the route loader
		initialData: initialCounter,
		// Don't refetch on mount if offline
		enabled: !offline && onlineManager.isOnline(),
		// Configure refetch on reconnect
		refetchOnReconnect: true,
		// Increase stale time for better offline experience
		staleTime: 1000 * 60 * 60, // 1 hour
		// Keep data cached indefinitely for offline use
		gcTime: 1000 * 60 * 60 * 24, // 24 hours
	})

	// Use TanStack Query mutation for updating the counter
	const { mutate, isPending } = useMutation({
		mutationFn: updateCounterData,
		// When mutation succeeds, update the counter query with the new value
		onSuccess: (newCount) => {
			queryClient.setQueryData(['counter'], newCount)
			localStorage.setItem('tsServerAction', newCount.toString())
		},
		// If in offline mode or network error, update optimistically
		onMutate: async (addBy) => {
			// Always cancel any outgoing refetches to avoid conflict
			await queryClient.cancelQueries({ queryKey: ['counter'] })
			// Get current counter value
			const previousCount = queryClient.getQueryData(['counter']) || 0
			// Update with optimistic value
			const newCount = (previousCount as number) + addBy
			// Update query cache
			queryClient.setQueryData(['counter'], newCount)
			// Store in localStorage for offline persistence
			localStorage.setItem('tsServerAction', newCount.toString())
			return { previousCount }
		},
		// Handle mutation errors (reverts to previous value)
		onError: (err, variables, context) => {
			if (context?.previousCount) {
				queryClient.setQueryData(['counter'], context.previousCount)
			}
			console.log('Mutation error, will retry when online', err)
		},
		// Always retry when coming back online
		retry: 3,
		retryDelay: 1000,
	})

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const addBy = Number(addByValue)
		mutate(addBy)
	}

	return (
		<div className='container'>
			<div className='flex flex-col border m-4 bg-background'>
				<div className='flex items-center gap-2 w-full justify-between px-4 border-b pb-2 pt-2'>
					<h2 className='font-semibold text-sm'>Server Action Counter</h2>
					{offline && (
						<span className='text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded'>
							Offline Mode
						</span>
					)}
				</div>
				<div className='p-4 flex flex-col gap-4'>
					<p className='text-sm'>
						This example demonstrates TanStack Query with offline support. It
						manages counter state both online and offline, with optimistic
						updates and background synchronization.
					</p>
					<p className='text-sm'>
						{isError ? (
							<span className='text-destructive'>
								Error loading data - working in offline mode
							</span>
						) : (
							<span className='text-muted-foreground'>
								Current count: {counter}
							</span>
						)}
					</p>

					<form
						action={offline ? undefined : updateCount.url}
						method={offline ? undefined : 'POST'}
						onSubmit={handleSubmit}
					>
						<div className='flex items-center gap-2'>
							<Input
								type='number'
								name='addBy'
								value={addByValue}
								onChange={(e) => setAddByValue(e.target.value)}
							/>
							<Button type='submit' size='sm' disabled={isPending}>
								Add {addByValue} to {counter}
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}
