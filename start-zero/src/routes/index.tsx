import NavMain from '@/components/nav-main'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
	component: LandingPage,
})

function LandingPage() {
	const stacks = [
		{
			name: 'Zero',
			url: 'https://zero.rocicorp.dev/',
		},
		{
			name: 'Tanstack Start',
			url: 'https://tanstack.com/start/latest',
		},
		{
			name: 'Better Auth',
			url: 'https://www.better-auth.com/',
		},
		{
			name: 'Resend',
			url: 'https://resend.com/',
		},
		{
			name: 'Polar',
			url: 'https://polar.sh/',
		},
	]

	const values = [
		{
			title: 'Instant UI Updates',
			description:
				'Every user action reflects immediately in the interface without waiting for server responses. Changes sync seamlessly across devices and users.',
		},
		{
			title: 'Offline Interactivity',
			description:
				'Your app continues working even when connectivity drops. Users can create, edit, and interact with your application regardless of network conditions, with all changes automatically syncing when connection is restored.',
		},
		{
			title: 'Extensible Authentication',
			description:
				'Comprehensive authentication flows work out of the box with minimal setup. Easily add social providers, passwordless login, or custom authentication methods while maintaining security best practices and user data protection.',
		},
		{
			title: 'Emails & Template Authoring',
			description:
				'Send beautiful, responsive emails that reliably reach inboxes. Create and modify email templates with simple React components, preview them instantly, and track delivery metrics all within your development workflow.',
		},
		{
			title: 'Subscriptions',
			description:
				'Launch paid features quickly with built-in subscription capabilities. Handle billing, invoicing, and payment processing seamlessly while giving users a frictionless checkout experience that converts trials to paying customers.',
		},
	]

	return (
		<div className='bg-background min-h-screen flex flex-col items-center'>
			<NavMain location='homepage' />

			<main className='flex flex-col w-full'>
				<div className='bg-background text-foreground relative overflow-hidden flex flex-col'>
					<div className='relative z-10 flex flex-col max-w-prose mx-auto px-4 py-16'>
						<div className='flex flex-col gap-2'>
							<h1 className='text-xl md:text-6xl font-semibold leading-normal tracking-tight text-left'>
								Zero Start
							</h1>

							<p className='text-muted-foreground mb-2 text-xl text-left'>
								A starter template for fast web apps built with...
							</p>

							<div className='flex flex-wrap gap-x-6 gap-y-2 mt-2 mb-8 border-t border-b border-border py-4'>
								{stacks.map((stack) => (
									<StackTextLink
										key={stack.name}
										name={stack.name}
										url={stack.url}
									/>
								))}
							</div>

							<div className='flex flex-col gap-8 mb-12 w-full'>
								{values.map((value) => (
									<ValueListItem
										key={value.title}
										title={value.title}
										description={value.description}
									/>
								))}
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	)
}

function ValueListItem({
	title,
	description,
}: {
	title: string
	description: string
}) {
	return (
		<div className='flex flex-col'>
			<h3 className='font-medium text-left'>{title}</h3>
			<p className='text-muted-foreground text-left text-sm w-full text-pretty'>
				{description}
			</p>
		</div>
	)
}

function StackTextLink({
	name,
	url,
}: {
	name: string
	url: string
}) {
	return (
		<a
			href={url}
			target='_blank'
			rel='noopener noreferrer'
			className='flex items-center group'
		>
			<span className='transition-transform duration-200 font-medium will-change-transform'>
				{name}
			</span>
			<span className='opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-0 group-hover:translate-x-1 will-change-transform'>
				→
			</span>
		</a>
	)
}

// Preserved for reference
function StackLink({
	name,
	url,
}: {
	name: string
	url: string
}) {
	return (
		<a
			href={url}
			target='_blank'
			rel='noopener noreferrer'
			className='px-3 py-1 rounded-full border border-border hover:border-primary/80 hover:bg-secondary/20 transition-colors'
		>
			{name}
		</a>
	)
}

function StackListItem({
	name,
	url,
	description,
}: {
	name: string
	url: string
	description: string
}) {
	return (
		<a
			href={url}
			target='_blank'
			rel='noopener noreferrer'
			className='flex flex-col group'
		>
			<div className='flex w-full'>
				<h3 className='transition-transform duration-200 font-medium will-change-transform'>
					{name}
				</h3>
				<span className='opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-0 group-hover:translate-x-1 will-change-transform'>
					→
				</span>
			</div>
			<p className='text-muted-foreground text-left text-sm w-full text-pretty'>
				{description}
			</p>
		</a>
	)
}

function StackItem({
	name,
	url,
	description,
}: {
	name: string
	url: string
	description: string
}) {
	return (
		<a
			href={url}
			target='_blank'
			rel='noopener noreferrer'
			className='flex flex-col transition-transform lg:px-12 lg:py-8 px-6 py-4 border border-border items-start -m-[0.5px] hover:relative hover:z-10 hover:border-primary/80 text-pretty hover:bg-secondary/20 group min-w-80'
		>
			<div className='flex items-center justify-center w-full'>
				<h3 className='transition-transform duration-200 font-medium group-hover:translate-x-[-4px] will-change-transform'>
					{name}
				</h3>
				<span className='opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-0 group-hover:translate-x-1 will-change-transform'>
					→
				</span>
			</div>
			<p className='text-muted-foreground text-sm w-full text-center text-balance'>
				{description}
			</p>
		</a>
	)
}

export default LandingPage
