import Header from '@/components/Header'
import { initZero } from '@/lib/zero'
import { ZeroProvider } from '@rocicorp/zero/react'
import {
	Outlet,
	createFileRoute,
	useRouteContext,
} from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
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

	const z = use(zeroPromise)

	return (
		<ZeroProvider zero={z}>
			<Header location='app' />
			<div className='flex'>
				<aside className='w-64'>
					<nav className='flex flex-col gap-2'>
						<div className='px-2 font-bold'>
							<Link to='/app'>Authed App</Link>
						</div>
						<div className='px-2 font-bold'>
							<Link to='/demo/form/simple'>Simple Form</Link>
						</div>

						<div className='px-2 font-bold'>
							<Link to='/demo/form/address'>Address Form</Link>
						</div>

						<div className='px-2 font-bold'>
							<Link to='/demo/start/server-funcs'>
								Start - Server Functions
							</Link>
						</div>
						<div className='px-2 font-bold'>
							<Link to='/auth/login'>Login</Link>
						</div>
						<div className='px-2 font-bold'>
							<Link to='/auth/signup'>Signup</Link>
						</div>
						<div className='px-2 font-bold'>
							<Link to='/auth/account'>Account</Link>
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
