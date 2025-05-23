import type { AuthData } from '@/server/db/zero-permissions'

import { getSession, useAuthSync, useSession } from '@/lib/auth-client'
import { authAtom } from '@/lib/zero-setup'
import {
	type AuthResult,
	decodeAuthJwt,
	getJwtFromCookie,
	getJwtPayloadFromCookie,
	getSessionDataFromCookie,
} from '@/server/auth/jwt'
import {
	Outlet,
	createFileRoute,
	useNavigate,
	useRouter,
} from '@tanstack/react-router'
import { useEffect, useState, useSyncExternalStore } from 'react'

export const Route = createFileRoute('/_authed')({
	component: AuthWrapper,
	// Disable SSR for this route since it uses client-only state
	ssr: false,
})

function setAuthAtom(jwt: string, decoded: AuthData) {
	if (authAtom.value?.encoded !== jwt) {
		console.log('[AuthWrapper] Setting authAtom')
		authAtom.value = { encoded: jwt, decoded }
	}
}

// Custom hook to verify auth on route changes
function useAuthVerification() {
	const navigate = useNavigate()
	const router = useRouter()
	const { checkAuth } = useAuthSync()
	// Get direct access to auth atom for immediate checks
	const auth = useSyncExternalStore(
		authAtom.onChange,
		authAtom.getSnapshot,
		authAtom.getServerSnapshot,
	)

	useEffect(() => {
		// Function to verify auth
		const verifyAuth = async () => {
			console.log('[AuthVerification] Verifying auth on route change')

			// First check if we have auth in the atom already
			if (auth?.decoded?.sub) {
				console.log(
					'[AuthVerification] Found valid auth in atom, skipping network check',
				)
				return true
			}

			// Otherwise check with the auth system
			const isAuthenticated = await checkAuth(false) // Don't force network check on route change

			if (!isAuthenticated) {
				console.log(
					'[AuthVerification] Auth invalid on route change, redirecting to login',
				)
				navigate({
					to: '/auth/login',
					search: { redirect: window.location.href },
				})
			}
		}

		// Subscribe to route changes
		const unsubscribe = router.history.subscribe(() => {
			// Only run verification if we're not already on a login/auth page
			if (!window.location.pathname.startsWith('/auth/')) {
				verifyAuth()
			}
		})

		return () => {
			unsubscribe()
		}
	}, [navigate, router.history, checkAuth, auth])
}

function AuthWrapper() {
	const navigate = useNavigate()
	const session = useSession()
	const isPending = session.isPending
	const isAuthenticated = !!session.data?.user
	const userData = session.data

	// Also check auth atom directly to avoid network dependency
	const auth = useSyncExternalStore(
		authAtom.onChange,
		authAtom.getSnapshot,
		authAtom.getServerSnapshot,
	)
	const hasValidAuthInAtom = !!auth?.decoded?.sub

	// Use the auth verification hook to check auth on route changes
	useAuthVerification()

	// First, check for auth data in cookies synchronously
	const cookieJwt = getJwtFromCookie()
	const payloadData = getJwtPayloadFromCookie()
	const sessionData = getSessionDataFromCookie()

	// Determine initial auth state from cookies
	const hasJwtCookie = !!cookieJwt
	const hasPayloadData = !!payloadData && !!cookieJwt
	const hasSessionData = sessionData?.user != null

	// We're initially authenticated if we have either JWT cookie data or session data
	const initiallyAuthenticated =
		hasJwtCookie || hasPayloadData || hasSessionData || hasValidAuthInAtom

	console.log('[AuthWrapper] Auth state:', {
		cookieAuth: hasJwtCookie || hasPayloadData || hasSessionData,
		atomAuth: hasValidAuthInAtom,
		sessionAuth: isAuthenticated,
	})

	// Set auth in atom synchronously if we have JWT or payload data from cookies
	useEffect(() => {
		// If we have a JWT cookie and payload data, set it in the auth atom synchronously
		if (cookieJwt && payloadData) {
			setAuthAtom(cookieJwt, payloadData)
		}
		// If we have a JWT cookie but no payload data, try to decode it
		else if (cookieJwt) {
			const decoded = decodeAuthJwt(cookieJwt)
			if (decoded) {
				setAuthAtom(cookieJwt, decoded)
			}
		}
	}, [cookieJwt, payloadData])

	// Set up a safety timeout to prevent infinite loading when offline
	useEffect(() => {
		let timeoutId: NodeJS.Timeout

		if (isPending && !initiallyAuthenticated) {
			timeoutId = setTimeout(() => {
				console.warn('[AuthWrapper] Auth check timed out, redirecting to login')
				navigate({
					to: '/auth/login',
					search: { redirect: window.location.href },
				})
			}, 5000)
		}

		return () => {
			if (timeoutId) clearTimeout(timeoutId)
		}
	}, [isPending, initiallyAuthenticated, navigate])

	// Check session status and update atom when online
	useEffect(() => {
		// If we already have session data, update the auth atom
		if (userData?.user) {
			// Get JWT from Better Auth if available
			getSession({
				fetchOptions: {
					onSuccess: (ctx) => {
						const jwt = ctx.response.headers.get('set-auth-jwt')
						if (jwt) {
							const decoded = decodeAuthJwt(jwt)
							if (decoded) {
								setAuthAtom(jwt, decoded)
							}
						}
					},
				},
			})
		}
		// If we're authenticated from cookies but not from Better Auth session,
		// let's keep the cookie authentication for offline usage
	}, [userData])

	// If we're still checking authentication and don't have any cached credentials
	if (isPending && !initiallyAuthenticated) {
		return null // Show loading state
	}

	// If Better Auth says we're authenticated or we have valid cookies or auth atom
	if (isAuthenticated || initiallyAuthenticated || hasValidAuthInAtom) {
		return <Outlet />
	}

	// If we're not authenticated, redirect will happen from useAuthSync
	return null
}
