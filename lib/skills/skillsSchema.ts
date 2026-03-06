import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const skillFrontmatterSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Frontmatter field `name` is required")
    .regex(slugPattern, "Frontmatter `name` must be a kebab-case slug"),
  description: z
    .string()
    .trim()
    .min(1, "Frontmatter field `description` is required"),
});

export const resourceDocumentSchema = z.object({
  id: z.string().trim().min(1),
  title: z.string().trim().min(1),
  relativePath: z.string().trim().min(1),
  markdown: z.string(),
});

export const skillSchema = z.object({
  slug: z.string().trim().min(1).regex(slugPattern),
  name: z.string().trim().min(1),
  description: z.string().trim().min(1),
  skillMarkdown: z.string(),
  resourceDocuments: z.array(resourceDocumentSchema),
});

export const generatedSkillsDataSchema = z.object({
  generatedAt: z.string().datetime(),
  source: z.object({
    owner: z.string().trim().min(1),
    repo: z.string().trim().min(1),
    branch: z.string().trim().min(1),
    skillsRootPath: z.string().trim().min(1),
  }),
  skills: z.array(skillSchema).min(1),
});

export type SkillFrontmatter = z.infer<typeof skillFrontmatterSchema>;
export type ResourceDocument = z.infer<typeof resourceDocumentSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type GeneratedSkillsData = z.infer<typeof generatedSkillsDataSchema>;
