import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

interface ErrorWithMessage {
  message: string;
}

interface ServerErrorPageProps {
  error: Error | ErrorWithMessage;
}

const ServerErrorPage: React.FC<ServerErrorPageProps> = ({ error }) => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className='bg-background flex flex-col justify-center items-center px-4'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <div className='flex justify-center mb-4'>
            <AlertTriangle className='h-16 w-16 text-yellow-400' />
          </div>
          <CardTitle className='text-3xl font-bold text-center'>
            Oops! Something went wrong
          </CardTitle>
          <CardDescription className='text-center'>
            We're experiencing some technical difficulties. Our team has been
            notified and is working on the issue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='bg-destructive/10 border-l-4 border-destructive text-destructive p-4 mb-6 text-left'>
            <p className='font-bold'>Error details:</p>
            <p className='text-sm'>{error.message}</p>
          </div>
        </CardContent>
        <CardFooter className='flex flex-col space-y-4'>
          <Button onClick={handleRefresh} className='w-full'>
            <RefreshCw className='mr-2 h-4 w-4' />
            Refresh Page
          </Button>
          <p className='text-muted-foreground text-sm text-center'>
            If the problem persists, please contact support.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export { ServerErrorPage };
