import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Plus, Minus } from 'lucide-react';

const deploymentFormSchema = z.object({
  jobName: z.string().min(1, 'Job name is required'),
  projectType: z.enum(['DotNetCore', 'NodeJs']),
  imageName: z.string().min(1, 'Image name is required'),
  envVars: z
    .array(
      z.object({
        key: z.string().min(1, 'Key is required'),
        value: z.string().min(1, 'Value is required'),
      })
    )
    .min(1, 'At least one environment variable is required'),
});

export type DeploymentFormValues = z.infer<typeof deploymentFormSchema>;

interface DeploymentFormProps {
  onSubmit: (data: DeploymentFormValues) => void;
  errors?: Record<string, string>;
  isLoading: boolean;
}

const DeploymentForm: React.FC<DeploymentFormProps> = ({
  onSubmit,
  errors,
  isLoading,
}) => {
  const form = useForm<DeploymentFormValues>({
    resolver: zodResolver(deploymentFormSchema),
    defaultValues: {
      jobName: '',
      projectType: 'DotNetCore',
      imageName: '',
      envVars: [{ key: '', value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'envVars',
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
          name='projectType'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a project type' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='DotNetCore'>.NET Core</SelectItem>
                  <SelectItem value='NodeJs'>Node.js</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage>{errors?.projectType}</FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='imageName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image Name</FormLabel>
              <FormControl>
                <Input placeholder='Enter image name' {...field} />
              </FormControl>
              <FormMessage>{errors?.imageName}</FormMessage>
            </FormItem>
          )}
        />
        <div>
          <FormLabel>Environment Variables</FormLabel>
          {fields.map((field, index) => (
            <div key={field.id} className='flex items-center space-x-2 mt-2'>
              <FormField
                control={form.control}
                name={`envVars.${index}.key`}
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormControl>
                      <Input placeholder='Key' {...field} />
                    </FormControl>
                    <FormMessage>
                      {errors?.[`envVars.${index}.key`]}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`envVars.${index}.value`}
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormControl>
                      <Input placeholder='Value' {...field} />
                    </FormControl>
                    <FormMessage>
                      {errors?.[`envVars.${index}.value`]}
                    </FormMessage>
                  </FormItem>
                )}
              />
              <Button
                type='button'
                variant='outline'
                size='icon'
                onClick={() => remove(index)}
                className='flex-shrink-0'
                disabled={isLoading}
              >
                <Minus className='h-4 w-4' />
              </Button>
            </div>
          ))}
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => append({ key: '', value: '' })}
            className='mt-2'
            disabled={isLoading}
          >
            <Plus className='h-4 w-4 mr-2' />
            Add Environment Variable
          </Button>
        </div>
        <Button
          type='submit'
          className='bg-primary hover:bg-primary/90 text-primary-foreground'
          disabled={isLoading}
        >
          {isLoading ? 'Submitting...' : 'Submit Deployment Job'}
        </Button>
      </form>
    </Form>
  );
};

export default DeploymentForm;
