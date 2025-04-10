import { initZero } from '@/lib/zero'
import { ZeroProvider } from '@rocicorp/zero/react'
import {
	Outlet,
	createFileRoute,
	useRouteContext,
} from '@tanstack/react-router'
import { use } from 'react'

export const Route = createFileRoute('/_authed/authed-app')({
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
	const { z: zeroPromise } = useRouteContext({ from: '/_authed/authed-app' })
	const z = use(zeroPromise) // `use` hook is available in React 19

	return (
		<ZeroProvider zero={z}>
			<div>Put the sidebar here</div>
			<Outlet />
		</ZeroProvider>
	)
}
