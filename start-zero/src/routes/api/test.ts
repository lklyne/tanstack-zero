import { createAPIFileRoute } from '@tanstack/react-start/api'

export const APIRoute = createAPIFileRoute('/api/test')({
	GET: async () => {
		console.log('GET request to /api/test')
		return new Response('Test route works!')
	},
})
