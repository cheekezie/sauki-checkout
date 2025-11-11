import { useEffect, useMemo, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { MerchantRoles, type MerchantRoleEnum } from '@/enums/merchant.enum';
import { RequestService } from '@/services/api/client';
import { useOrg } from "@/hooks/useOrg";
import type { User } from '@/interface/user.interface';

type JwtPayload = {
  sub?: string;
  iat?: number;
  exp?: number;
  user?: User;
  profile?: User;
  admin?: User;
  roles?: string[];
  permissions?: string[];
  role?: string;
};

interface AuthContext {
  user: User | null;
  role: MerchantRoleEnum | null;
  permissions: string[];
  isLoading: boolean;
  isAdmin: boolean;
  hasPermission: (perm: string) => boolean;
  organizationName: string;
}

export function useDecodedAuth(): AuthContext {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<MerchantRoleEnum | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [organizationName, setOrganizationName] = useState<string>("");
  const { activeOrgId } = useOrg();

  useEffect(() => {
    const token = RequestService.getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const adminObj: User | undefined = decoded.admin;
      
      // Get role from admin.role (backend sends: portalAdmin, orgAdmin, groupAdmin)
      const roleFromToken = adminObj?.role || decoded.role || decoded.roles?.[0];
      
      // Map backend role to MerchantRoles enum
      let mappedRole: MerchantRoleEnum | null = null;
      if (roleFromToken) {
        if (roleFromToken === 'portalAdmin') {
          mappedRole = MerchantRoles.PORTAL_ADMIN;
        } else if (roleFromToken === 'orgAdmin') {
          mappedRole = MerchantRoles.ORG_ADMIN;
        } else if (roleFromToken === 'groupAdmin') {
          mappedRole = MerchantRoles.GROUP_ADMIN;
        } else {
          // Try to find in enum values (for backward compatibility)
          const roleValue = Object.values(MerchantRoles).find(
            value => value === roleFromToken
          );
          if (roleValue) {
            mappedRole = roleValue as MerchantRoleEnum;
          }
        }
      }
      
      setRole(mappedRole);

      // Build permissions from admin.permissions if present; else fallback to array on token
      if (adminObj?.permissions && typeof adminObj.permissions === 'object') {
        const flat: string[] = [];
        Object.entries(adminObj.permissions).forEach(([key, val]) => {
          const v = val as { read?: boolean; write?: boolean };
          if (v?.read) flat.push(`${key}.read`);
          if (v?.write) flat.push(`${key}.write`);
        });
        setPermissions(flat);
      } else {
        setPermissions(decoded.permissions || []);
      }

      // Prefer admin as user if available
      setUser((adminObj || decoded.user || decoded.profile) as User || null);

      // Resolve current organization name from admin.organizations (prefer activeOrgId)
      if (Array.isArray(adminObj?.organizations)) {
        const preferredId = activeOrgId || adminObj?.organization;
        const current = preferredId
          ? adminObj.organizations.find((o) => (o as { _id?: string })._id === preferredId)
          : undefined;
        const fallback = adminObj.organizations[0]?.organizationName || "";
        setOrganizationName(current?.organizationName || fallback);
      } else {
        setOrganizationName("");
      }
    } catch (e) {
      setUser(null);
      setRole(null);
      setPermissions([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeOrgId]);

  const hasPermission = useMemo(() => {
    return (perm: string) => permissions.includes(perm);
  }, [permissions]);

  // Update isAdmin check to include new roles
  const isAdmin = role === MerchantRoles.PORTAL_ADMIN || 
                  role === MerchantRoles.ORG_ADMIN || 
                  role === MerchantRoles.GROUP_ADMIN ||
                  role === MerchantRoles.ADMIN || 
                  role === MerchantRoles.SUPER_ADMIN;

  return { user, role, permissions, isLoading, isAdmin, hasPermission, organizationName };
}


