import React, { useState, useEffect } from "react";
import API from "../api/axios";

const Profile = () => {
  const [profile, setProfile] = useState({ name: "", email: "", photoUrl: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [photo, setPhoto] = useState(null);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load profile");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handlePhotoChange = (e) => setPhoto(e.target.files[0]);

  const handleUpdate = async () => {
    if (!photo) return;
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("photo", photo);

    try {
      await API.put("/user/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Profile updated successfully");
      fetchProfile(); // refresh
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-indigo-600">Profile</h2>
      <div className="flex flex-col items-center gap-4">
        <img
          src={profile.photoUrl || "/default-avatar.png"}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border"
        />
        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>

        <input type="file" onChange={handlePhotoChange} />
        <button
          onClick={handleUpdate}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Update Photo
        </button>
      </div>
    </div>
  );
};

export default Profile;
