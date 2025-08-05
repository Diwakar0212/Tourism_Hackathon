import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Client for regular operations (with RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Database types (will be auto-generated from Supabase)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string;
          created_at: string;
          updated_at: string;
          // Travel-specific fields
          travel_preferences: any;
          emergency_contacts: any;
          risk_tolerance: 'low' | 'medium' | 'high';
          travel_experience: 'beginner' | 'intermediate' | 'expert';
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          avatar_url?: string;
          created_at?: string;
          updated_at?: string;
          travel_preferences?: any;
          emergency_contacts?: any;
          risk_tolerance?: 'low' | 'medium' | 'high';
          travel_experience?: 'beginner' | 'intermediate' | 'expert';
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string;
          updated_at?: string;
          travel_preferences?: any;
          emergency_contacts?: any;
          risk_tolerance?: 'low' | 'medium' | 'high';
          travel_experience?: 'beginner' | 'intermediate' | 'expert';
        };
      };
      trips: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description?: string;
          destination: any;
          start_date: string;
          end_date: string;
          budget?: number;
          status: 'planning' | 'active' | 'completed' | 'cancelled';
          itinerary: any;
          safety_status: 'safe' | 'caution' | 'warning' | 'danger';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string;
          destination: any;
          start_date: string;
          end_date: string;
          budget?: number;
          status?: 'planning' | 'active' | 'completed' | 'cancelled';
          itinerary?: any;
          safety_status?: 'safe' | 'caution' | 'warning' | 'danger';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          destination?: any;
          start_date?: string;
          end_date?: string;
          budget?: number;
          status?: 'planning' | 'active' | 'completed' | 'cancelled';
          itinerary?: any;
          safety_status?: 'safe' | 'caution' | 'warning' | 'danger';
          updated_at?: string;
        };
      };
      experiences: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: string;
          location: any;
          price: number;
          currency: string;
          duration: number;
          max_participants: number;
          safety_rating: number;
          provider_id: string;
          images: string[];
          rating: number;
          reviews_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          category: string;
          location: any;
          price: number;
          currency: string;
          duration: number;
          max_participants: number;
          safety_rating: number;
          provider_id: string;
          images?: string[];
          rating?: number;
          reviews_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          category?: string;
          location?: any;
          price?: number;
          currency?: string;
          duration?: number;
          max_participants?: number;
          safety_rating?: number;
          provider_id?: string;
          images?: string[];
          rating?: number;
          reviews_count?: number;
          updated_at?: string;
        };
      };
      safety_alerts: {
        Row: {
          id: string;
          location: any;
          alert_type: 'weather' | 'security' | 'health' | 'transport' | 'other';
          severity: 'low' | 'medium' | 'high' | 'critical';
          title: string;
          description: string;
          source: string;
          valid_until?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          location: any;
          alert_type: 'weather' | 'security' | 'health' | 'transport' | 'other';
          severity: 'low' | 'medium' | 'high' | 'critical';
          title: string;
          description: string;
          source: string;
          valid_until?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          location?: any;
          alert_type?: 'weather' | 'security' | 'health' | 'transport' | 'other';
          severity?: 'low' | 'medium' | 'high' | 'critical';
          title?: string;
          description?: string;
          source?: string;
          valid_until?: string;
          updated_at?: string;
        };
      };
      ai_conversations: {
        Row: {
          id: string;
          user_id: string;
          assistant_type: 'safety' | 'planner' | 'cultural' | 'emergency';
          messages: any;
          context: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          assistant_type: 'safety' | 'planner' | 'cultural' | 'emergency';
          messages: any;
          context: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          assistant_type?: 'safety' | 'planner' | 'cultural' | 'emergency';
          messages?: any;
          context?: any;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export const initializeSupabase = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Supabase configuration missing. Please check environment variables.');
    return false;
  }

  console.log('🟢 Supabase client initialized successfully');
  console.log(`📍 Project URL: ${supabaseUrl}`);
  return true;
};

// Helper functions for common operations
export const supabaseHelpers = {
  // Get user by ID
  async getUser(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create or update user
  async upsertUser(userData: Database['public']['Tables']['users']['Insert']) {
    const { data, error } = await supabase
      .from('users')
      .upsert(userData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get user trips
  async getUserTrips(userId: string) {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Create trip
  async createTrip(tripData: Database['public']['Tables']['trips']['Insert']) {
    const { data, error } = await supabase
      .from('trips')
      .insert(tripData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Get experiences with filters
  async getExperiences(filters: {
    category?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    limit?: number;
    offset?: number;
  } = {}) {
    let query = supabase
      .from('experiences')
      .select('*');

    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    if (filters.location) {
      query = query.contains('location', { city: filters.location });
    }

    if (filters.minPrice) {
      query = query.gte('price', filters.minPrice);
    }

    if (filters.maxPrice) {
      query = query.lte('price', filters.maxPrice);
    }

    query = query
      .order('rating', { ascending: false })
      .limit(filters.limit || 20)
      .range(filters.offset || 0, (filters.offset || 0) + (filters.limit || 20) - 1);

    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },

  // Get safety alerts for location
  async getSafetyAlerts(location: { city?: string; country?: string }) {
    let query = supabase
      .from('safety_alerts')
      .select('*')
      .order('severity', { ascending: false })
      .order('created_at', { ascending: false });

    if (location.city) {
      query = query.contains('location', { city: location.city });
    }

    if (location.country) {
      query = query.contains('location', { country: location.country });
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data;
  },

  // Save AI conversation
  async saveAIConversation(conversationData: Database['public']['Tables']['ai_conversations']['Insert']) {
    const { data, error } = await supabase
      .from('ai_conversations')
      .insert(conversationData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Real-time subscription helper
  subscribeToTable(table: keyof Database['public']['Tables'], callback: (payload: any) => void, filter?: string) {
    const subscription = supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table, filter },
        callback
      )
      .subscribe();

    return subscription;
  }
};

export default supabase;
