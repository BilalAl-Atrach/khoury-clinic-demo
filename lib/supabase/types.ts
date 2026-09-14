// Hand-written types mirroring supabase/schema.sql.
// Once the project is linked, prefer generating these with:
//   npx supabase gen types typescript --project-id <id> > lib/supabase/types.ts

export interface Database {
  public: {
    Tables: {
      clinics: {
        Row: {
          id: string;
          name: string;
          city: string;
          country: string;
          address_line: string;
          phone: string;
          whatsapp: string;
          email: string;
          hours: { day: string; hours: string }[];
          map_label: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["clinics"]["Row"]> & { name: string };
        Update: Partial<Database["public"]["Tables"]["clinics"]["Row"]>;
      };
      doctors: {
        Row: {
          id: string;
          clinic_id: string;
          name: string;
          title: string | null;
          specialty: string;
          bio: string | null;
          education: string[];
          certifications: string[];
          experience_years: number;
          specialties: string[];
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["doctors"]["Row"]> & { clinic_id: string; name: string; specialty: string };
        Update: Partial<Database["public"]["Tables"]["doctors"]["Row"]>;
      };
      services: {
        Row: {
          id: string;
          clinic_id: string;
          slug: string;
          category: "dermatology" | "aesthetic-medicine";
          name: string;
          short_description: string | null;
          description: string | null;
          benefits: string[];
          duration_minutes: number;
          price_from: number;
          faq: { question: string; answer: string }[];
          featured: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["services"]["Row"]> & {
          clinic_id: string;
          slug: string;
          category: "dermatology" | "aesthetic-medicine";
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["services"]["Row"]>;
      };
      patients: {
        Row: {
          id: string;
          clinic_id: string;
          name: string;
          phone: string;
          email: string;
          communication_status: "opted-in" | "opted-out";
          notes: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["patients"]["Row"]> & { clinic_id: string; name: string; phone: string; email: string };
        Update: Partial<Database["public"]["Tables"]["patients"]["Row"]>;
      };
      appointments: {
        Row: {
          id: string;
          clinic_id: string;
          patient_id: string;
          service_id: string;
          date: string;
          time: string;
          status: "confirmed" | "pending" | "completed" | "cancelled" | "rescheduled";
          source: "website" | "telegram" | "dashboard";
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["appointments"]["Row"]> & {
          clinic_id: string;
          patient_id: string;
          service_id: string;
          date: string;
          time: string;
        };
        Update: Partial<Database["public"]["Tables"]["appointments"]["Row"]>;
      };
      appointment_events: {
        Row: {
          id: string;
          appointment_id: string;
          action: string;
          note: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["appointment_events"]["Row"]> & { appointment_id: string; action: string };
        Update: Partial<Database["public"]["Tables"]["appointment_events"]["Row"]>;
      };
      follow_ups: {
        Row: {
          id: string;
          clinic_id: string;
          patient_id: string;
          appointment_id: string | null;
          treatment: string | null;
          last_visit: string | null;
          due_date: string;
          status: "upcoming" | "due" | "overdue" | "completed";
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["follow_ups"]["Row"]> & { clinic_id: string; patient_id: string; due_date: string };
        Update: Partial<Database["public"]["Tables"]["follow_ups"]["Row"]>;
      };
      messages: {
        Row: {
          id: string;
          clinic_id: string;
          appointment_id: string | null;
          patient_id: string | null;
          channel: "whatsapp" | "telegram";
          direction: "outbound" | "inbound";
          kind: string;
          body: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["messages"]["Row"]> & { clinic_id: string; channel: "whatsapp" | "telegram"; kind: string; body: string };
        Update: Partial<Database["public"]["Tables"]["messages"]["Row"]>;
      };
      automation_rules: {
        Row: {
          id: string;
          clinic_id: string;
          name: string;
          trigger_description: string;
          action_description: string;
          timing: string | null;
          enabled: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["automation_rules"]["Row"]> & {
          clinic_id: string;
          name: string;
          trigger_description: string;
          action_description: string;
        };
        Update: Partial<Database["public"]["Tables"]["automation_rules"]["Row"]>;
      };
      testimonials: {
        Row: {
          id: string;
          clinic_id: string;
          patient_name: string;
          service_id: string | null;
          rating: number;
          quote: string;
          is_demo: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["testimonials"]["Row"]> & { clinic_id: string; patient_name: string; rating: number; quote: string };
        Update: Partial<Database["public"]["Tables"]["testimonials"]["Row"]>;
      };
      gallery_items: {
        Row: {
          id: string;
          clinic_id: string;
          category: "clinic" | "skin-treatments" | "aesthetic" | "environment";
          title: string;
          image_url: string | null;
          accent: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["gallery_items"]["Row"]> & {
          clinic_id: string;
          category: "clinic" | "skin-treatments" | "aesthetic" | "environment";
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["gallery_items"]["Row"]>;
      };
      website_settings: {
        Row: {
          clinic_id: string;
          show_testimonials: boolean;
          show_gallery: boolean;
          enable_arabic: boolean;
          enable_french: boolean;
          enable_online_booking: boolean;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["website_settings"]["Row"]> & { clinic_id: string };
        Update: Partial<Database["public"]["Tables"]["website_settings"]["Row"]>;
      };
    };
  };
}
