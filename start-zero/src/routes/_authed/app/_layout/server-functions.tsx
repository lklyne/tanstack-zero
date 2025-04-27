import * as fs from 'node:fs'
import { Button } from '@/components/ui/button'
import { createFileRoute, useRouter } from '@tanstack/react-router'
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

const updateCount = createServerFn({ method: 'POST' })
	.validator((d: number) => d)
	.handler(async ({ data }) => {
		const count = await readCount()
		await fs.promises.writeFile(filePath, `${count + data}`)
	})

export const Route = createFileRoute('/_authed/app/_layout/server-functions')({
	component: Home,
	loader: async () => await getCount(),
})

function Home() {
	const router = useRouter()
	const state = Route.useLoaderData()

	return (
		<div className='container'>
			<div className='flex flex-col border m-4'>
				<div className='flex items-center gap-2 w-full justify-between px-4 border-b pb-2 pt-2'>
					<h2 className='font-semibold text-sm'>Server Counter</h2>
				</div>
				<div className='p-4'>
					<Button
						onClick={() => {
							updateCount({ data: 1 }).then(() => {
								router.invalidate()
							})
						}}
						size='sm'
					>
						Add 1 to {state}
					</Button>
				</div>
			</div>
		</div>
	)
}
