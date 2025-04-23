import Header from '@/components/header'
import { LoginForm } from '@/components/login-form'
import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/auth/login')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className='flex flex-col flex-grow h-screen w-full items-center justify-center'>
			<Header location='auth' />
			<div className='w-full h-full flex flex-col items-center justify-center max-w-md'>
				<LoginForm />
			</div>
		</div>
	)
}
