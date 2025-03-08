import tailwindcss from '@tailwindcss/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import viteTsConfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		TanStackRouterVite({ autoCodeSplitting: true, routeToken: 'layout' }),
		viteReact(),
		tailwindcss(),
		viteTsConfigPaths({ projects: ['./tsconfig.json'] }),
	],
	test: {
		globals: true,
		environment: 'jsdom',
	},
})
