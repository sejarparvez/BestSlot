import { QUERY_KEYS } from '@/lib/constant';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function useUserProfile() {
  return useQuery({
    queryKey: [QUERY_KEYS.USER_PROFILE],
    queryFn: async () => {
      const response = await axios.get(`/api/users/profile`);
      return response.data;
    },
  });
}
