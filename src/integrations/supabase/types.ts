export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          created_at: string | null
          destination: string
          duration_hours: number
          guide_id: string | null
          id: string
          special_requests: string | null
          start_date: string
          status: string | null
          total_amount: number
          tour_id: string | null
          tourist_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          destination: string
          duration_hours: number
          guide_id?: string | null
          id?: string
          special_requests?: string | null
          start_date: string
          status?: string | null
          total_amount: number
          tour_id?: string | null
          tourist_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          destination?: string
          duration_hours?: number
          guide_id?: string | null
          id?: string
          special_requests?: string | null
          start_date?: string
          status?: string | null
          total_amount?: number
          tour_id?: string | null
          tourist_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      guide_interests: {
        Row: {
          counter_offer_price: number
          created_at: string | null
          guide_id: string
          id: string
          message: string | null
          request_id: string
          status: string
        }
        Insert: {
          counter_offer_price: number
          created_at?: string | null
          guide_id: string
          id?: string
          message?: string | null
          request_id: string
          status?: string
        }
        Update: {
          counter_offer_price?: number
          created_at?: string | null
          guide_id?: string
          id?: string
          message?: string | null
          request_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "guide_interests_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "tour_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      guide_profiles: {
        Row: {
          availability_status: string | null
          bio: string | null
          created_at: string | null
          experience_years: number | null
          full_name: string
          hourly_rate: number | null
          id: string
          languages: string[] | null
          location: string | null
          phone: string | null
          profile_image_url: string | null
          rating: number | null
          specializations: string[] | null
          total_reviews: number | null
          updated_at: string | null
          user_id: string
          verified: boolean | null
        }
        Insert: {
          availability_status?: string | null
          bio?: string | null
          created_at?: string | null
          experience_years?: number | null
          full_name: string
          hourly_rate?: number | null
          id?: string
          languages?: string[] | null
          location?: string | null
          phone?: string | null
          profile_image_url?: string | null
          rating?: number | null
          specializations?: string[] | null
          total_reviews?: number | null
          updated_at?: string | null
          user_id: string
          verified?: boolean | null
        }
        Update: {
          availability_status?: string | null
          bio?: string | null
          created_at?: string | null
          experience_years?: number | null
          full_name?: string
          hourly_rate?: number | null
          id?: string
          languages?: string[] | null
          location?: string | null
          phone?: string | null
          profile_image_url?: string | null
          rating?: number | null
          specializations?: string[] | null
          total_reviews?: number | null
          updated_at?: string | null
          user_id?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      kyc_verifications: {
        Row: {
          bad_habits: string | null
          citizenship_photo_url: string | null
          created_at: string | null
          date_of_birth: string
          dreams: string | null
          driver_license_photo_url: string | null
          emergency_contact_name: string
          emergency_contact_phone: string
          emergency_contact_relation: string
          experience_description: string
          full_government_name: string
          gender: string
          guide_profile_id: string
          hobbies: string | null
          id: string
          languages: string[]
          live_photo_url: string | null
          nid_photo_url: string | null
          permanent_address: string
          personality_type: string | null
          profession: string
          qualification: string
          services_provided: string
          updated_at: string | null
          user_id: string
          verification_notes: string | null
          verification_status: string
          verified_at: string | null
          verified_by: string | null
          why_choose_you: string | null
        }
        Insert: {
          bad_habits?: string | null
          citizenship_photo_url?: string | null
          created_at?: string | null
          date_of_birth: string
          dreams?: string | null
          driver_license_photo_url?: string | null
          emergency_contact_name: string
          emergency_contact_phone: string
          emergency_contact_relation: string
          experience_description: string
          full_government_name: string
          gender: string
          guide_profile_id: string
          hobbies?: string | null
          id?: string
          languages?: string[]
          live_photo_url?: string | null
          nid_photo_url?: string | null
          permanent_address: string
          personality_type?: string | null
          profession: string
          qualification: string
          services_provided: string
          updated_at?: string | null
          user_id: string
          verification_notes?: string | null
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
          why_choose_you?: string | null
        }
        Update: {
          bad_habits?: string | null
          citizenship_photo_url?: string | null
          created_at?: string | null
          date_of_birth?: string
          dreams?: string | null
          driver_license_photo_url?: string | null
          emergency_contact_name?: string
          emergency_contact_phone?: string
          emergency_contact_relation?: string
          experience_description?: string
          full_government_name?: string
          gender?: string
          guide_profile_id?: string
          hobbies?: string | null
          id?: string
          languages?: string[]
          live_photo_url?: string | null
          nid_photo_url?: string | null
          permanent_address?: string
          personality_type?: string | null
          profession?: string
          qualification?: string
          services_provided?: string
          updated_at?: string | null
          user_id?: string
          verification_notes?: string | null
          verification_status?: string
          verified_at?: string | null
          verified_by?: string | null
          why_choose_you?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kyc_verifications_guide_profile_id_fkey"
            columns: ["guide_profile_id"]
            isOneToOne: false
            referencedRelation: "guide_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_requests: {
        Row: {
          created_at: string | null
          destination: string
          id: string
          offered_price: number
          requirements: string
          selected_guide_id: string | null
          status: Database["public"]["Enums"]["request_status"]
          tourist_id: string
          tourist_location_lat: number | null
          tourist_location_lng: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          destination: string
          id?: string
          offered_price: number
          requirements: string
          selected_guide_id?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          tourist_id: string
          tourist_location_lat?: number | null
          tourist_location_lng?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          destination?: string
          id?: string
          offered_price?: number
          requirements?: string
          selected_guide_id?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          tourist_id?: string
          tourist_location_lat?: number | null
          tourist_location_lng?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tours: {
        Row: {
          created_at: string | null
          description: string
          destination: string
          duration_hours: number
          guide_id: string
          id: string
          image_url: string | null
          included_services: string[] | null
          languages: string[]
          max_group_size: number
          price_per_person: number
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          destination: string
          duration_hours: number
          guide_id: string
          id?: string
          image_url?: string | null
          included_services?: string[] | null
          languages?: string[]
          max_group_size?: number
          price_per_person: number
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          destination?: string
          duration_hours?: number
          guide_id?: string
          id?: string
          image_url?: string | null
          included_services?: string[] | null
          languages?: string[]
          max_group_size?: number
          price_per_person?: number
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tours_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "guide_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "tourist" | "guide" | "admin"
      request_status: "open" | "in_progress" | "completed" | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["tourist", "guide", "admin"],
      request_status: ["open", "in_progress", "completed", "cancelled"],
    },
  },
} as const
