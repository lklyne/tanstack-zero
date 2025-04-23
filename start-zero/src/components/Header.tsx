import { Link } from '@tanstack/react-router'
import { NavUser } from './nav-user'
import { Button } from './ui/button'

interface HeaderProps {
	location?: 'homepage' | 'auth' | 'app'
}

export default function Header({ location = 'homepage' }: HeaderProps) {
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
		<nav className='w-full py-2 px-4 bg-background flex justify-between items-center border-b border-border text-sm'>
			<Link className='font-bold flex items-center gap-2' to='/'>
				{/* <Binary className='w-6 h-6' /> */}
				Zero Start
			</Link>
			<div className='flex gap-4 items-center'>
				<a
					href='https://github.com/lklyne/zero-start'
					target='_blank'
					rel='noopener noreferrer'
					className=''
				>
					Github
				</a>
				<Link to='/auth/login'>
					<Button>Login</Button>
				</Link>
			</div>
		</nav>
	)
}

const AuthPageHeader = () => {
	return (
		<nav className='w-full py-4 px-4 bg-background flex justify-between items-center border-b border-border text-sm'>
			<Link className='font-bold flex items-center gap-2' to='/'>
				{/* <Binary className='w-6 h-6' /> */}
				Zero Start
			</Link>
		</nav>
	)
}

const AppPageHeader = () => {
	return (
		<nav className='w-full py-4 px-4 bg-background flex justify-between items-center border-b border-border text-sm'>
			<Link className='font-bold flex items-center gap-2' to='/'>
				Zero App
			</Link>
			<div className='flex gap-4 items-center'>
				<NavUser />
			</div>
		</nav>
	)
}
