# skelzer.github.io

Personal CV site for Miguel Luque, served at [luquematte.com](https://luquematte.com).

Built with React, Vite, Tailwind CSS v4 and [shadcn/ui](https://ui.shadcn.com) (Base UI primitives).

## Develop

```bash
npm install
npm run dev
```

- Content lives in `src/data/cv.ts`; page sections are in `src/components/site/`.
- shadcn components are in `src/components/ui/` (add more with `npx shadcn@latest add <name>`).
- The link-preview image `public/og.png` is generated from the site data: run `npm run og` (needs Google Chrome) after changing the headline or route.
- The site palette (paper / ink / signal red / go green) and dark mode are defined in `src/index.css`.

## Deploy

Pushing to `main` builds the site and publishes `dist/` via GitHub Actions
(`.github/workflows/deploy.yml`). In the repo settings, Pages → Source must be set to **GitHub Actions**.
`public/CNAME` keeps the custom domain.

## Ask my CV (agent)

`worker/` is a Cloudflare Worker served at `ask.luquematte.com` that answers visitor questions with OpenAI
(`OPENAI_MODEL` in `worker/wrangler.jsonc`). Its knowledge is built from `src/data/`, so **after changing CV
content, redeploy the worker too**:

```bash
npm run deploy:worker
```

- The API key is a Worker secret: `cd worker && npx wrangler secret put OPENAI_API_KEY`
- Guardrails: origin allowlist, 8 questions/min per IP, bounded input/output, `store: false`
- Set a monthly budget on the OpenAI project that owns the key

## Credits

Music: "Cuban Sandwich" by Kevin MacLeod (incompetech.com)
Licensed under Creative Commons: By Attribution 4.0 International (CC BY 4.0)
https://creativecommons.org/licenses/by/4.0/
