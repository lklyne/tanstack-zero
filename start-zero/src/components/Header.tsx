import { Link } from '@tanstack/react-router'

export default function Header() {
	return (
		<header className='p-2 flex gap-2 bg-white text-black justify-between'>
			<nav className='flex flex-row'>
				<div className='px-2 font-bold'>
					<Link to='/'>Home</Link>
				</div>
				<div className='px-2 font-bold'>
					<Link to='/app'>Zero App</Link>
				</div>

				<div className='px-2 font-bold'>
					<Link to='/demo/form/simple'>Simple Form</Link>
				</div>

				<div className='px-2 font-bold'>
					<Link to='/demo/form/address'>Address Form</Link>
				</div>

				<div className='px-2 font-bold'>
					<Link to='/demo/start/server-funcs'>Start - Server Functions</Link>
				</div>
				<div className='px-2 font-bold'>
					<Link to='/auth/login'>Login</Link>
				</div>
				<div className='px-2 font-bold'>
					<Link to='/auth/signup'>Signup</Link>
				</div>
				<div className='px-2 font-bold'>
					<Link to='/auth/account'>Account</Link>
				</div>
				<div className='px-2 font-bold'>
					<Link to='/dashboard'>Dashboard</Link>
				</div>
			</nav>
		</header>
	)
}
