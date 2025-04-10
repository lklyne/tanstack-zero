import { Button } from '@/components/ui/button'
import { useZero } from '@/lib/zero'
import { faker } from '@faker-js/faker'
import { useQuery } from '@rocicorp/zero/react'
import { createFileRoute, useRouteContext } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/authed-app/')({
	component: RouteComponent,
	loader: async ({ context }) => {
		// Log the session from the root context
		console.log('Session in /_authed/authed-app/ loader:', context.session)
		// preload
		const z = await context.z
		z.query.persons.preload()
	},
})

function PersonList() {
	const z = useZero()
	const [persons] = useQuery(z.query.persons)
	return (
		<pre className='text-xs text-left'>{JSON.stringify(persons, null, 2)}</pre>
	)
}

function RouteComponent() {
	const z = useZero()
	const [persons] = useQuery(z.query.persons)
	const { session } = useRouteContext({ from: '__root__' })

	return (
		<div>
			Hello "/app/"!
			<div>
				<h3>Session Data:</h3>
				<pre className='text-xs text-left'>
					{JSON.stringify(session, null, 2)}
				</pre>
			</div>
			<div>
				{/* button to add and delete persons */}
				<Button
					onClick={() =>
						z.mutate.persons.insert({
							id: crypto.randomUUID(),
							name: faker.person.fullName(),
						})
					}
				>
					Add Person
				</Button>
				<Button onClick={() => z.mutate.persons.delete({ id: persons[0].id })}>
					Delete Person
				</Button>
				<PersonList />
			</div>
		</div>
	)
}
