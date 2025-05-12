import type { AuthData } from '@/server/db/zero-permissions'
import { decodeJwt } from 'jose'

// Consistent cookie names that match the ones in auth.ts Better Auth config
const JWT_COOKIE_NAME = 'better-auth.jwt'
const JWT_PAYLOAD_COOKIE_NAME = 'better-auth.jwt_payload'
const SESSION_DATA_COOKIE_NAME = 'better-auth.session_data'

// Define auth result type
export type AuthResult = { jwt: string; decoded: AuthData } | null

/**
 * Parse cookies from document.cookie string
 */
function parseCookies(): Record<string, string> {
	if (typeof document === 'undefined') return {}
	return document.cookie.split(';').reduce(
		(cookies, cookie) => {
			const [name, value] = cookie.trim().split('=')
			cookies[name] = decodeURIComponent(value || '')
			return cookies
		},
		{} as Record<string, string>,
	)
}

/**
 * Get JWT from cookie
 */
export function getJwtFromCookie(): string | null {
	const cookies = parseCookies()
	return cookies[JWT_COOKIE_NAME] || null
}

/**
 * Get JWT payload data from non-HttpOnly cookie
 * This is used for client-side access to payload data without exposing the full JWT
 */
export function getJwtPayloadFromCookie(): AuthData | null {
	const cookies = parseCookies()
	const payloadCookie = cookies[JWT_PAYLOAD_COOKIE_NAME]

	if (!payloadCookie) return null

	try {
		return JSON.parse(decodeURIComponent(payloadCookie)) as AuthData
	} catch (err) {
		console.error('Error parsing JWT payload cookie:', err)
		return null
	}
}

/**
 * Decode a JWT string into an AuthData object
 */
export function decodeAuthJwt(jwt: string): AuthData | undefined {
	if (!jwt) return undefined

	try {
		const payload = decodeJwt(jwt)
		return payload as AuthData
	} catch (err) {
		console.error('Error decoding JWT:', err)
		return undefined
	}
}

/**
 * Get the Better Auth session data cookie
 */
export function getSessionDataFromCookie(): Record<string, unknown> | null {
	const cookies = parseCookies()
	const sessionDataCookie = cookies[SESSION_DATA_COOKIE_NAME]

	if (!sessionDataCookie) return null

	try {
		return JSON.parse(decodeURIComponent(sessionDataCookie))
	} catch (err) {
		console.error('Error parsing session data cookie:', err)
		return null
	}
}

/**
 * Extract user ID from JWT token for Zero
 */
export function getUserIdFromJwt(jwt: string): string {
	try {
		const payload = decodeJwt(jwt)
		return payload.sub || 'guest'
	} catch (err) {
		console.error('Error decoding JWT:', err)
		return 'guest'
	}
}

/**
 * Fetch fresh JWT from Better Auth's token endpoint
 */
export async function fetchAuthJwt(): Promise<{
	jwt: string | null
	userId: string | null
}> {
	try {
		// First, try to get from cookie
		const cookieJwt = getJwtFromCookie()
		if (cookieJwt) {
			console.log('🟦 Using JWT from cookie')
			try {
				const payload = decodeJwt(cookieJwt)
				return {
					jwt: cookieJwt,
					userId: payload.sub || null,
				}
			} catch (err) {
				console.error('Error with cookie JWT, fetching new one:', err)
			}
		}

		const baseUrl = import.meta.client
			? window.location.origin
			: 'http://localhost:3000'

		const response = await fetch(`${baseUrl}/api/auth/token`, {
			credentials: 'include', // Important to include cookies
		})

		console.log('🟦 Auth token response:', {
			status: response.status,
			headers: Object.fromEntries(response.headers.entries()),
		})

		// If unauthorized, return null
		if (response.status === 401) {
			return { jwt: null, userId: null }
		}

		// Get JWT from response headers or body
		let jwt = response.headers.get('set-auth-jwt')

		// If not in headers, try to get from body
		if (!jwt) {
			const data = await response.json()
			console.log('🟦 Auth token data:', data)
			jwt = data.token
		}

		if (!jwt) {
			console.error('No JWT token found in response')
			return { jwt: null, userId: null }
		}

		// Extract user ID from JWT
		try {
			const payload = decodeJwt(jwt)
			return {
				jwt,
				userId: payload.sub || null,
			}
		} catch (err) {
			console.error('Error decoding JWT payload:', err)
			return { jwt, userId: null }
		}
	} catch (err) {
		console.error('Error fetching JWT:', err)
		return { jwt: null, userId: null }
	}
}

/**
 * Clear all auth cookies
 */
export function clearJwt(): void {
	if (typeof document === 'undefined') return
	document.cookie =
		'better-auth.session_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
	document.cookie =
		'better-auth.jwt=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
	document.cookie =
		'better-auth.jwt_payload=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
	document.cookie =
		'better-auth.session_data=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
}

/**
 * Single utility function for getting auth with cache-first strategy
 * Now using cookies exclusively
 */
export async function getAuth(fetchIfNeeded = true): Promise<AuthResult> {
	console.log('[getAuth] Checking auth status')

	// First try JWT from main cookie
	const cookieJwt = getJwtFromCookie()
	if (cookieJwt) {
		const decoded = decodeAuthJwt(cookieJwt)
		if (decoded) {
			console.log('[getAuth] Found valid JWT in cookie')
			return { jwt: cookieJwt, decoded }
		}
	}

	// Try payload cookie which is more accessible to JS
	const payloadData = getJwtPayloadFromCookie()
	if (payloadData && cookieJwt) {
		console.log('[getAuth] Found valid payload data in cookie')
		return { jwt: cookieJwt, decoded: payloadData }
	}

	// Then try session data cookie
	const sessionData = getSessionDataFromCookie()
	if (sessionData?.user) {
		console.log('[getAuth] Found session data in cookie')
		// We need to get a proper JWT for Zero, so trigger a fetch
		if (fetchIfNeeded) {
			try {
				const { jwt, userId } = await fetchAuthJwt()
				if (jwt) {
					const decoded = decodeAuthJwt(jwt)
					if (decoded) {
						console.log('[getAuth] Got JWT from fetchAuthJwt')
						return { jwt, decoded }
					}
				}
			} catch (err) {
				console.warn(
					'[getAuth] Failed to fetch JWT after finding session data',
					err,
				)
			}
		}
	}

	// Only try network if all cache checks failed and we're allowed to fetch
	if (fetchIfNeeded) {
		try {
			console.log('[getAuth] Trying network fetch')
			const { jwt, userId } = await fetchAuthJwt()
			if (jwt) {
				const decoded = decodeAuthJwt(jwt)
				if (decoded) {
					console.log('[getAuth] Got JWT from network')
					return { jwt, decoded }
				}
			}
		} catch (err) {
			console.warn('[getAuth] Failed to fetch auth JWT', err)
			// Silently fail on network errors
		}
	}

	console.log('[getAuth] No auth found')
	return null
}
