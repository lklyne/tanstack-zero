import type { AuthData } from '@/server/db/zero-permissions'

import { authAtom } from '@/lib/zero-setup'
import {
	type AuthResult,
	decodeAuthJwt,
	getAuth,
	getCachedJwt,
	getJwtFromCookie,
	getSessionDataFromCookie,
} from '@/server/auth/jwt'
import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/_authed')({
	component: AuthWrapper,
})

function setAuthAtom(jwt: string, decoded: AuthData) {
	if (authAtom.value?.encoded !== jwt) {
		console.log('[AuthWrapper] Setting authAtom')
		authAtom.value = { encoded: jwt, decoded }
	}
}

function AuthWrapper() {
	const navigate = useNavigate()

	// First, check for session data and JWT in cookies synchronously
	const cookieJwt = getJwtFromCookie()
	const sessionData = getSessionDataFromCookie()
	const cookieDecoded = cookieJwt ? decodeAuthJwt(cookieJwt) : null
	const hasSessionData = sessionData?.user != null

	// If we have either a valid JWT cookie or session data, use it immediately
	const [isLoading, setIsLoading] = useState(!cookieDecoded && !hasSessionData)
	const [isAuthenticated, setIsAuthenticated] = useState(
		!!cookieDecoded || hasSessionData,
	)
	const [authCheckComplete, setAuthCheckComplete] = useState(false)

	// For cookie-based JWT, set it in the auth atom synchronously
	if (cookieJwt && cookieDecoded && !authAtom.value) {
		setAuthAtom(cookieJwt, cookieDecoded)
	} else if (hasSessionData && !cookieDecoded) {
		// We have session data but no JWT - this is okay to render the app, but we need to fetch a JWT for Zero
		console.log(
			'[AuthWrapper] Found session data but no JWT, will fetch in background',
		)
	}

	useEffect(() => {
		// Set a safety timeout to prevent infinite loading on refresh
		const timeoutId = setTimeout(() => {
			if (isLoading) {
				console.warn('[AuthWrapper] Auth check timed out, redirecting to login')
				setIsLoading(false)
				navigate({
					to: '/auth/login',
					search: { redirect: window.location.href },
				})
			}
		}, 5000) // 5 second timeout

		// If we already authenticated from cookies, just verify in background
		if (isAuthenticated) {
			console.log(
				'[AuthWrapper] Already authenticated from cookies, verifying in background',
			)
			getAuth(true)
				.then((auth: AuthResult) => {
					if (auth) {
						setAuthAtom(auth.jwt, auth.decoded)
					} else {
						// If verification fails (maybe cookie is invalid), redirect to login
						console.log('[AuthWrapper] Cookie auth verification failed')
						navigate({
							to: '/auth/login',
							search: { redirect: window.location.href },
						})
						setIsAuthenticated(false)
					}
					setAuthCheckComplete(true)
				})
				.catch((err) => {
					console.warn('[AuthWrapper] Background validation error:', err)
					setAuthCheckComplete(true)
				})

			clearTimeout(timeoutId)
			return
		}

		// Otherwise we need to check auth fully
		console.log('[AuthWrapper] Running auth check')
		getAuth(true)
			.then((auth: AuthResult) => {
				if (auth) {
					console.log('[AuthWrapper] Auth validated')
					setAuthAtom(auth.jwt, auth.decoded)
					setIsAuthenticated(true)
				} else {
					console.log('[AuthWrapper] No valid auth found, redirecting')
					navigate({
						to: '/auth/login',
						search: { redirect: window.location.href },
					})
				}
				setIsLoading(false)
				setAuthCheckComplete(true)
			})
			.catch((err) => {
				console.warn('[AuthWrapper] Auth error:', err)
				navigate({
					to: '/auth/login',
					search: { redirect: window.location.href },
				})
				setIsLoading(false)
				setAuthCheckComplete(true)
			})

		return () => clearTimeout(timeoutId)
	}, [isAuthenticated, navigate, isLoading])

	// Only show loading condition while actively checking auth
	// and we don't have cookies to use
	if (isLoading) {
		// Return a loading indicator after a slight delay to avoid flicker
		return null
	}

	// If we're authenticated, render the app
	if (isAuthenticated) {
		return <Outlet />
	}

	// If auth check is complete and we're not authenticated, redirect will happen
	return null
}
