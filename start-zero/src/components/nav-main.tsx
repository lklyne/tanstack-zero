import Logo from '@/components/logo'
import { NavUser } from '@/components/nav-user'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'

interface HeaderProps {
	location?: 'homepage' | 'auth' | 'app'
}

export default function NavMain({ location = 'homepage' }: HeaderProps) {
	return (
		<>
			{location === 'homepage' && <HomePageHeader />}
			{location === 'auth' && <AuthPageHeader />}
			{location === 'app' && <AppPageHeader />}
		</>
	)
}

const HomePageHeader = () => {
	return (
		<nav className='w-full py-4 px-4 bg-background flex justify-between items-center border-b border-border text-base h-14'>
			<Link className='font-semibold text-sm flex items-center gap-2' to='/'>
				<Logo />
				Zero Start
			</Link>
			<div className='flex gap-6 items-center text-sm'>
				<a
					href='https://github.com/lklyne/zero-start'
					target='_blank'
					rel='noopener noreferrer'
					className=''
				>
					Github
				</a>
				<Link to='/auth/login'>
					<Button size='sm' variant='outline'>
						Login
					</Button>
				</Link>
			</div>
		</nav>
	)
}

const AuthPageHeader = () => {
	return (
		<nav className='w-full py-4 px-4 bg-background flex justify-between items-center border-b border-border h-14'>
			<Link className='font-semibold text-sm flex items-center gap-2' to='/'>
				<Logo />
				Zero Start
			</Link>
		</nav>
	)
}

const AppPageHeader = () => {
	return (
		<nav className='w-full py-4 px-4 bg-background flex justify-between items-center border-b border-border text-sm h-14'>
			<Link className='font-bold flex items-center gap-2' to='/'>
				Zero App
			</Link>
			<div className='flex gap-4 items-center'>
				<NavUser />
			</div>
		</nav>
	)
}
