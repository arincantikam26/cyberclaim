// lib/api/profile.ts
import { FaskesFormData } from '@/types/faskes';
import { User } from '@/types/user';

// Simulasi API calls
export const updateFaskes = async (data: FaskesFormData): Promise<void> => {
  // Simulasi delay API
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('Updating faskes:', data);
};

export const updateUserProfile = async (data: Partial<User>): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('Updating user profile:', data);
};

export const changePassword = async (data: {
  current_password: string;
  new_password: string;
  confirm_password: string;
}): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('Changing password:', data);
};