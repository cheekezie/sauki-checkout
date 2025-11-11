import { useQuery, useQueryClient } from "@tanstack/react-query";
import MerchantService from "@/services/merchant.service";
import { getCachedData, storeCookie } from "@/utils/cookieStorage";
import type { MerchantPermissions } from "@/services/merchant.service";

const COOKIE_NAME_PROFILE = "_merchant_profile";
const COOKIE_NAME_PERMISSIONS = "_merchant_permissions";
const COOKIE_EXPIRY_DAYS = 14;

type MerchantProfileResponse = {
  merchant: any;
  admin: any;
  roles?: string[];
  permissions?: string[];
};

export function useMerchantProfile() {
  const queryClient = useQueryClient();
  const cachedData = getCachedData<MerchantProfileResponse>(COOKIE_NAME_PROFILE);

  return useQuery<MerchantProfileResponse>({
    queryKey: ["merchant", "me"],
    queryFn: async () => {
      const response = await MerchantService.getMyProfile();
      if (response) {
        storeCookie(COOKIE_NAME_PROFILE, response, COOKIE_EXPIRY_DAYS);
        queryClient.setQueryData(["merchant", "me"], response);
        return response;
      }
      throw new Error("Failed to fetch merchant profile");
    },
    initialData: cachedData || undefined,
    staleTime: COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    gcTime: COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    retry: 2,
  });
}

export function useMerchantPermissions() {
  const queryClient = useQueryClient();
  const cachedData = getCachedData<MerchantPermissions>(COOKIE_NAME_PERMISSIONS);

  return useQuery<MerchantPermissions>({
    queryKey: ["merchant", "permissions"],
    queryFn: async () => {
      const response = await MerchantService.getMyPermissions();
      if (response) {
        storeCookie(COOKIE_NAME_PERMISSIONS, response, COOKIE_EXPIRY_DAYS);
        queryClient.setQueryData(["merchant", "permissions"], response);
        return response;
      }
      throw new Error("Failed to fetch merchant permissions");
    },
    initialData: cachedData || undefined,
    staleTime: COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    gcTime: COOKIE_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
    retry: 2,
  });
}



