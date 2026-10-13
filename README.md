<p align="center">
  <a href="https://jackalope.digital">
    <img src="public/icon.png" alt="Jackalope Digital logo" width="120" height="120">
  </a>
</p>

<h1 align="center">Jackalope Digital</h1>

<p align="center">
  Software, tools, and services.<br>
  <a href="https://jackalope.digital">jackalope.digital</a>
</p>

---

This is the source for [jackalope.digital](https://jackalope.digital), the studio site for
Jackalope Digital LLC. It is a small Next.js app that runs on Cloudflare Workers.

## What we make

| Product | What it does |
| --- | --- |
| [Jackalope](https://jackalope.dev) | Desktop workspace to run coding agents in parallel, keep project context, and review every change |
| [Moxie Docs](https://moxiedocs.com) | Living documentation for private GitHub repos |
| [AllMCPs](https://allmcps.com) | Model Context Protocol server directory |
| [ResumeSkip](https://resumeskip.com) | ATS resume tailor and application tracker |
| [LopeBase](https://lopebase.com) | Ops console for every SaaS product you run |

## Stack

- [Next.js](https://nextjs.org) App Router with React and TypeScript
- CSS Modules for styling, with a light, dark, and system theme toggle
- Deployed to [Cloudflare Workers](https://workers.cloudflare.com) through
  [OpenNext](https://opennext.js.org/cloudflare)
- [Bun](https://bun.sh) for packages and scripts, [Biome](https://biomejs.dev) for linting and
  formatting, [Knip](https://knip.dev) for dead code

## Running locally

You need Bun and the Node version in `.nvmrc`.

```bash
bun install
bun run dev
```

Then open [http://localhost:3000](http://localhost:3000).

| Command | Purpose |
| --- | --- |
| `bun run verify` | Typecheck, lint, and dead code check |
| `bun run build` | Production Next.js build |
| `bun run preview` | Build for Workers and serve it locally with Wrangler |
| `bun run deploy` | Build and deploy to Cloudflare |

## Project layout

```
src/app/          Pages, layout, sitemap and robots routes
  privacy/        Privacy policy
  terms/          Terms of service
public/           Logo, icons, and static assets
wrangler.jsonc    Cloudflare Worker config
```

## Contributions

This code is public so anyone can read it. We are not accepting pull requests or issues.

## Contact

Questions or ideas: [contact@jackalope.digital](mailto:contact@jackalope.digital)
