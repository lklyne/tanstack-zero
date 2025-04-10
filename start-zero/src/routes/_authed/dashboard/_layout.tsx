import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/dashboard/_layout')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div>
			<SideNavigation />
			<Outlet />
		</div>
	)
}

function SideNavigation() {
	return (
		<div>
			<h1>Side Navigation</h1>
		</div>
	)
}
