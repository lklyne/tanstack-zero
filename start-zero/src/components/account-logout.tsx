import { signOut } from '@/lib/auth-client'
import { LogOutIcon } from 'lucide-react'
import { Button } from './ui/button'

export function AccountLogout() {
	const handleLogout = async () => {
		// signOut now handles redirection to login page for all tabs
		await signOut()
	}

	return (
		<Button variant='outline' onClick={handleLogout} size='xs' className='px-2'>
			<LogOutIcon className='h-4 w-4' />
			Log Out
		</Button>
	)
}
