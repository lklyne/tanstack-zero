import { auth } from '@/lib/auth'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/auth')({
  beforeLoad: () => {
    return {}
  },
  component: () => null,
  loader: async ({ context }) => {
    // This will be called on both client and server
    if (typeof context.request !== 'undefined') {
      return auth.handler(context.request)
    }
    return new Response('Not found', { status: 404 })
  },
})