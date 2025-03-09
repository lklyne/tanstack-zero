import { Button } from '@/components/ui/button'
import { ZeroProvider, useZero } from '@/lib/zero'
import { faker } from '@faker-js/faker'
import { useQuery } from '@rocicorp/zero/react'
import { createFileRoute } from '@tanstack/react-router'
import logo from '../logo.svg'

export const Route = createFileRoute('/')({
	component: AppWrapper,
})

function AppWrapper() {
	return (
		<ZeroProvider>
			<App />
		</ZeroProvider>
	)
}

function PersonList() {
	const z = useZero()
	const [persons] = useQuery(z.query.persons)
	return (
		<pre className="text-xs text-left">{JSON.stringify(persons, null, 2)}</pre>
	)
}

function App() {
	const z = useZero()
	const [persons] = useQuery(z.query.persons)
	return (
		<>
			<div className="text-center ">
				<header className="min-h-screen flex flex-col items-center justify-center bg-[#282c34] text-white text-[calc(10px+2vmin)]">
					<img
						src={logo}
						className="h-[40vmin] pointer-events-none animate-[spin_20s_linear_infinite]"
						alt="logo"
					/>
					<p>
						Edit <code>src/routes/index.tsx</code> and save to reload.
					</p>
					<a
						className="text-[#61dafb] hover:underline"
						href="https://reactjs.org"
						target="_blank"
						rel="noopener noreferrer"
					>
						Learn React
					</a>
					<a
						className="text-[#61dafb] hover:underline"
						href="https://tanstack.com"
						target="_blank"
						rel="noopener noreferrer"
					>
						Learn TanStack
					</a>
					<h2>This should add a person to the zero database</h2>
					<div className="flex gap-2">
						<Button
							onClick={() => {
								z.mutate.persons.insert({
									name: faker.person.fullName(),
									id: crypto.randomUUID(),
								})
							}}
						>
							Add Person
						</Button>
						<Button
							onClick={() => {
								z.mutate.persons.delete({
									id: persons[0]?.id,
								})
							}}
						>
							Delete Person
						</Button>
					</div>

					<PersonList />
				</header>
			</div>
		</>
	)
}
