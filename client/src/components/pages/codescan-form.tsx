import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  //FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Define schema for Scan Code Page
const ScanCodeSchema = z.object({
  jobName: z
    .string()
    .min(2, { message: "Job name must be at least 2 characters." }),
  githubUrl: z.string().url({ message: "Enter a valid GitHub URL." }),
  csprojLocation: z
    .string()
    .min(1, { message: "CSProj location is required." }),
});

export function ScanCodeForm() {
  const form = useForm<z.infer<typeof ScanCodeSchema>>({
    resolver: zodResolver(ScanCodeSchema),
    defaultValues: {
      jobName: "",
      githubUrl: "",
      csprojLocation: "",
    },
  });

  function onSubmit(data: z.infer<typeof ScanCodeSchema>) {
    toast.success(
      `Job Name: ${data.jobName}, GitHub URL: ${data.githubUrl}, CSProj Location: ${data.csprojLocation}`
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        {/* Job Name Field */}
        <FormField
          control={form.control}
          name="jobName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter job name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* GitHub URL Field */}
        <FormField
          control={form.control}
          name="githubUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GitHub URL</FormLabel>
              <FormControl>
                <Input placeholder="Enter GitHub URL" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        {/* CSProj Location Field */}
        <FormField
          control={form.control}
          name="csprojLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CSProj Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter CSProj location" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
