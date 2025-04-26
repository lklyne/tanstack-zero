import AppNav from '@/components/nav-app'
import { Button } from '@/components/ui/button'
import { useZero } from '@/lib/zero'
import { faker } from '@faker-js/faker'
import { useQuery } from '@rocicorp/zero/react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/app/_layout/')({
	component: RouteComponent,
	loader: async ({ context }) => {
		// Log the session from the root context
		console.log('Session in /_authed/app-main/ loader:', context.session)
		// preload
		const z = await context.z
		if (z) {
			z.query.persons.preload()
		}
	},
})

function PersonList() {
	const z = useZero()
	const [persons] = useQuery(z.query.persons)
	return (
		<div className='rounded-lg bg-secondary/50 p-4 mx-4 min-w-[300px] border'>
			<pre className='text-xs text-left'>
				{JSON.stringify(persons, null, 2)}
			</pre>
		</div>
	)
}

function RouteComponent() {
	const z = useZero()
	const [persons] = useQuery(z.query.persons)

	return (
		<div className='container mx-auto space-y-8'>
			<AppNav title='Zero Mutations' />
			<div className='flex flex-col gap-4 py-2 border mx-4'>
				<div className='flex items-center gap-2 w-full justify-between px-4 border-b pb-2'>
					<h2 className='font-semibold'>Persons</h2>
					<div className='flex gap-2'>
						<Button
							onClick={() =>
								z.mutate.persons.insert({
									id: crypto.randomUUID(),
									name: faker.person.fullName(),
								})
							}
							variant='outline'
						>
							Add Random
						</Button>
						<Button
							onClick={() =>
								persons?.[0] && z.mutate.persons.delete({ id: persons[0].id })
							}
							variant='destructive'
							className='bg-red-50 hover:bg-red-100 text-red-900 border-red-100 hover:border-red-200 hover:text-red-950 border'
						>
							Delete First
						</Button>
					</div>
				</div>

				<PersonList />
			</div>
		</div>
	)
}
