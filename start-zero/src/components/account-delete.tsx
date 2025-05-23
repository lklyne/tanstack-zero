import { authClient, signOut } from '@/lib/auth-client'
import { clearJwt } from '@/server/auth/jwt'
import { useState } from 'react'
import { Button } from './ui/button'

export function AccountDelete() {
	const [isDeleting, setIsDeleting] = useState(false)

	const deleteUser = async () => {
		if (
			!window.confirm(
				'Are you sure you want to delete your account? This cannot be undone.',
			)
		) {
			return
		}

		try {
			setIsDeleting(true)
			console.log('Deleting user...')

			// Call Better Auth's deleteUser method
			// This will trigger the beforeDelete hook we set up
			// which will delete the user from Zero
			await authClient.deleteUser()

			// Clear the JWT from cookies
			clearJwt()

			// Use our enhanced signOut function which will redirect all tabs to login
			await signOut()

			// No need to navigate as signOut will redirect all tabs
		} catch (error) {
			console.error('Failed to delete account:', error)
			alert('Failed to delete your account. Please try again.')
		} finally {
			setIsDeleting(false)
		}
	}

	return (
		<Button
			variant='destructive'
			onClick={deleteUser}
			size='sm'
			disabled={isDeleting}
		>
			{isDeleting ? 'Deleting...' : 'Delete Account'}
		</Button>
	)
}
