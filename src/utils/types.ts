export interface Camper {
  id: number;
  name: string;
  license_plate?: string;
  price_per_day: number;
  color: string;
  description?: string;
  facilities?: string[];
  images?: string[];
  max_passengers: number;
  year?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Attribute {
  id: number;
  name: string;
  description?: string;
  price: number;
  is_active: boolean;
  created_at: string;
}

export interface Booking {
  id: number;
  camper_id: number;
  start_date: string;
  end_date: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  customer_message?: string;
  base_price: number;
  attributes_price: number;
  total_price: number;
  selected_attributes?: number[];
  status: "reserved" | "confirmed" | "cancelled";
  payment_status: "not_paid" | "partially_paid" | "paid" | "refunded";
  created_at: string;
  updated_at: string;
}

export interface Settings {
  id: number;
  charge_type: "per_day" | "per_night";
  auto_accept_bookings: boolean;
  business_name: string;
  business_email?: string;
  business_phone?: string;
  company_color: string;
  company_logo?: string;
  language: "en" | "de" | "fr" | "nl" | "es" | "pt";
  booking_page_language: "en" | "de" | "fr" | "nl" | "es" | "pt";
  minimum_booking_days: number;
  maximum_booking_days: number;
  updated_at: string;
}

export interface AvailabilityResult {
  camper: Camper;
  available: boolean;
  price: number;
}

export interface CalendarData {
  campers: Camper[];
  bookings: Booking[];
}
