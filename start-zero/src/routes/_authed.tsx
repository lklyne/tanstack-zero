import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed')({
	beforeLoad: ({ context, location }) => {
		if (!context.session) {
			throw redirect({
				to: '/auth/login',
				search: {
					redirect: location.href,
				},
			})
		}
	},
})
