
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
      products: {
        Row: {
          id: number;
          name: string;
          category_id: number;
          unit: string;
          unit_price: number;
          tax: number;
          current_quantity: number;
          threshold_quantity?: number;
          notes?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          category_id: number;
          unit: string;
          unit_price: number;
          tax: number;
          current_quantity: number;
          threshold_quantity?: number;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          category_id?: number;
          unit?: string;
          unit_price?: number;
          tax?: number;
          current_quantity?: number;
          threshold_quantity?: number;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: number;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          created_at?: string;
        };
      };
      customers: {
        Row: {
          id: number;
          first_name: string;
          last_name: string;
          phone: string;
          address: string;
          house_number: string;
          zip_code: string;
          customer_type: number;
          notes?: string;
          latitude?: number;
          longitude?: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          first_name: string;
          last_name: string;
          phone: string;
          address: string;
          house_number: string;
          zip_code: string;
          customer_type: number;
          notes?: string;
          latitude?: number;
          longitude?: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          first_name?: string;
          last_name?: string;
          phone?: string;
          address?: string;
          house_number?: string;
          zip_code?: string;
          customer_type?: number;
          notes?: string;
          latitude?: number;
          longitude?: number;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: number;
          customer_id: number;
          creation_date: string;
          requested_delivery_time: string;
          estimated_delivery_time?: string;
          delivery_notes?: string;
          status: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          customer_id: number;
          creation_date?: string;
          requested_delivery_time: string;
          estimated_delivery_time?: string;
          delivery_notes?: string;
          status: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          customer_id?: number;
          creation_date?: string;
          requested_delivery_time?: string;
          estimated_delivery_time?: string;
          delivery_notes?: string;
          status?: number;
          created_at?: string;
        };
      };
      order_items: {
        Row: {
          id: number;
          order_id: number;
          product_id: number;
          quantity: number;
          price_at_order: number;
          notes?: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          order_id: number;
          product_id: number;
          quantity: number;
          price_at_order: number;
          notes?: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          order_id?: number;
          product_id?: number;
          quantity?: number;
          price_at_order?: number;
          notes?: string;
          created_at?: string;
        };
      };
      sales: {
        Row: {
          id: number;
          datetime: string;
          product_id: number;
          quantity: number;
          total_price: number;
          order_id?: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          datetime: string;
          product_id: number;
          quantity: number;
          total_price: number;
          order_id?: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          datetime?: string;
          product_id?: number;
          quantity?: number;
          total_price?: number;
          order_id?: number;
          created_at?: string;
        };
      };
      accounting_categories: {
        Row: {
          id: number;
          name: string;
          type: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          type: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          type?: number;
          created_at?: string;
        };
      };
      accounting_records: {
        Row: {
          id: number;
          date: string;
          category_id: number;
          amount: number;
          notes?: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          date: string;
          category_id: number;
          amount: number;
          notes?: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          date?: string;
          category_id?: number;
          amount?: number;
          notes?: string;
          created_at?: string;
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
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
