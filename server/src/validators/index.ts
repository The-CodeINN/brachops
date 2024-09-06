import { z } from 'zod'; // Import zod

const dockerTagRegex = /^[a-z0-9]+(?:[._-]{1,2}[a-z0-9]+)*(?:\/[a-z0-9]+(?:[._-]{1,2}[a-z0-9]+)*)*:[a-zA-Z0-9_][a-zA-Z0-9._-]{0,127}$/;

export const checkJobExistsValidator = z.object({
    jobName: z.string().min(1, "Job name is required and must be a string"),
});

    // Define a Zod schema to validate the request body
export const triggerBuildValidator = z.object({
    jobName: z.string().min(1, "Job name is required and must be a string"),
    imageName: z.string().min(1, "Image name is required and must follow the Docker tag format")
    .regex(dockerTagRegex, "Invalid Docker tag format"),  // Validate the Docker tag format using regex
});

export const getBuildStatusValidator = z.object({
    jobName: z.string().min(1, "Job name is required and must be a string"),
    buildNumber: z.number().int().positive("Build number must be a positive integer"),
});
