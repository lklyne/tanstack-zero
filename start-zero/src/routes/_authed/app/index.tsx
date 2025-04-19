import { Button } from '@/components/ui/button'
import { useZero } from '@/lib/zero'
import { faker } from '@faker-js/faker'
import { useQuery } from '@rocicorp/zero/react'
import { createFileRoute, useRouteContext } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/app/')({
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
		<div className='rounded-lg bg-secondary/50 p-4 min-w-[300px]'>
			<h3 className='font-semibold mb-2'>Stored Persons:</h3>
			<pre className='text-xs text-left'>
				{JSON.stringify(persons, null, 2)}
			</pre>
		</div>
	)
}

function RouteComponent() {
	const z = useZero()
	const [persons] = useQuery(z.query.persons)
	const { session } = useRouteContext({ from: '__root__' })

	return (
		<div className='container mx-auto p-8 space-y-8'>
			<div className='rounded-lg bg-secondary/50 p-4'>
				<h3 className='font-semibold mb-2'>Session Data:</h3>
				<pre className='text-xs text-left'>
					{JSON.stringify(session, null, 2)}
				</pre>
			</div>

			<div className='flex flex-col items-center gap-4'>
				<h2 className='text-2xl font-bold'>Test Zero Mutators</h2>
				<div className='flex gap-2'>
					<Button
						onClick={() =>
							z.mutate.persons.insert({
								id: crypto.randomUUID(),
								name: faker.person.fullName(),
							})
						}
						variant='secondary'
						className='bg-purple-600 hover:bg-purple-700 text-white'
					>
						Add Random Person
					</Button>
					<Button
						onClick={() =>
							persons?.[0] && z.mutate.persons.delete({ id: persons[0].id })
						}
						variant='destructive'
					>
						Delete First Person
					</Button>
				</div>
				<PersonList />
			</div>
		</div>
	)
}
