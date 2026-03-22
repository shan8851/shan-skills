import { z } from "zod";

const skillIdentifierPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const skillIdentifierSchema = z
  .string()
  .trim()
  .min(1)
  .regex(skillIdentifierPattern);

const skillCategorySchema = z.enum(["workflow", "cli-tool"]).optional();

export const skillSourceFrontmatterSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Frontmatter field `name` is required")
    .regex(
      skillIdentifierPattern,
      "Frontmatter `name` must be a kebab-case slug",
    ),
  description: z
    .string()
    .trim()
    .min(1, "Frontmatter field `description` is required"),
  category: skillCategorySchema,
  clawhubUrl: z.string().url().optional(),
});

export const skillFrontmatterSchema = skillSourceFrontmatterSchema;

export const resourceDocumentSchema = z.object({
  id: z.string().trim().min(1),
  title: z.string().trim().min(1),
  relativePath: z.string().trim().min(1),
  markdown: z.string(),
});

export const skillSchema = z.object({
  slug: skillIdentifierSchema,
  name: skillIdentifierSchema,
  description: z.string().trim().min(1),
  category: skillCategorySchema,
  clawhubUrl: z.string().url().optional(),
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

export type SkillSourceFrontmatter = z.infer<
  typeof skillSourceFrontmatterSchema
>;
export type SkillFrontmatter = SkillSourceFrontmatter;
export type ResourceDocument = z.infer<typeof resourceDocumentSchema>;
export type Skill = z.infer<typeof skillSchema>;
export type GeneratedSkillsData = z.infer<typeof generatedSkillsDataSchema>;
