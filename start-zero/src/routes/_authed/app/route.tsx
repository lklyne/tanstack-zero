import { NavUser } from '@/components/nav-user'
import type { ZeroSchema } from '@/db/schema.zero'
import { initZero } from '@/lib/zero'
import type { Zero } from '@rocicorp/zero'
import { ZeroProvider } from '@rocicorp/zero/react'
import {
	Outlet,
	createFileRoute,
	useRouteContext,
} from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import {
	Binary,
	DatabaseZap,
	FormInput,
	Home,
	Server,
	UserIcon,
} from 'lucide-react'
import { use } from 'react'

export const Route = createFileRoute('/_authed/app')({
	component: RouteComponent,
	context: () => ({
		// Initialize the zero instance, this won't serialize the zero instance (beforeLoad will)
		z: initZero(),
	}),
	loader: async ({ context }) => {
		// We are not returning the zero instance here, but using the loader to initialize it before the component mounts
		await context.z
	},
})

function RouteComponent() {
	const { z: zeroPromise } = useRouteContext({ from: '/_authed/app' })

	if (!zeroPromise) {
		// This should ideally not happen due to the loader awaiting z
		return <div>Loading Zero...</div>
	}

	const z = use(zeroPromise) as unknown as Zero<ZeroSchema>

	return (
		<ZeroProvider zero={z}>
			<div className='flex'>
				<aside className='w-64 bg-secondary/30 h-screen sticky top-0 border-r border-secondary'>
					<nav className='flex flex-col h-full p-2'>
						{/* Header */}
						<div className='flex justify-between gap-2 mb-4 items-center'>
							<div className='px-2 py-2 flex items-center gap-2'>
								<div className='flex items-center p-1 bg-stone-900 rounded text-white'>
									<Binary className='h-4 w-4' aria-hidden={true} />
								</div>
								<h1 className='font-medium'>Demo App</h1>
							</div>
							<div className='px-2'>
								<NavUser />
							</div>
						</div>

						{/* Navigation Links */}
						<div className='flex flex-col gap-2 px-1'>
							<Link to='/app' className='px-2 flex items-center gap-2'>
								<DatabaseZap className='h-4 w-4' aria-hidden={true} />
								<span>Zero Mutations</span>
							</Link>

							<Link
								to='/app/simple-form'
								className='px-2 flex items-center gap-2'
							>
								<FormInput className='h-4 w-4' aria-hidden={true} />
								<span>Tanstack Simple Form</span>
							</Link>

							<Link
								to='/app/address-form'
								className='px-2 flex items-center gap-2'
							>
								<Home className='h-4 w-4' aria-hidden={true} />
								<span>Tanstack Address Form</span>
							</Link>

							<Link
								to='/app/server-functions'
								className='px-2 flex items-center gap-2'
							>
								<Server className='h-4 w-4' aria-hidden={true} />
								<span>Tanstack Server Functions</span>
							</Link>

							<Link to='/app/account' className='px-2 flex items-center gap-2'>
								<UserIcon className='h-4 w-4' aria-hidden={true} />
								<span>Account</span>
							</Link>
						</div>
					</nav>
				</aside>
				<main className='flex-1'>
					<Outlet />
				</main>
			</div>
		</ZeroProvider>
	)
}
