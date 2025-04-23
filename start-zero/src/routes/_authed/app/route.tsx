import Header from '@/components/header'
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
import { Binary, FormInput, Home, Server } from 'lucide-react'
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
			{/* <Header location='app' /> */}
			<div className='flex'>
				<aside className='w-64 bg-secondary h-screen'>
					<nav className='flex flex-col gap-2 p-2 font-medium justify-between h-full'>
						<div className='flex flex-col gap-2'>
							<div className='px-2'>
								<Link to='/app' className='flex items-center gap-2'>
									<Binary className='h-4 w-4' />
									<span>Zero</span>
								</Link>
							</div>
							<div className='px-2'>
								<Link to='/app/simple-form' className='flex items-center gap-2'>
									<FormInput className='h-4 w-4' />
									<span>Tanstack Simple Form</span>
								</Link>
							</div>

							<div className='px-2'>
								<Link
									to='/app/address-form'
									className='flex items-center gap-2'
								>
									<Home className='h-4 w-4' />
									<span>Tanstack Address Form</span>
								</Link>
							</div>

							<div className='px-2'>
								<Link
									to='/app/server-functions'
									className='flex items-center gap-2'
								>
									<Server className='h-4 w-4' />
									<span>Tanstack Server Functions</span>
								</Link>
							</div>
							{/* <div className='px-2'>
								<Link to='/auth/login'>Login</Link>
							</div>
							<div className='px-2'>
								<Link to='/auth/signup'>Signup</Link>
							</div> */}
							{/* <div className='px-2'>
								<Link to='/auth/account'>Account</Link>
							</div> */}
						</div>
						<div className='px-2'>
							<NavUser />
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
