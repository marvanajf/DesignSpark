import { QueryClient, QueryFunction } from "@tanstack/react-query";

/**
 * Enhanced error handling for API responses
 * Parses API errors and provides user-friendly messages
 */
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    try {
      // Try to parse JSON error response
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await res.json();
        
        // Handle structured error responses
        if (errorData.message) {
          throw new Error(errorData.message);
        } else if (errorData.error) {
          throw new Error(typeof errorData.error === 'string' ? errorData.error : 'Server error occurred');
        }
      }
      
      // Fallback to text parsing
      const text = await res.text();
      
      // For database connection errors, provide a more user-friendly message
      if (text.includes('ECONNREFUSED') || 
          text.includes('database connection') || 
          text.includes('Cannot use a pool')) {
        throw new Error("Database connection error. Please try again in a moment.");
      }
      
      // Show the text response if available, otherwise use status text
      throw new Error(text || res.statusText || `Error ${res.status}`);
    } catch (parseError) {
      // If the error is from our parse handling, rethrow it
      if (parseError instanceof Error) {
        throw parseError;
      }
      
      // Otherwise use a generic message with the status code
      throw new Error(`Request failed with status ${res.status}`);
    }
  }
}

/**
 * Enhanced API request function with timeout and retry capabilities
 */
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
  options?: {
    timeout?: number;
    retries?: number;
    debugMode?: boolean;
  }
): Promise<Response> {
  const timeout = options?.timeout || 15000; // 15 second default timeout
  const maxRetries = options?.retries || 0;
  const debugMode = options?.debugMode || false;
  
  // Debug log for authentication requests
  if (debugMode || url.includes('/api/login') || url.includes('/api/user')) {
    console.log(`API Request: ${method} ${url}`, data ? {
      params: typeof data === 'object' ? data : 'non-object data'
    } : 'No data provided');
  }
  
  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  let lastError: Error | null = null;
  let retryCount = 0;
  
  while (retryCount <= maxRetries) {
    try {
      const res = await fetch(url, {
        method,
        headers: data ? { "Content-Type": "application/json" } : {},
        body: data ? JSON.stringify(data) : undefined,
        credentials: "include",
        signal: controller.signal,
      });
      
      // Clear timeout since fetch completed
      clearTimeout(timeoutId);
      
      await throwIfResNotOk(res);
      return res;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      
      // Don't retry aborted requests (timeouts)
      if (lastError.name === 'AbortError') {
        throw new Error('Request timed out. Please try again.');
      }
      
      // Don't retry if we've reached max retries
      if (retryCount >= maxRetries) {
        throw lastError;
      }
      
      // Exponential backoff for retries
      const delay = 1000 * Math.pow(2, retryCount);
      await new Promise(resolve => setTimeout(resolve, delay));
      retryCount++;
      
      // Clear previous timeout and create a new controller for the retry
      clearTimeout(timeoutId);
      controller.abort(); // Abort any previous request
    }
  }
  
  // This should never be reached due to the throw in the loop
  throw lastError || new Error('Request failed');
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    try {
      const res = await fetch(queryKey[0] as string, {
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    } catch (error) {
      // Special handling for network failures
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Network connection error. Please check your internet connection.');
      }
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: (failureCount, error) => {
        // Only retry network or connection errors, up to 3 times
        if (error instanceof Error) {
          const isConnectionError = 
            error.message.includes('Database connection') || 
            error.message.includes('Network connection') ||
            error.message.includes('Failed to fetch');
          return isConnectionError && failureCount < 3;
        }
        return false;
      },
    },
    mutations: {
      retry: (failureCount, error) => {
        // Only retry connection errors for mutations, maximum once
        if (error instanceof Error) {
          const isConnectionError = 
            error.message.includes('Database connection') || 
            error.message.includes('connection refused') ||
            error.message.includes('ECONNREFUSED');
          return isConnectionError && failureCount < 1;
        }
        return false;
      },
    },
  },
});
