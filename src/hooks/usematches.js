
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const fetchUserMatches = async () => {
  const token = localStorage.getItem('token');

  const response = await axios.get('http://localhost:5000/api/v1/user/matches', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const useMatches = () => {
  return useQuery({
    queryKey: ['matches'], 
    queryFn: fetchUserMatches,
  });
};