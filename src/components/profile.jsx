import React, { useState, useEffect } from "react";
import API from "../api/axios";

const ProfilePhoto = () => {
  const [photoUrl, setPhotoUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user details (which include profile_photo filename)
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/user/account-details", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.profile_photo) {
          setPhotoUrl(
            `${import.meta.env.VITE_API_BASE_URL}/uploads/profile_photos/${res.data.profile_photo}`
          );
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="relative">
      <img
        src={photoUrl || "https://i.pravatar.cc/40"}
        alt="Profile"
        className="w-10 h-10 rounded-full cursor-pointer border-2 border-indigo-500 object-cover"
      />
    </div>
  );
};

export default ProfilePhoto;
