import { auth } from './auth'
import { authClient } from './auth-client'

export async function getJwtForSession(request: Request) {
	console.log(
		'getJwtForSession called with URL:',
		request.url,
		'Headers:',
		request.headers,
	)
	try {
		console.log('Fetching token via fetch, with credentials include')
		const response = await fetch(
			`${new URL(request.url).origin}/api/auth/token`,
			{
				headers: request.headers,
				credentials: 'include',
			},
		)

		console.log(
			'Response from token endpoint, status:',
			response.status,
			'Headers:',
			response.headers,
		)

		// Try to get JWT from header first
		const jwt = response.headers.get('set-auth-jwt')
		console.log('JWT from header:', jwt)
		if (jwt) return jwt

		// Fallback to response body
		console.log('JWT not found in header, parsing body')
		const data = await response.json()
		console.log('Parsed body data:', data)
		return data.token || null
	} catch (error) {
		console.error('Failed to get JWT:', error)
		return null
	}
}

export async function getSession(request: Request) {
	console.log('getSession called with URL:', request.url)
	try {
		console.log('Calling auth.api.getSession with headers:', request.headers)
		const session = await auth.api.getSession({
			headers: request.headers,
		})
		console.log('Session received:', session)
		return session
	} catch (error) {
		console.error('Failed to get session:', error)
		return null
	}
}

export async function getSessionAndJwt() {
	console.log('getSessionAndJwt called')
	try {
		console.log('Calling authClient.getSession')
		const { data: session } = await authClient.getSession()
		console.log('Session data from authClient:', session)
		if (!session) {
			console.log('No session available from authClient')
			return { session: null, jwt: null }
		}

		console.log('Extracting JWT from session')
		// Get JWT from session token
		const jwtToken = session.session.token
		console.log('JWT from session token:', jwtToken)
		return {
			session,
			jwt: jwtToken,
		}
	} catch (error) {
		console.error('Failed to get session:', error)
		return { session: null, jwt: null }
	}
}
