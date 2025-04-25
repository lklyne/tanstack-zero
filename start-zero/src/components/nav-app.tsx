const NavApp = ({
	title,
	children,
}: {
	title: string
	children?: React.ReactNode
}) => {
	return (
		<div className='flex justify-between items-center border-b border-gray-200 py-4 px-8 sticky top-0 bg-background'>
			<h2 className='font-medium'>{title}</h2>
			{children || <div />}
		</div>
	)
}

export default NavApp
