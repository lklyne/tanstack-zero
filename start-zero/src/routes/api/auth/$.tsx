import { auth } from '@/lib/auth'
import { createAPIFileRoute } from '@tanstack/react-start/api'

// This route handles all requests under /api/auth/*
export const APIRoute = createAPIFileRoute('/api/auth/$')({
	GET: ({ request }) => {
		return auth.handler(request)
	},
	POST: ({ request }) => {
		return auth.handler(request)
	},
	// Handle other methods that Better Auth might need
	PUT: ({ request }) => {
		return auth.handler(request)
	},
	DELETE: ({ request }) => {
		return auth.handler(request)
	},
	PATCH: ({ request }) => {
		return auth.handler(request)
	},
})
