import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 60, // 1 hour
        retry: 2, // Retry failed requests twice
        refetchOnWindowFocus: true, // Refetch on window focus
        refetchOnMount: true, // Refetch on mount
        refetchOnReconnect: true, // Refetch on reconnect
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
