import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { BugIcon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

// Helper function to decode Base64Url
function base64UrlDecode(inputStr: string): string {
	// Replace Base64Url specific characters
	let base64 = inputStr.replace(/-/g, '+').replace(/_/g, '/')
	// Pad string with '=' to make it valid Base64
	while (base64.length % 4) {
		base64 += '='
	}
	try {
		return atob(base64)
	} catch (e) {
		console.error('Base64Url decode failed:', e)
		return ''
	}
}

export function AccountDebug() {
	const [jwt, setJwt] = useState<string | null>(null)
	const [decodedPayload, setDecodedPayload] = useState<object | null>(null)
	const [isLoading, setIsLoading] = useState(false)

	const fetchToken = useCallback(async () => {
		setIsLoading(true)
		try {
			const response = await fetch('/api/auth/token')
			console.log('Response headers:', [...response.headers.entries()])

			// Prefer getting JWT from header if available
			const authJwt = response.headers.get('set-auth-jwt')
			if (authJwt) {
				console.log('Found JWT in headers:', authJwt)
				setJwt(authJwt)
			} else {
				// Fallback to response body if not in header
				const tokenData = await response.json()
				console.log('Token response data:', tokenData)
				if (tokenData.token) {
					setJwt(tokenData.token)
				} else {
					setJwt(null)
				}
			}
		} catch (err) {
			console.error('Error fetching JWT:', err)
			setJwt(null)
		} finally {
			setIsLoading(false)
		}
	}, [])

	// Decode JWT when it changes
	useEffect(() => {
		if (jwt) {
			try {
				const payloadBase64Url = jwt.split('.')[1]
				if (payloadBase64Url) {
					const decodedJson = base64UrlDecode(payloadBase64Url)
					setDecodedPayload(JSON.parse(decodedJson))
				} else {
					setDecodedPayload(null)
				}
			} catch (err) {
				console.error('Error decoding JWT payload:', err)
				setDecodedPayload({ error: 'Failed to decode payload' })
			}
		} else {
			setDecodedPayload(null)
		}
	}, [jwt])

	return (
		<Dialog
			onOpenChange={(open) => {
				if (open) {
					fetchToken()
				}
			}}
		>
			<DialogTrigger asChild>
				<Button variant='outline'>
					<BugIcon className='mr-2 h-4 w-4' />
					Debug
				</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[700px]'>
				<DialogHeader>
					<DialogTitle>Debug Account</DialogTitle>
					<DialogDescription>
						View debug information about your account including JWT details.
					</DialogDescription>
				</DialogHeader>
				<div className='space-y-4 py-4 max-h-[600px] overflow-y-auto'>
					<div className='space-y-4'>
						{jwt && (
							<div className='space-y-2'>
								<h4 className='font-medium text-sm'>Raw JWT:</h4>
								<pre className='bg-muted p-4 rounded-md overflow-auto max-h-48 text-xs'>
									{jwt}
								</pre>
							</div>
						)}

						{decodedPayload && (
							<div className='space-y-2'>
								<h4 className='font-medium text-sm'>Decoded Payload:</h4>
								<pre className='bg-muted p-4 rounded-md overflow-auto max-h-96 text-xs'>
									{JSON.stringify(decodedPayload, null, 2)}
								</pre>
							</div>
						)}
					</div>
				</div>
				<DialogFooter>
					<Button
						variant='secondary'
						type='button'
						onClick={() => fetchToken()}
					>
						Refresh Token
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
