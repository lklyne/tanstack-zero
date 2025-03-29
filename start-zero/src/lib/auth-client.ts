import { createAuthClient } from "better-auth/react"

// Create and export the auth client
export const authClient = createAuthClient({
  // Base URL is optional if using the same domain
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000'
})

// Export individual methods for convenience
export const { 
  signIn, 
  signUp, 
  signOut, 
  useSession 
} = authClient 