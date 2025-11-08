import React, { useState, useEffect } from "react";
import { useProfileData } from "../hooks/useprofile";
import axios from "axios";

const EditProfile = () => {
  const { data, isLoading, isError, error } = useProfileData();
  const [formData, setFormData] = useState({});
  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    if (data) setFormData(data);
  }, [data]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) setProfilePhoto(files[0]);
    else setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const uploadData = new FormData();

    Object.keys(formData).forEach((key) => {
      if (formData[key] !== undefined) uploadData.append(key, formData[key]);
    });

    if (profilePhoto) uploadData.append("profilePhoto", profilePhoto);

    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/user/profile`, uploadData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile");
    }
  };

  if (isLoading) return <div>Loading Profile...</div>;
  if (isError) return <div>Error loading profile: {error.message}</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Edit Your Profile</h2>
      <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
        <div>
          <label className="block font-medium">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Email:</label>
          <input
            type="email"
            value={formData.email || ""}
            disabled
            className="w-full border px-3 py-2 rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block font-medium">Gender:</label>
          <select
            name="gender"
            value={formData.gender || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Date of Birth:</label>
          <input
            type="date"
            name="dob"
            value={formData.dob || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">City:</label>
          <input
            type="text"
            name="city"
            value={formData.city || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Profile Photo:</label>
          <input
            type="file"
            name="profilePhoto"
            onChange={handleChange}
            accept="image/*"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
