import { z } from "zod";

const dockerTagRegex =
  /^[a-z0-9]+(?:[._-]{1,2}[a-z0-9]+)*(?:\/[a-z0-9]+(?:[._-]{1,2}[a-z0-9]+)*)*:[a-zA-Z0-9_][a-zA-Z0-9._-]{0,127}$/;

export const checkJobExistsSchema = z.object({
  params: z.object({
    jobName: z.string().min(1, "Job name is required and must be a string"),
  }),
});

export const createJobSchema = z.object({
  body: z.object({
    jobName: z.string().min(1, "Job name is required and must be a string"),
    imageName: z
      .string()
      .min(1, "Image name is required and must follow the Docker tag format")
      .regex(dockerTagRegex, "Invalid Docker tag format"),
  }),
});

export const getBuildStatusSchema = z.object({
  params: z.object({
    jobName: z.string().min(1, "Job name is required and must be a string"),
    buildNumber: z
      .string()
      .refine(
        (val) => !isNaN(parseInt(val)) && parseInt(val) > 0,
        "Build number must be a positive integer"
      ),
  }),
});

export const getBuildLogSchema = z.object({
  params: z.object({
    jobName: z.string().min(1, "Job name is required"),
    buildNumber: z
      .string()
      .refine(
        (val) => !isNaN(parseInt(val)) && parseInt(val) > 0,
        "Build number must be a positive integer"
      ),
  }),
  query: z.object({
    start: z
      .string()
      .optional()
      .refine(
        (val) => val === undefined || (!isNaN(parseInt(val)) && parseInt(val) >= 0),
        "Start must be a non-negative integer"
      ),
    type: z.enum(["text", "html"]).optional(),
    meta: z.enum(["true", "false"]).optional(),
  }),
});

export const streamBuildLogSchema = z.object({
  params: z.object({
    jobName: z.string().min(1, "Job name is required"),
    buildNumber: z
      .string()
      .refine(
        (val) => !isNaN(parseInt(val)) && parseInt(val) > 0,
        "Build number must be a positive integer"
      ),
  }),
  query: z.object({
    type: z.enum(["text", "html"]).optional(),
    delay: z
      .string()
      .optional()
      .refine(
        (val) => val === undefined || (!isNaN(parseInt(val)) && parseInt(val) > 0),
        "Delay must be a positive integer"
      ),
  }),
});

export type GetBuildLogInput = z.infer<typeof getBuildLogSchema>;
export type StreamBuildLogInput = z.infer<typeof streamBuildLogSchema>;
export type CheckJobExistsInput = z.infer<typeof checkJobExistsSchema>;
export type CreateJobInput = z.infer<typeof createJobSchema>;
export type GetBuildStatusInput = z.infer<typeof getBuildStatusSchema>;
