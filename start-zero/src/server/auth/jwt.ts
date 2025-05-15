import type { AuthData } from '@/server/db/zero-permissions'
import { decodeJwt } from 'jose'

const JWT_STORAGE_KEY = 'app-auth-jwt'
const JWT_COOKIE_NAME = 'better-auth.jwt_cache'

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
 * Store JWT in localStorage with expiration information
 * @deprecated Use cookie-based JWT instead
 */
export function storeJwt(jwt: string): void {
	if (typeof window === 'undefined') return

	try {
		// Decode to get expiration
		const payload = decodeJwt(jwt)
		const exp = payload.exp

		localStorage.setItem(
			JWT_STORAGE_KEY,
			JSON.stringify({
				token: jwt,
				exp,
			}),
		)

		console.log('JWT stored in localStorage')
	} catch (err) {
		console.error('Error storing JWT:', err)
	}
}

/**
 * Get cached JWT from localStorage if valid
 * @deprecated Use getJwtFromCookie instead
 */
export function getCachedJwt(): string | null {
	// Try cookie first
	const cookieJwt = getJwtFromCookie()
	if (cookieJwt) {
		return cookieJwt
	}

	// Fall back to localStorage
	if (typeof window === 'undefined') return null

	try {
		const stored = localStorage.getItem(JWT_STORAGE_KEY)
		if (!stored) return null

		const { token, exp } = JSON.parse(stored)

		// Check if token is expired (with 1 minute buffer)
		const now = Math.floor(Date.now() / 1000)
		if (exp && exp < now - 60) {
			console.log('Cached JWT expired, removing')
			localStorage.removeItem(JWT_STORAGE_KEY)
			return null
		}

		return token
	} catch (err) {
		console.error('Error retrieving cached JWT:', err)
		return null
	}
}

/**
 * Get cached JWT with less strict expiration check
 * This is useful right after login to prevent redirect loops
 * @deprecated Use getJwtFromCookie instead
 */
export function getCachedJwtLenient(): string | null {
	// Try cookie first
	const cookieJwt = getJwtFromCookie()
	if (cookieJwt) {
		return cookieJwt
	}

	// Fall back to localStorage
	if (typeof window === 'undefined') return null

	try {
		const stored = localStorage.getItem(JWT_STORAGE_KEY)
		if (!stored) return null

		const { token } = JSON.parse(stored)
		return token
	} catch (err) {
		console.error('Error retrieving cached JWT:', err)
		return null
	}
}

/**
 * Clear cached JWT
 */
export function clearCachedJwt(): void {
	if (typeof window === 'undefined') return
	localStorage.removeItem(JWT_STORAGE_KEY)
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
 * Get and decode the JWT token from the Better Auth cookie
 * @deprecated Use fetchAuthJwt instead
 */
export function getJwt(): AuthData | undefined {
	const token = getRawJwt()
	if (!token) return undefined

	try {
		const payload = decodeJwt(token)
		return payload as AuthData
	} catch (err) {
		console.error('Error decoding JWT:', err)
		return undefined
	}
}

/**
 * Get the raw JWT token from Better Auth's cookie
 * @deprecated Use getJwtFromCookie instead
 */
export function getRawJwt(): string | undefined {
	if (typeof document === 'undefined') return undefined
	const cookies = document.cookie.split(';')
	// Look for Better Auth's session token cookie
	const cookie = cookies.find((c) =>
		c.trim().startsWith('better-auth.session_token='),
	)
	if (!cookie) return undefined
	return cookie.split('=')[1].trim()
}

/**
 * Get the Better Auth session data cookie
 */
export function getSessionDataFromCookie(): Record<string, unknown> | null {
	const cookies = parseCookies()
	const sessionDataCookie = cookies['better-auth.session_data']

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
				// Fall through to check localStorage
			}
		}

		// Then try localStorage cache
		const cachedJwt = getCachedJwt()
		if (cachedJwt) {
			console.log('🟦 Using cached JWT from localStorage')
			try {
				const payload = decodeJwt(cachedJwt)
				return {
					jwt: cachedJwt,
					userId: payload.sub || null,
				}
			} catch (err) {
				console.error('Error with cached JWT, fetching new one:', err)
				// Fall through to fetch a new one
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
			clearCachedJwt()
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
			clearCachedJwt()
			return { jwt: null, userId: null }
		}

		// Cache the JWT for future use (deprecated)
		storeJwt(jwt)

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
 * Clear the JWT token from Better Auth's cookie
 */
export function clearJwt(): void {
	clearCachedJwt()
	if (typeof document === 'undefined') return
	document.cookie =
		'better-auth.session_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
	document.cookie =
		'better-auth.jwt_cache=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
	document.cookie =
		'better-auth.session_data=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
}

/**
 * Single utility function for getting auth with cache-first strategy
 */
export async function getAuth(fetchIfNeeded = true): Promise<AuthResult> {
	console.log('[getAuth] Checking auth status')

	// First try JWT from cookie
	const cookieJwt = getJwtFromCookie()
	if (cookieJwt) {
		const decoded = decodeAuthJwt(cookieJwt)
		if (decoded) {
			console.log('[getAuth] Found valid JWT in cookie')
			return { jwt: cookieJwt, decoded }
		}
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

	// Try cached JWT with normal checks
	const cachedJwt = getCachedJwt()
	if (cachedJwt) {
		const decoded = decodeAuthJwt(cachedJwt)
		if (decoded) {
			console.log('[getAuth] Found valid cached JWT')
			return { jwt: cachedJwt, decoded }
		}
	}

	// Next try with more lenient checks (important right after login)
	const lenientJwt = getCachedJwtLenient()
	if (lenientJwt && lenientJwt !== cachedJwt) {
		const decoded = decodeAuthJwt(lenientJwt)
		if (decoded) {
			console.log('[getAuth] Found JWT with lenient check')
			return { jwt: lenientJwt, decoded }
		}
	}

	// As a last resort, check for session cookie directly
	const rawJwt = getRawJwt()
	if (rawJwt) {
		const decoded = decodeAuthJwt(rawJwt)
		if (decoded) {
			console.log('[getAuth] Found JWT in cookie')
			// Store it for future use
			storeJwt(rawJwt)
			return { jwt: rawJwt, decoded }
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
