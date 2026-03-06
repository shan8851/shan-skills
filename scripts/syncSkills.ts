import { runSkillsSync } from "../lib/skills/skillsSync";

runSkillsSync().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown error";
  process.stderr.write(`[skills:sync] Failed: ${message}\n`);
  process.exitCode = 1;
});
