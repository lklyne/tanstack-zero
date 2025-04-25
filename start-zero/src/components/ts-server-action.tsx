import * as fs from 'node:fs'
import { Route as TanstackExamplesRoute } from '@/routes/_authed/app/_layout/tanstack-examples'
import { useRouter } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

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

export function TsServerAction() {
	const { tsServerAction: state } = TanstackExamplesRoute.useLoaderData()

	return (
		<div className='p-4'>
			<form
				action={updateCount.url}
				method='POST'
				onSubmit={async (e) => {
					e.preventDefault()
					const form = e.currentTarget
					const formData = new FormData(form)
					await updateCount({ data: formData })
					// The server will handle the redirect, and the router will handle it client-side when JS is enabled
				}}
			>
				<input type='hidden' name='addBy' value='1' />
				<button
					type='submit'
					className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
				>
					Add 1 to {state}?
				</button>
			</form>
		</div>
	)
}
