import { auth } from './auth'

export async function getServerSession(request: Request) {
	console.log(
		'getServerSession called with URL:',
		request.url,
		'Headers:',
		request.headers,
	)
	try {
		console.log('Calling auth.api.getSession with headers:', request.headers)
		const session = await auth.api.getSession({
			headers: request.headers,
		})
		console.log('Session received:', session)
		if (!session) {
			console.log('No session returned')
			return { session: null, jwt: null }
		}
		console.log('Fetching JWT token from auth handler')
		// Get JWT from auth handler
		const tokenRequest = new Request(
			`${new URL(request.url).origin}/api/auth/token`,
			{
				headers: request.headers,
			},
		)
		console.log(
			'Token request details:',
			tokenRequest.method,
			tokenRequest.url,
			tokenRequest.headers,
		)
		const tokenResponse = await auth.handler(tokenRequest)
		console.log('Token response headers:', tokenResponse.headers)
		const jwt = tokenResponse.headers.get('set-auth-jwt')
		console.log('Extracted JWT:', jwt)
		return { session, jwt }
	} catch (error) {
		console.error('Failed to get server session:', error)
		return { session: null, jwt: null }
	}
}
