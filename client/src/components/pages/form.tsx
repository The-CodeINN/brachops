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

// Define the schema with validation for both fields
const FormSchema = z.object({
  projectName: z.string().min(2, {
    message: "Project name must be at least 2 characters.",
  }),
  imageTag: z.string().min(1, {
    message: "Image tag cannot be empty.",
  }),
});

export function InputForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      projectName: "",
      imageTag: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast.success(
      `Form submitted with Project Name: ${data.projectName} and Image Tag: ${data.imageTag}`
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="projectName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your project name" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageTag"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image Tag</FormLabel>
              <FormControl>
                <Input placeholder="Enter your image tag" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-fit" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
