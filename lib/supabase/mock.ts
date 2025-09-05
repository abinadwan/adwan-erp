// Simple stub implementation of Supabase client helpers used for offline page testing.
// When Supabase environment variables are missing, next.config.js aliases
// '@supabase/ssr' to this file so that pages can render without
// an active database connection.

type QueryResponse<T = unknown> = Promise<{ data: T; error: null }>;

const createQueryBuilder = () => ({
  select: async (): QueryResponse<[]> => ({ data: [], error: null }),
  insert: async (): QueryResponse => ({ data: null, error: null }),
  update: async (): QueryResponse => ({ data: null, error: null }),
  delete: async (): QueryResponse => ({ data: null, error: null }),
});

function createStubClient() {
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      signInWithPassword: async () => ({ data: null, error: null }),
      signUp: async () => ({ data: null, error: null }),
      signOut: async () => ({ error: null }),
      resetPasswordForEmail: async () => ({ data: null, error: null }),
    },
    from: () => createQueryBuilder(),
    rpc: () => createQueryBuilder(),
    storage: {
      from: () => createQueryBuilder(),
    },
  } as Record<string, unknown>;
}

export const createServerClient = () => createStubClient();
export const createBrowserClient = () => createStubClient();
