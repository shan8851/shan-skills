# Shan Skills Site

Terminal-style site for browsing the custom skills I use with coding agents. Check it out [here](https://skills.shan8851.com)

## What This Site Does

- Shows a searchable list of skills on the home page.
- Generates static skill detail pages at `/skills/[slug]`.
- Renders `SKILL.md` and markdown resources for each skill.
- Supports keyboard-first navigation and copy actions for raw markdown.

## Skills

### CLI Tools

- **[tfl-cli](https://github.com/shan8851/tfl-cli)** — London transport: tube status, journey planning, live arrivals, disruptions, bike docks. [ClawHub](https://clawhub.ai/shan8851/tfl-cli)
- **[rail-cli](https://github.com/shan8851/rail-cli)** — UK National Rail: live departures, arrivals, station search, batch search.
- **[fuel-cli](https://github.com/shan8851/fuel-cli)** — UK fuel prices: nearby stations by postcode or coordinates, ranked by price/distance/freshness.
- **[companies-house-cli](https://github.com/shan8851/companies-house-cli)** — UK Companies House: search, profiles, officers, filings, PSC, charges, insolvency. [ClawHub](https://clawhub.ai/shan8851/companies-house-cli)
- **[parliament-cli](https://github.com/shan8851/parliament-cli)** — UK Parliament: bills, members, divisions, votes, and written questions. [ClawHub](https://clawhub.ai/shan8851/parliament-cli)

### Agent Workflows

- **agent-self-improvement** — Weekly review that analyzes dumps, memory, context, skills, and crons to suggest workflow improvements.
- **challenge-me** — Stress-test ideas, plans, and decisions through rigorous iterative pushback.
- **dump** — Capture raw user dumps into workspace-local markdown logs.
- **memory-curation** — Curate and promote memory with signal-first judgment.
- **recall** — Find context from past conversations, decisions, or discussions.
- **research-review** — Unified review/research workflow for links, repos, posts, and topics.
- **weekly-focus-brief** — Weekly focus brief from workspace dumps and memory.
- **write-a-skill** — Create or refine agent skills with clear triggers and lean structure.
- **writing-voice** — Draft and polish content in the user's authentic voice.

## Skill Content Source

Skill content lives in the separate source repo:

- `https://github.com/shan8851/agent-skills`

This site pulls from that repo's `skills/` directory at build time.

## How Content Sync Works

- `npm run skills:sync`
- Clones the `agent-skills` repo (`main` branch)
- Parses `SKILL.md` frontmatter + markdown
- Recursively ingests all `*.md` resource files under each skill
- Validates shape with `zod`
- Writes generated data to `generated/skillsData.json`

`npm run build` runs `skills:sync` automatically before Next.js build.

## Auto-Rebuild

When skills are updated in the `agent-skills` repo, this site rebuilds automatically:

1. Push to `agent-skills/skills/**` triggers `repository_dispatch`
2. This repo's `build-and-deploy` workflow runs
3. Skills are synced and the site is built
4. An empty commit triggers Vercel to deploy

Manual rebuild is also available via `workflow_dispatch`.

## Local Development

```bash
npm install
npm run skills:sync
npm run dev
```

## Build and Verification

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Contributing

PRs are welcome.

If the issue is about skill content (instructions/resources), open a PR in:

- `https://github.com/shan8851/agent-skills`

If the issue is about this website (UI/UX, rendering, keyboard nav, SEO, pipeline), open a PR in this repo.
