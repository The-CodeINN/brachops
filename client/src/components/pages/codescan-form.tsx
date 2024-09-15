import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const codeQualityScanFormSchema = z.object({
  projectName: z.string().min(1, 'Project name is required'),
  githubUrl: z.string().url('Invalid GitHub URL'),
  csprojLocation: z.string().min(1, 'Csproj file location is required'),
});

type CodeQualityScanFormValues = z.infer<typeof codeQualityScanFormSchema>;

interface CodeQualityScanFormProps {
  onSubmit: (data: CodeQualityScanFormValues) => void;
}

const CodeQualityScanForm: React.FC<CodeQualityScanFormProps> = ({
  onSubmit,
}) => {
  const form = useForm<CodeQualityScanFormValues>({
    resolver: zodResolver(codeQualityScanFormSchema),
    defaultValues: {
      projectName: '',
      githubUrl: '',
      csprojLocation: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='projectName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder='Enter project name' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='githubUrl'
          render={({ field }) => (
            <FormItem>
              <FormLabel>GitHub URL</FormLabel>
              <FormControl>
                <Input placeholder='Enter GitHub URL' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='csprojLocation'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Csproj File Location</FormLabel>
              <FormControl>
                <Input placeholder='Enter Csproj file location' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          className='bg-primary hover:bg-primary/90 text-primary-foreground'
        >
          Submit Code Quality Scan
        </Button>
      </form>
    </Form>
  );
};

export default CodeQualityScanForm;
