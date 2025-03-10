import { Button } from '@/components/ui/button'
import { useZero } from '@/lib/zero'
import { faker } from '@faker-js/faker'
import { useQuery } from '@rocicorp/zero/react'
import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/app/')({
	component: RouteComponent,
	loader: async ({ context }) => {
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
	return (
		<div>
			Hello "/app/"!
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
