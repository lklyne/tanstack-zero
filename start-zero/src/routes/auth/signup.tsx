import { SignUp } from '@/components/sign-up'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/signup')({
	component: SignUpPage,
})

function SignUpPage() {
	return (
		<div className='flex flex-col flex-grow h-full w-full items-center justify-center p-4'>
			<div className='w-full max-w-md'>
				{/* Remove the onSignUp prop */}
				<SignUp />
			</div>
		</div>
	)
}
