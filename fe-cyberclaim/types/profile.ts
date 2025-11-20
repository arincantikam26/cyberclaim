// types/profile.ts
import { Faskes } from "@/types/faskes";
import { User } from "@/types/users";

export interface ProfileFormData {
    // Data Faskes
    code: string;
    name: string;
    telp: string;
    website: string;
    address: string;
    province: string;
    city: string;
    jenis_sarana_id: number;
    operasional: boolean;
    
    // Data User
    username: string;
    full_name: string;
    email: string;
    
    // Password
    current_password?: string;
    new_password?: string;
    confirm_password?: string;
  }
  
  export interface ProfileUpdateResponse {
    success: boolean;
    message: string;
    data?: {
      faskes: Faskes;
      user: User;
    };
  }