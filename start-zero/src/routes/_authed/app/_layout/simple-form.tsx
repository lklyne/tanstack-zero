import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

export const Route = createFileRoute('/_authed/app/_layout/simple-form')({
	component: SimpleForm,
})

const schema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().min(1, 'Description is required'),
})

function FieldError({ error }: { error?: string }) {
	return error ? <p className='text-red-500 text-sm mt-1'>{error}</p> : null
}

function SimpleForm() {
	const form = useForm({
		defaultValues: {
			title: '',
			description: '',
		},
		validators: {
			onChange: schema,
		},
		onSubmit: ({ value }: { value: z.infer<typeof schema> }) => {
			console.log(value)
			alert('Form submitted successfully!')
		},
	})

	return (
		<div className='flex items-center justify-center min-h-screen bg-background text-foreground p-4'>
			<div className='w-full max-w-2xl p-6 rounded-lg border bg-card text-card-foreground shadow-sm'>
				<form
					onSubmit={(e) => {
						e.preventDefault()
						e.stopPropagation()
						form.handleSubmit()
					}}
					className='space-y-6'
				>
					<form.Field
						name='title'
						children={(field) => (
							<div className='space-y-1'>
								<Label htmlFor={field.name}>Title</Label>
								<Input
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
								<FieldError error={field.state.meta.errors.join(', ')} />
							</div>
						)}
					/>

					<form.Field
						name='description'
						children={(field) => (
							<div className='space-y-1'>
								<Label htmlFor={field.name}>Description</Label>
								<Textarea
									id={field.name}
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
								<FieldError error={field.state.meta.errors.join(', ')} />
							</div>
						)}
					/>

					<div className='flex justify-end'>
						<form.Subscribe
							selector={(state) => [state.canSubmit, state.isSubmitting]}
							children={([canSubmit, isSubmitting]) => (
								<Button type='submit' disabled={!canSubmit || isSubmitting}>
									{isSubmitting ? 'Submitting...' : 'Submit'}
								</Button>
							)}
						/>
					</div>
				</form>
			</div>
		</div>
	)
}
