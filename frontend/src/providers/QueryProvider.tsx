import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { handleError } from "@/lib/errorHandler";

const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error) => handleError(error),
    },
  },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
