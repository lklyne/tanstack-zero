import { zeroSchema } from '@/db/schema.zero'
import type { AuthData } from '@/db/schema.zero'
import { createServerMutators } from '@/mutators/server'
import { PushProcessor, connectionProvider } from '@rocicorp/zero/pg'
import { createAPIFileRoute } from '@tanstack/react-start/api'
import postgres from 'postgres'

export const APIRoute = createAPIFileRoute('/api/push')({
	POST: async ({ request }) => {
		try {
			console.log('🟨 Push endpoint received request')

			// 1) Read query params + body
			const url = new URL(request.url)
			const query = Object.fromEntries(url.searchParams.entries())
			const bodyText = await request.text()
			const body = JSON.parse(bodyText)

			console.log('🟦 Request details:', {
				url: url.toString(),
				query,
				body,
				headers: Object.fromEntries(request.headers.entries()),
			})

			// 2) Build Postgres connectionProvider
			if (!process.env.ZERO_UPSTREAM_DB) {
				throw new Error('ZERO_UPSTREAM_DB is not set')
			}

			const sql = postgres(process.env.ZERO_UPSTREAM_DB, {
				max: 1,
				ssl: false,
			})
			const provider = connectionProvider(sql)

			// 3) Instantiate PushProcessor
			const processor = new PushProcessor(zeroSchema, provider)

			// 4) Extract auth (JWT) from header or cookie
			const authHeader = request.headers.get('authorization') ?? ''
			const token = authHeader.replace(/^Bearer\s+/, '')
			const authData: AuthData = { sub: token ? parseSub(token) : null }

			console.log('🟩 Processing with auth:', {
				hasSub: !!authData.sub,
				token: token ? '(token present)' : '(no token)',
			})

			// 5) Call process()
			const result = await processor.process(
				createServerMutators(authData),
				query,
				body,
			)

			console.log('🟪 Push completed successfully:', result)

			// 6) Return JSON
			return new Response(JSON.stringify(result), {
				headers: {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'POST, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type, Authorization',
				},
			})
		} catch (error) {
			console.error('🟥 Push endpoint error:', error)
			return new Response(
				JSON.stringify({
					error: true,
					details: error instanceof Error ? error.message : 'Unknown error',
					stack: error instanceof Error ? error.stack : undefined,
				}),
				{
					status: 500,
					headers: {
						'Content-Type': 'application/json',
						'Access-Control-Allow-Origin': '*',
						'Access-Control-Allow-Methods': 'POST, OPTIONS',
						'Access-Control-Allow-Headers': 'Content-Type, Authorization',
					},
				},
			)
		}
	},
	OPTIONS: async ({ request }) => {
		// Handle CORS preflight requests
		return new Response(null, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'POST, OPTIONS',
				'Access-Control-Allow-Headers': 'Content-Type, Authorization',
			},
		})
	},
})

/** Helper – decode the `sub` from your JWT token payload */
function parseSub(jwt: string): string | null {
	try {
		const [, payload] = jwt.split('.')
		const data = JSON.parse(atob(payload))
		return data.sub ?? null
	} catch {
		return null
	}
}
