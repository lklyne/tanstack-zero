import AppNav from '@/components/nav-app'
import { useQuery, useZero } from '@rocicorp/zero/react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/app/_layout/$personId')({
	component: PersonComponent,
	ssr: false,
})

function PersonComponent() {
	const { personId } = Route.useParams()
	const z = useZero()
	const [persons] = useQuery(z.query.persons)
	const person = persons?.find((p) => p.id === personId)

	if (!person) {
		return <div className='p-4'>Person not found</div>
	}

	return (
		<div className='container flex flex-col h-full overflow-y-auto'>
			<AppNav
				breadcrumbs={{
					items: [
						{
							label: 'Zero Mutators',
							href: '/app',
						},
						{
							label: person.name,
						},
					],
				}}
			/>
			<div className='p-4'>
				<h1 className='text-2xl font-bold mb-4'>{person.name}</h1>
				<div className='text-sm text-muted-foreground'>ID: {person.id}</div>
			</div>
		</div>
	)
}
