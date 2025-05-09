import type { AuthData } from '@/server/db/zero-permissions'

import { authAtom } from '@/lib/zero-setup'
import {
	type AuthResult,
	decodeAuthJwt,
	getAuth,
	getCachedJwt,
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

	// Check for cached token immediately before rendering anything
	const cachedJwt = getCachedJwt()
	const cachedDecoded = cachedJwt ? decodeAuthJwt(cachedJwt) : null

	// If we have a valid cached token, use it immediately to avoid loading state
	const [isLoading, setIsLoading] = useState(!cachedDecoded)
	const [isAuthenticated, setIsAuthenticated] = useState(!!cachedDecoded)
	const [authCheckComplete, setAuthCheckComplete] = useState(false)

	// If we have a cached token, set it in the auth atom synchronously
	if (cachedJwt && cachedDecoded && !authAtom.value) {
		setAuthAtom(cachedJwt, cachedDecoded)
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

		// If we already authenticated from cache, just verify in background
		if (isAuthenticated) {
			console.log(
				'[AuthWrapper] Already authenticated from cache, verifying in background',
			)
			getAuth(true)
				.then((auth: AuthResult) => {
					if (auth) {
						setAuthAtom(auth.jwt, auth.decoded)
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
	// and we don't have a cached token
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
