import { signOut } from '@/lib/auth-client'
import { Button } from './ui/button'

export function AccountDelete() {
	const deleteUser = async () => {
		if (
			!window.confirm(
				'Are you sure you want to delete your account? This cannot be undone.',
			)
		) {
			return
		}
		console.log('Deleting user...')
		// Add actual deletion logic here, including Zero DB deletion if integrated
		signOut() // Logout after deletion attempt
	}

	return (
		<Button variant='destructive' onClick={deleteUser} size='sm'>
			Delete Account
		</Button>
	)
}
