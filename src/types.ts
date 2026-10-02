export type Role = "ADMIN" | "OWNER" | string;
export type PlaceStatus = "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";
export type PlaceCategory =
  | "GENERAL"
  | "RESTAURANT"
  | "HOTEL"
  | "MUSEUM"
  | "TOURIST_ATTRACTION"
  | "SHOP";
export interface User {
  id: number;
  name: string;
  last_name?: string;
  lastName?: string;
  email: string;
  phone?: string;
  role: Role;
  enabled?: boolean;
  verified?: boolean;
}
export interface Place {
  id: number;
  owner_id?: number;
  ownerId?: number;
  owner?: {
    id?: number;
    name?: string;
    last_name?: string;
    lastName?: string;
    email?: string;
  };
  name: string;
  description?: string;
  category: PlaceCategory | string;
  address?: string;
  city?: string;
  province?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  website?: string;
  image_url?: string;
  imageUrl?: string;
  metadata?: Record<string, unknown>;
  status: PlaceStatus;
  rejection_reason?: string | null;
  rejectionReason?: string | null;
  approved_at?: string | null;
  approvedAt?: string | null;
  approved_by?: number | null;
  approvedBy?: number | null;
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
}
export interface AdminPlaceFilters {
  status?: PlaceStatus | "";
  search?: string;
}
export interface ApprovePlacePayload {
  status: "APPROVED";
}
export interface RejectPlacePayload {
  status: "REJECTED";
  rejection_reason: string;
}
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
export interface LoginResponse {
  user: User;
  token: string;
}
