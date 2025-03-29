import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
	component: App,
})

function App() {
	return (
		<div className='text-center flex-grow flex flex-col'>
			<header className='flex-grow flex flex-col items-center justify-center bg-[#282c34] text-white'>
				<h1 className='text-4xl font-semibold font-mono'>hello zero</h1>
			</header>
		</div>
	)
}
