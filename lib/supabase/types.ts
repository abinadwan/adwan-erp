export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: number;
          username: string;
          password: string;
          role: string | null;
        };
        Insert: {
          id?: number;
          username: string;
          password: string;
          role?: string | null;
        };
        Update: {
          id?: number;
          username?: string;
          password?: string;
          role?: string | null;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
