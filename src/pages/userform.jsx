// src/pages/UserForm.jsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------------------------
  // CHECK ACCESS & LOAD FORM
  // ---------------------------
  useEffect(() => {
    const checkAccessAndLoadForm = async () => {
      console.log("[UserForm] Checking access and loading existing form...");
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      try {
        // Decode JWT to get role
        const base64Payload = token.split(".")[1];
        const payload = JSON.parse(atob(base64Payload));
        const role = payload.role;
        console.log("[UserForm] JWT role:", role);

        if (role !== "user") return navigate("/admin/dashboard");

        // Fetch existing form (if any)
        const res = await axios.get(
          "http://localhost:5000/api/v1/user/form/status",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const form = res.data?.form || null;

        if (form) {
          Object.keys(form).forEach((key) => setValue(key, form[key]));
          if (form.profile_photo) setPreview(`http://localhost:5000/uploads/${form.profile_photo}`);
        }

        // Redirect if form completed or approved
        if (res.data?.hasForm) return navigate("/thank-you");
        if (res.data?.isApproved) return navigate("/user/dashboard");
      } catch (err) {
        console.log("[UserForm] No existing form, continue to fill:", err.message);
      } finally {
        setLoading(false);
      }
    };

    checkAccessAndLoadForm();
  }, [navigate, setValue]);

  // ---------------------------
  // HANDLE PHOTO PREVIEW
  // ---------------------------
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setProfilePhoto(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  // ---------------------------
  // SUBMIT FORM
  // ---------------------------
  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      Object.keys(data).forEach((key) => formData.append(key, data[key]));
      if (profilePhoto) formData.append("profile_photo", profilePhoto);

      await axios.post("http://localhost:5000/api/v1/user/forms", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      localStorage.setItem("form_completed", "1");
      alert("Form submitted successfully!");
      navigate("/thank-you");

      reset();
      setProfilePhoto(null);
      setPreview(null);
    } catch (err) {
      console.error("[UserForm] Form submit error:", err.response?.data || err);
      alert("Error submitting form. Try again.");
    }
  };

  if (loading) return <p className="text-center mt-10 text-black">Loading...</p>;

  // ---------------------------
  // FORM CONFIG
  // ---------------------------
  const personalDetails = [
    { name: "full_name_en", label: "Full Name / முழுப்பெயர்" },
    { name: "gender", type: "select", label: "Gender / பாலினம்", options: ["Male / ஆண்", "Female / பெண்"] },
    { name: "dob", type: "date", label: "Date of Birth / பிறந்த தேதி" },
    { name: "religion_en", label: "Religion / மதம்" },
    { name: "caste_en", label: "Caste / சாதி" },
    { name: "gothram_en", label: "Gothram / கோத்திரம்" },
    { name: "star_en", label: "Star / நட்சத்திரம்" },
    { name: "raasi_en", label: "Raasi / இராசி" },
    { name: "height", label: "Height (cm) / உயரம்" },
    { name: "weight", label: "Weight (kg) / எடை" },
    { name: "complexion_en", label: "Complexion / நிறம்" },
  ];

  const educationDetails = [
    { name: "education_en", label: "Education / கல்வி" },
    { name: "occupation_en", label: "Occupation / தொழில்" },
    { name: "income_en", label: "Income / வருமானம்" },
  ];

  const contactFamilyDetails = [
    { name: "address_en", label: "Address / முகவரி" },
    { name: "phone", label: "Phone / தொலைபேசி" },
    { name: "email", type: "email", label: "Email / மின்னஞ்சல்" },
    { name: "father_name_en", label: "Father Name / தந்தையின் பெயர்" },
    { name: "mother_name_en", label: "Mother Name / தாயின் பெயர்" },
    { name: "siblings", label: "Siblings / சகோதரர்கள்" },
    { name: "location", label: "Location / இடம்" },
    {
      name: "marital_status",
      type: "select",
      label: "Marital Status / திருமண நிலை",
      options: ["Single / திருமணம் ஆகாதவர்", "Divorced / விவாகரத்து", "Widowed / விதவை"],
    },
  ];

  const partnerPreference = [
    { name: "preferred_age_range", label: "Preferred Age Range / விருப்ப வயது" },
    { name: "preferred_religion", label: "Preferred Religion / விருப்ப மதம்" },
    { name: "preferred_occupation", label: "Preferred Occupation / விருப்பு தொழில்" },
    { name: "preferred_location", label: "Preferred Location / விருப்பு இடம்" },
  ];

  const renderFields = (fields) =>
    fields.map((field) => (
      <div key={field.name}>
        <label className="block font-medium mb-1 text-black">{field.label} *</label>

        {field.type === "select" ? (
          <select
            {...register(field.name, { required: `${field.label} is required` })}
            className="w-full border rounded-sm p-2 text-black"
          >
            <option value="">Select</option>
            {field.options.map((opt) => (
              <option key={opt} value={opt.split(" / ")[0]}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={field.type || "text"}
            {...register(field.name, { required: `${field.label} is required` })}
            className="w-full border rounded-sm p-2 text-black"
          />
        )}

        {errors[field.name] && <p className="text-red-500 text-sm">{errors[field.name]?.message}</p>}
      </div>
    ));

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-xl p-8 my-10 rounded-lg">
      <h1 className="text-3xl font-bold text-center text-black mb-8">
        Matrimonial Profile Application / மணமகன் - மணமகள் விண்ணப்பம் 💍
      </h1>

      <div className="flex flex-col items-center mb-8">
        <div className="w-32 h-32 mb-4 rounded-full overflow-hidden border-2 border-gray-300">
          {preview ? (
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
              No Photo
            </div>
          )}
        </div>
        <input type="file" accept="image/*" onChange={handlePhotoChange} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-black">
            Personal Details / தனிப்பட்ட விவரங்கள்
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">{renderFields(personalDetails)}</div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-black">
            Education & Occupation / கல்வி மற்றும் தொழில்
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">{renderFields(educationDetails)}</div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-black">
            Contact & Family Details / தொடர்பு & குடும்ப விவரங்கள்
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">{renderFields(contactFamilyDetails)}</div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-black">
            Partner Preference / எதிர்பார்ப்பு விவரங்கள்
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">{renderFields(partnerPreference)}</div>
        </section>

        <div className="text-center mt-8">
          <button
            type="submit"
            className="px-8 py-3 bg-black text-white rounded-sm shadow hover:bg-gray-800 transition duration-300"
          >
            Submit Application / விண்ணப்பத்தை சமர்ப்பிக்கவும்
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
