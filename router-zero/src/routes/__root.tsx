import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

import Header from '../components/Header'

export const Route = createRootRoute({
	component: () => (
		<>
			<Header />

			<Outlet />
			<TanStackRouterDevtools />
		</>
	),
})
