import { useQuery } from '@tanstack/react-query';
import OrganizationService from '@/services/organization.service';

export interface GetActivityParams {
  pageNumber?: number;
  search?: string;
}

export function useActivity(params?: GetActivityParams) {
  return useQuery({
    queryKey: ['activity', params?.pageNumber, params?.search],
    queryFn: () => OrganizationService.getActivity(params),
    staleTime: 30000, // 30 seconds
    retry: 1,
  });
}

