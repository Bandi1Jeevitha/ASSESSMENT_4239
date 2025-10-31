/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

export interface DemoResponse {
  message: string;
}

export interface Experience {
  id: string;
  title: string;
  location: string;
  description: string;
  longDescription: string;
  image: string;
  price: number;
  duration: string;
  maxAge?: number;
  minAge?: number;
  availability: AvailableSlot[];
}

export interface AvailableSlot {
  date: string;
  times: string[];
}

export interface BookingRequest {
  experienceId: string;
  date: string;
  time: string;
  fullName: string;
  email: string;
  quantity: number;
  promoCode?: string;
  totalPrice: number;
}

export interface BookingResponse {
  success: boolean;
  bookingId: string;
  message: string;
}

export interface PromoValidation {
  valid: boolean;
  discount: number;
  code: string;
}
