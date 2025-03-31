import { useSession } from '@/lib/auth-client'

export function AuthTest() {
	const { data: session, isPending } = useSession()

	return (
		<div>
			<h2>
				Auth Status:{' '}
				{isPending ? 'loading' : session ? 'authenticated' : 'unauthenticated'}
			</h2>
			{session && <pre>{JSON.stringify(session, null, 2)}</pre>}
		</div>
	)
}
