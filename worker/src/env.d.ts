// Secrets (set with `wrangler secret put`) aren't in worker-configuration.d.ts.
interface Env {
  OPENAI_API_KEY: string
}
