// lib/roles.ts
export type UserRole = 'superadmin' | 'admin' | 'faskes';

export const rolePermissions = {
  superadmin: {
    canManageUsers: true,
    canUploadDocuments: true,
    canValidateClaims: true,
    canAccessFraudDetection: true,
    canVerifyBPJS: true,
    canManageINACBGs: true,
    canViewAnalytics: true,
  },
  admin: {
    canManageUsers: false,
    canUploadDocuments: true,
    canValidateClaims: true,
    canAccessFraudDetection: false,
    canVerifyBPJS: false,
    canManageINACBGs: true,
    canViewAnalytics: true,
  },
  faskes: {
    canManageUsers: false,
    canUploadDocuments: false,
    canValidateClaims: true,
    canAccessFraudDetection: true,
    canVerifyBPJS: true,
    canManageINACBGs: true,
    canViewAnalytics: true,
  },
};

export const hasPermission = (role: UserRole, permission: keyof typeof rolePermissions['superadmin']) => {
  return rolePermissions[role]?.[permission] || false;
};