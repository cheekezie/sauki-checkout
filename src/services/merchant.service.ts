import { RequestService } from './api/client';
import { MerchantEndpoints } from './api/endpoints';
import type { MerchantI } from '@/interface/organization.interface';

export type MerchantPermissions = {
  roles: string[];
  permissions: string[];
};

class MerchantService {
  async getMyProfile(): Promise<{ merchant: MerchantI; admin: any; roles?: string[]; permissions?: string[] }> {
    const res = await RequestService.get(MerchantEndpoints.getMyProfile);
    return res as any;
  }

  async getMyPermissions(): Promise<MerchantPermissions> {
    const res = await RequestService.get(MerchantEndpoints.getMyPermissions);
    return res as any;
  }
}

export default new MerchantService();



