import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import OrganizationService from '@/services/organization.service';
import { useToast } from '@/hooks/useToast';
import { getErrorMessage } from '@/types/error.types';
import { isUnauthorizedError } from '@/utils/errorHandler';

export function useSessions() {
  return useQuery({
    queryKey: ['sessions'],
    queryFn: () => OrganizationService.getAllSessions(),
    staleTime: 30000, // 30 seconds
    retry: 1,
  });
}

export function useStartSession() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      return await OrganizationService.startSession(id);
    },
    onSuccess: (data) => {
      const message = data.message || 'Session started successfully';
      showSuccess('Session Started', message);
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
    onError: (error: unknown) => {
      if (!isUnauthorizedError(error)) {
        const errorMessage = getErrorMessage(error) || 'Failed to start session. Please try again.';
        showError('Failed to Start Session', errorMessage);
      }
    },
  });
}

