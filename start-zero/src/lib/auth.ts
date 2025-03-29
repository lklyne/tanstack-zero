import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { authDb } from "@/db/auth-db"

// Create and export the auth instance
export const auth = betterAuth({
  // Use the Drizzle adapter with our auth database
  origin: process.env.VITE_PUBLIC_SERVER,
  database: drizzleAdapter(authDb, {
    provider: "pg"
  }),
  
  // Configure basic authentication methods
  emailAndPassword: {
    enabled: true
  },
  
  // Optionally add social providers later
  // socialProviders: {
  //   github: {
  //     clientId: process.env.GITHUB_CLIENT_ID,
  //     clientSecret: process.env.GITHUB_CLIENT_SECRET,
  //   }
  // }
})