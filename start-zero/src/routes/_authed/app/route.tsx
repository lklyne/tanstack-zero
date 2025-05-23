import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { zeroAtom } from '@/lib/zero-setup'
import { authAtom } from '@/lib/zero-setup'
import { ZeroProvider } from '@rocicorp/zero/react'
import { Outlet, createFileRoute } from '@tanstack/react-router'
import { useSyncExternalStore } from 'react'
import { useEffect } from 'react'
import { Suspense } from 'react'

export const Route = createFileRoute('/_authed/app')({
	component: RouteComponent,
	ssr: false,
})

function AppContent() {
	return (
		<>
			<SidebarProvider className='flex h-screen'>
				<AppSidebar variant='inset' />
				<div className='flex-1 p-2'>
					<main className='h-full border border-border bg-background rounded flex flex-col overflow-hidden'>
						<Outlet />
					</main>
				</div>
			</SidebarProvider>
		</>
	)
}

function RouteComponent() {
	const zero = useSyncExternalStore(zeroAtom.onChange, () => zeroAtom.value)
	const auth = useSyncExternalStore(authAtom.onChange, () => authAtom.value)

	// upsert user into Zero
	useEffect(() => {
		if (!zero || !auth) return

		console.log('🔄 Upserting user into Zero')

		// Try-catch to handle any issues with user data
		try {
			zero.mutate.users.upsert({
				id: auth.decoded.sub as string,
				email: auth.decoded.email ?? '',
				name: auth.decoded.name ?? '',
			})
		} catch (err) {
			console.error('Error upserting user into Zero:', err)
			// Continue rendering the app even if user upsert fails
		}
	}, [zero, auth])

	// If Zero is not available, show a loading indicator
	if (!zero) {
		return <div className='p-4'>Loading application data...</div>
	}

	return (
		<Suspense fallback={<div className='p-4'>Loading content...</div>}>
			<ZeroProvider zero={zero}>
				<AppContent />
			</ZeroProvider>
		</Suspense>
	)
}
