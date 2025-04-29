'use client'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { signIn, signInWithGoogle } from '@/lib/auth-client'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

// Define the form schema
const formSchema = z.object({
	email: z.string().email('Please enter a valid email address'),
	password: z.string().min(2, 'Password must be at least 2 characters'),
})

export function LoginForm({
	className,
	...props
}: React.ComponentPropsWithoutRef<'div'>) {
	const navigate = useNavigate()
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			// Use the imported signIn function directly
			const { data, error } = await signIn.email({
				email: values.email,
				password: values.password,
				callbackURL: '/app',
			})

			if (data) {
				// Assuming successful login redirects or indicates success via status
				// Redirect to dashboard or home page after successful login
				// navigate({ to: '/' })
			} else {
				// Handle login failure - attempt to parse error message if available
				let errorMessage = 'Invalid email or password'
				try {
					if (error) {
						errorMessage = error.message || 'Invalid email or password'
					}
				} catch (parseError) {
					// Ignore if response body is not JSON or empty
					console.error('Error parsing login error response:', parseError)
				}
				form.setError('root', {
					message: errorMessage,
				})
			}
		} catch (error) {
			// Handle any unexpected network errors
			console.error('Login error:', error)
			form.setError('root', {
				// Provide a generic error message for unexpected issues
				message: 'An error occurred during login. Please try again.',
			})
		}
	}

	// Added async handler for Google Sign In
	const handleGoogleSignIn = async () => {
		try {
			await signInWithGoogle()
			// The signInWithGoogle function itself handles redirection or token processing.
			// You might not need to navigate manually here unless you want specific behavior
			// after returning from Google. The better-auth library should handle the session update.
		} catch (error) {
			console.error('Google Sign-In error:', error)
			// Optionally, set a form error or show a toast notification
			form.setError('root', {
				message: 'Failed to sign in with Google. Please try again.',
			})
		}
	}

	return (
		<div className={cn('flex w-full flex-col gap-6', className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle className='text-2xl'>Login</CardTitle>
					<CardDescription>
						Enter your email below to login to your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className='flex flex-col gap-6'
						>
							{/* Show form-level errors if any */}
							{form.formState.errors.root && (
								<div className='text-sm text-destructive'>
									{form.formState.errors.root.message}
								</div>
							)}

							<FormField
								control={form.control}
								name='email'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												placeholder='m@example.com'
												type='email'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='password'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input type='password' {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type='submit' className='w-full'>
								Login
							</Button>

							<div className='text-center text-sm py-4'>
								Don&apos;t have an account?{' '}
								<Link
									to='/auth/signup'
									className='underline underline-offset-4'
								>
									Sign up
								</Link>
							</div>
						</form>
					</Form>
					<Button
						variant='outline'
						className='w-full'
						onClick={handleGoogleSignIn}
						type='button'
					>
						Login with Google
					</Button>
				</CardContent>
			</Card>
		</div>
	)
}
