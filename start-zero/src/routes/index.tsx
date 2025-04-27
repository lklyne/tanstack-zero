import NavMain from '@/components/nav-main'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
	component: App,
})

const StackItem = ({
	name,
	url,
	description,
}: {
	name: string
	url: string
	description: string
}) => (
	<a
		href={url}
		target='_blank'
		rel='noopener noreferrer'
		className='flex flex-col transition-transform px-12 py-8 border border-secondary items-start -ml-[1px] first:ml-0 hover:relative hover:z-10 hover:border-secondary/80 text-pretty hover:bg-secondary/20'
	>
		<h3 className='transition-colors font-medium w-full'>{name}</h3>
		<p className='text-muted-foreground text-sm w-full '>{description}</p>
	</a>
)

const LandingPage = () => {
	const stacks = [
		{
			name: 'Zero',
			url: 'https://zero.rocicorp.dev/',
			description: 'Sync engine for instant UI updates.',
		},
		{
			name: 'Tanstack Start',
			url: 'https://tanstack.com/start/latest',
			description: 'Full stack react framework.',
		},
		{
			name: 'Better Auth',
			url: 'https://www.better-auth.com/',
			description: 'Comprehensive authentication.',
		},
		{
			name: 'Polar',
			url: 'https://polar.sh/',
			description: 'Payments and subscriptions.',
		},
	]

	return (
		<div className='size-full bg-background text-foreground relative overflow-hidden flex flex-col'>
			{/* Grid background */}
			{/* <div
				className='absolute inset-0 z-0 opacity-40'
				style={{
					backgroundImage:
						'linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)',
					backgroundSize: '8px 8px',
					backgroundPosition: '-1px -1px',
				}}
			/> */}

			{/* Main content */}
			<main className='relative z-10 flex flex-col items-center flex-1 px-4'>
				<div className='flex flex-col items-center justify-center flex-1 gap-2'>
					<h1
						className='text-xl md:text-6xl font-semibold
					 text-center mb-4 leading-normal tracking-tight'
					>
						Zero Start
					</h1>
					<p className='text-center text-muted-foreground mb-4 text-xl'>
						A starter template for fast web apps.
					</p>
					<div className='flex mt-12'>
						{stacks.map((stack) => (
							<StackItem
								key={stack.name}
								name={stack.name}
								url={stack.url}
								description={stack.description}
							/>
						))}
					</div>
				</div>
			</main>
		</div>
	)
}

export default LandingPage

function App() {
	return (
		<div className='text-center bg-background h-screen flex flex-col'>
			<NavMain />
			<main className='flex flex-col items-center justify-center h-full'>
				<LandingPage />
			</main>
		</div>
	)
}
