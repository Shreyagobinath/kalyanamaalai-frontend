// src/pages/UserForm.js
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSubmitForm } from "../hooks/useforms";

const UserForm = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [preview, setPreview] = useState(null);

  const mutation = useSubmitForm(
    () => {
      alert("Form submitted successfully. Waiting for admin approval.");
      reset();
      setProfilePhoto(null);
      setPreview(null);
    },
    (err) => alert("Error submitting form: " + err.message)
  );

  const onSubmit = (data) => {
    const formData = new FormData();

    // Append all text fields
    for (const key in data) {
      formData.append(key, data[key]);
    }

    // Append photo if selected
    if (profilePhoto) {
      formData.append("profile_photo", profilePhoto);
    }

    // ✅ Debugging – check what’s inside FormData
    console.log("FormData contents:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": ", pair[1]);
    }

    mutation.mutate(formData);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setProfilePhoto(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-orange-50 shadow-xl p-8 my-10 rounded-lg">
      <h1 className="text-3xl font-bold text-center text-orange-500 mb-8">
        Matrimonial Profile Application / மணமகன் - மணமகள் விண்ணப்பம் 💍
      </h1>

      {/* Profile Photo Upload */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-32 h-32 mb-4 rounded-full overflow-hidden border-2 border-orange-300">
          {preview ? (
            <img
              src={preview}
              alt="Profile Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-orange-300">
              No Photo
            </div>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="text-sm"
        />
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Personal Details */}
        <section>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-orange-600">
            Personal Details / தனிப்பட்ட விவரங்கள்
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-orange-500">
            {[
              { name: "full_name_en", label: "Full Name/ முழுப்பெயர்" },
              { name: "gender", label: "Gender / பாலினம்", type: "select", options: ["Male / ஆண்", "Female / பெண்"] },
              { name: "dob", label: "Date of Birth / பிறந்த தேதி", type: "date" },
              { name: "religion_en", label: "Religion / மதம்" },
              { name: "caste_en", label: "Caste / சாதி" },
              { name: "gothram_en", label: "Gothram / கோத்திரம்" },
              { name: "star_en", label: "Star / நட்சத்திரம்" },
              { name: "raasi_en", label: "Raasi / இராசி" },
              { name: "height", label: "Height (cm) / உயரம்" },
              { name: "weight", label: "Weight (kg) / எடை" },
              { name: "complexion_en", label: "Complexion / நிறம்" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block font-medium mb-1">{field.label} *</label>
                {field.type === "select" ? (
                  <select
                    {...register(field.name, { required: `${field.label} is required` })}
                    className="w-full border rounded-sm p-2"
                  >
                    <option value="">Select / தேர்வு செய்க</option>
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
                    className="w-full border rounded-sm p-2"
                  />
                )}
                {errors[field.name] && <p className="text-red-500 text-sm">{errors[field.name].message}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Education & Occupation */}
        <section>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-orange-600">
            Education & Occupation / கல்வி மற்றும் தொழில்
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-orange-500">
            {[
              { name: "education_en", label: "Education/ கல்வி" },
              { name: "occupation_en", label: "Occupation/ தொழில்" },
              { name: "income_en", label: "Income / வருமானம்" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block font-medium mb-1">{field.label} *</label>
                <input
                  {...register(field.name, { required: `${field.label} is required` })}
                  className="w-full border rounded-sm p-2"
                />
                {errors[field.name] && <p className="text-red-500 text-sm">{errors[field.name].message}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Contact & Family Details */}
        <section>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-orange-600">
            Contact & Family Details / தொடர்பு மற்றும் குடும்ப விவரங்கள்
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-orange-500">
            {[
              { name: "address_en", label: "Address/ முகவரி" },
              { name: "phone", label: "Phone / தொலைபேசி" },
              { name: "email", label: "Email / மின்னஞ்சல்", type: "email" },
              { name: "father_name_en", label: "Father’s Name/ தந்தையின் பெயர்" },
              { name: "mother_name_en", label: "Mother’s Name/ தாயின் பெயர்" },
              { name: "siblings", label: "Siblings / சகோதரர்கள்" },
              { name: "location", label: "Location / இடம் " },
              { name: "marital_status", label: "Marital Status / திருமண நிலை", type: "select", options: ["Single / திருமணம் ஆகாதவர்", "Divorced / விவாகரத்து", "Widowed / விதவை"] },
            ].map((field) => (
              <div key={field.name}>
                <label className="block font-medium mb-1">{field.label} *</label>
                {field.type === "select" ? (
                  <select
                    {...register(field.name, { required: `${field.label} is required` })}
                    className="w-full border rounded-sm p-2"
                  >
                    <option value="">Select</option>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt.split(" / ")[0]}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type || "text"}
                    {...register(field.name, { required: `${field.label} is required` })}
                    className="w-full border rounded-sm p-2"
                  />
                )}
                {errors[field.name] && <p className="text-red-500 text-sm">{errors[field.name].message}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Partner Preferences */}
        <section>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-orange-600">
            Partner Preference / எதிர்பார்ப்பு விவரங்கள்
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-orange-500">
            {[
              { name: "preferred_age_range", label: "Preferred Age Range / விருப்ப வயது" },
              { name: "preferred_religion", label: "Preferred Religion / விருப்ப மதம்" },
              { name: "preferred_occupation", label: "Preferred Occupation / விருப்பு தொழில்" },
              { name: "preferred_location", label: "Preferred Location / விருப்பு இடம்" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block font-medium mb-1">{field.label} *</label>
                <input
                  {...register(field.name, { required: `${field.label} is required` })}
                  className="w-full border rounded-sm p-2"
                />
                {errors[field.name] && <p className="text-red-500 text-sm">{errors[field.name].message}</p>}
              </div>
            ))}
          </div>
        </section>

        {/* Submit Button */}
        <div className="text-center mt-8">
          <button
            type="submit"
            disabled={mutation.isLoading}
            className="px-8 py-3 bg-orange-600 text-white rounded-sm shadow hover:bg-orange-700 transition duration-300"
          >
            {mutation.isLoading ? "Submitting..." : "Submit Application / விண்ணப்பத்தை சமர்ப்பிக்கவும்"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
