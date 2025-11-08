import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchUserProfile = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User not authenticated");
  }

  const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const useProfileData = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: fetchUserProfile,
    staleTime: 1000 * 60 * 5, 
  });
};
