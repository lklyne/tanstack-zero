import { signOut, useSession } from '@/lib/auth-client'
import { Button } from './ui/button'

export function AuthTest() {
	const { data: session, isPending } = useSession()

	return (
		<div>
			<h2>
				Auth Status:{' '}
				{isPending ? 'loading' : session ? 'authenticated' : 'unauthenticated'}
			</h2>
			<Button onClick={() => signOut()}>Sign Out</Button>
			{/* {session && <pre>{JSON.stringify(session, null, 2)}</pre>} */}
		</div>
	)
}
