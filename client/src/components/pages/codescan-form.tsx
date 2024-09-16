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
  jobName: z.string().min(1, 'Job name is required'),
  gitUrl: z.string().url('Invalid Git URL'),
  buildPath: z.string().min(1, 'Build path is required'),
});

export type CodeQualityScanFormValues = z.infer<
  typeof codeQualityScanFormSchema
>;

interface CodeQualityScanFormProps {
  onSubmit: (data: CodeQualityScanFormValues) => void;
  errors?: Record<string, string>;
  isLoading: boolean;
}

const CodeQualityScanForm: React.FC<CodeQualityScanFormProps> = ({
  onSubmit,
  errors,
  isLoading,
}) => {
  const form = useForm<CodeQualityScanFormValues>({
    resolver: zodResolver(codeQualityScanFormSchema),
    defaultValues: {
      jobName: '',
      gitUrl: '',
      buildPath: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <FormField
          control={form.control}
          name='jobName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Name</FormLabel>
              <FormControl>
                <Input placeholder='Enter job name' {...field} />
              </FormControl>
              <FormMessage>{errors?.jobName}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='gitUrl'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Git URL</FormLabel>
              <FormControl>
                <Input placeholder='Enter Git URL' {...field} />
              </FormControl>
              <FormMessage>{errors?.gitUrl}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='buildPath'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Build Path</FormLabel>
              <FormControl>
                <Input placeholder='Enter build path' {...field} />
              </FormControl>
              <FormMessage>{errors?.buildPath}</FormMessage>
            </FormItem>
          )}
        />
        <Button
          type='submit'
          className='bg-primary hover:bg-primary/90 text-primary-foreground'
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : 'Submit Code Quality Scan'}
        </Button>
      </form>
    </Form>
  );
};

export default CodeQualityScanForm;
