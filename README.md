# Shan Skills Site

Terminal-style site for browsing the custom skills I use with coding agents.

## Live URL
- `https://skills.shan8851.com` (coming soon)

## What This Site Does
- Shows a searchable list of skills on the home page.
- Generates static skill detail pages at `/skills/[slug]`.
- Renders `SKILL.md` and markdown resources for each skill.
- Supports keyboard-first navigation and copy actions for raw markdown.

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

When filing a PR, include:
- What changed
- Why it changed
- Screenshot/GIF for UI updates
