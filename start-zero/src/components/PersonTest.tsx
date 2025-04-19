import { Button } from '@/components/ui/button'
import { useZero } from '@/lib/zero'
import { useCallback } from 'react'

const RANDOM_NAMES = [
	'Alice',
	'Bob',
	'Charlie',
	'Diana',
	'Ethan',
	'Fiona',
	'George',
	'Hannah',
]

export function PersonTest() {
	const zero = useZero()

	const addPerson = useCallback(async () => {
		try {
			const randomName =
				RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)]
			await zero.mutate.persons.insert({
				id: crypto.randomUUID(),
				name: randomName,
			})
			console.log('✅ Added person:', randomName)
		} catch (error) {
			console.error('❌ Failed to add person:', error)
		}
	}, [zero])

	return (
		<div className='flex flex-col items-center gap-4 p-4'>
			<h2 className='text-2xl font-bold'>Test Zero Mutators</h2>
			<Button
				onClick={addPerson}
				variant='secondary'
				className='bg-purple-600 hover:bg-purple-700 text-white'
			>
				Add Random Person
			</Button>
		</div>
	)
}
