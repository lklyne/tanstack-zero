import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'
import { Binary, Check, Copy } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/')({
	component: App,
})

// Feature card component for partner/technology logos
const PartnerLogo = ({
	name,
	logo,
	url,
}: {
	name: string
	logo?: string
	url: string
}) => (
	<a
		href={url}
		target='_blank'
		rel='noopener noreferrer'
		className='flex items-center justify-center transition-transform'
	>
		{logo ? (
			<img
				src={logo}
				alt={name}
				className='h-8 opacity-80 hover:opacity-100 transition-opacity'
			/>
		) : (
			<span className=' transition-colors font-medium'>{name}</span>
		)}
	</a>
)

const LandingPage = () => {
	const [isCopied, setIsCopied] = useState(false)
	// const navigate = useNavigate()

	// Partner/technology logos
	const partners = [
		{
			name: 'Zero',
			// logo: '/logos/zero.svg',
			url: 'https://zero.rocicorp.dev/',
		},
		{
			name: 'Tanstack Start',
			// logo: '/logos/react-router.svg',
			url: 'https://reactrouter.com/',
		},
		{
			name: 'Resend',
			// logo: '/logos/resend.svg',
			url: 'https://resend.com/',
		},
		{
			name: 'Better Auth',
			// logo: '/logos/better-auth.svg',
			url: 'https://www.better-auth.com/',
		},
		{
			name: 'Polar',
			// logo: '/logos/polar.svg',
			url: 'https://polar.sh/',
		},
	]

	return (
		<div className='size-full bg-background text-foreground relative overflow-hidden flex flex-col'>
			{/* Grid background */}
			<div
				className='absolute inset-0 z-0 opacity-40'
				style={{
					backgroundImage:
						'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
					backgroundSize: '40px 40px',
					backgroundPosition: '-1px -1px',
				}}
			/>

			{/* Main content */}
			<main className='relative z-10 flex flex-col items-center flex-1 px-4 pt-0 pb-24'>
				<div className='flex flex-col items-center justify-center flex-1 gap-2'>
					{/* Logo/icon */}
					<div className='pb-24'>
						<Binary className='w-12 h-12' strokeWidth={1} />
					</div>

					{/* Pixel-style heading */}
					<h1 className='font-mono text-5xl md:text-7xl text-center mb-8 leading-tight tracking-tight'>
						Zero Start
					</h1>

					{/* Subtitle */}
					<p className='text-center text-muted-foreground mb-12 text-lg'>
						A community-created open-source starter kit based on{' '}
						<a
							href='https://zero.rocicorp.dev/'
							target='_blank'
							rel='noopener noreferrer'
							className='underline'
						>
							Zero
						</a>
						.
					</p>

					{/* Command line box */}
					<Button
						variant='ghost'
						className='bg-primary-foreground border border-neutral-700 px-10 py-6 gap-4 mb-12 font-mono text-sm flex items-center hover:border-neutral-600 hover:bg-neutral-700 hover:text-white'
						onClick={() => {
							navigator.clipboard.writeText(
								'npx degit lyleklyne/zero-start my-app',
							)
							setIsCopied(true)
							setTimeout(() => setIsCopied(false), 2000)
						}}
					>
						<span className='select-text px-2 py-2'>
							npx degit lklyne/zero-start my-app
						</span>
						{isCopied ? (
							<Check className='w-4 h-4 animate-in fade-in duration-300' />
						) : (
							<Copy className='w-4 h-4 animate-in fade-in duration-300' />
						)}
					</Button>
				</div>

				<div className='w-full max-w-6xl mb-8'>
					<p className='text-center text-uppercase text-mono text-neutral-400 mb-8 text-sm tracking-wider'>
						Featuring
					</p>
					<div className='flex flex-wrap gap-12 justify-center'>
						{partners.map((partner, index) => (
							<PartnerLogo
								key={index}
								name={partner.name}
								// logo={partner.logo}
								url={partner.url}
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
			<Header />
			<main className='flex flex-col items-center justify-center h-full'>
				<LandingPage />
			</main>
		</div>
	)
}
