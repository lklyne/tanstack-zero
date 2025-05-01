import { fetchAuthSession } from '@/lib/session.server'
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed')({
	loader: async ({ location }) => {
		const { session } = await fetchAuthSession()
		if (!session) {
			throw redirect({ to: '/auth/login', search: { redirect: location.href } })
		}

		console.log('🟪 Authed route loader', session)
		return { session }
	},
	component: () => <Outlet />,
})
