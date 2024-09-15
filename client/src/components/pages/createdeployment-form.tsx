import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { Plus, Minus } from 'lucide-react';

const deploymentFormSchema = z.object({
  projectName: z.string().min(1, 'Project name is required'),
  imageTag: z.string().min(1, 'Image tag is required'),
  environmentVariables: z.array(
    z.object({
      key: z.string().min(1, 'Key is required'),
      value: z.string().min(1, 'Value is required'),
    })
  ),
});

type DeploymentFormValues = z.infer<typeof deploymentFormSchema>;

interface DeploymentFormProps {
  onSubmit: (data: DeploymentFormValues) => void;
}

const DeploymentForm: React.FC<DeploymentFormProps> = ({ onSubmit }) => {
  const form = useForm<DeploymentFormValues>({
    resolver: zodResolver(deploymentFormSchema),
    defaultValues: {
      projectName: '',
      imageTag: '',
      environmentVariables: [{ key: '', value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'environmentVariables',
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
          name='imageTag'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image Tag</FormLabel>
              <FormControl>
                <Input placeholder='Enter image tag' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <FormLabel>Environment Variables</FormLabel>
          {fields.map((field, index) => (
            <div key={field.id} className='flex items-center space-x-2 mt-2'>
              <FormField
                control={form.control}
                name={`environmentVariables.${index}.key`}
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormControl>
                      <Input placeholder='Key' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`environmentVariables.${index}.value`}
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormControl>
                      <Input placeholder='Value' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type='button'
                variant='outline'
                size='icon'
                onClick={() => remove(index)}
                className='flex-shrink-0'
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
          >
            <Plus className='h-4 w-4 mr-2' />
            Add Environment Variable
          </Button>
        </div>
        <Button
          type='submit'
          className='bg-primary hover:bg-primary/90 text-primary-foreground'
        >
          Submit Deployment Job
        </Button>
      </form>
    </Form>
  );
};

export default DeploymentForm;
