import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss(), cloudflareAnalytics()],
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
})

/** Cloudflare Web Analytics (cookieless), production builds only, so dev visits aren't tracked. */
function cloudflareAnalytics(): Plugin {
  return {
    name: 'cloudflare-web-analytics',
    apply: 'build',
    transformIndexHtml: () => [
      {
        tag: 'script',
        attrs: {
          type: 'module',
          src: 'https://static.cloudflareinsights.com/beacon.min.js',
          'data-cf-beacon': '{"token": "d4565d4f3c404bc6ade7d9d027fd0dc2"}',
        },
        injectTo: 'body',
      },
    ],
  }
}
