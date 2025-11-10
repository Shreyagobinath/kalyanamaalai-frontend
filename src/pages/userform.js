// src/pages/UserForm.js
import React from "react";
import { useForm } from "react-hook-form";
import { useSubmitForm } from "../hooks/useforms";

const UserForm = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const mutation = useSubmitForm(
    (data) => {
      alert("Form submitted successfully. Waiting for admin approval.");
      reset();
    },
    (err) => alert(err)
  );

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="max-w-5xl mx-auto bg-blue-100 shadow-xl p-8 my-10">
      <h1 className="text-3xl font-bold text-center text-indigo-500 mb-8">
        Matrimonial Profile Application / மணமகன் - மணமகள் விண்ணப்பம் 💍
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        {/* ---------------- Personal Details ---------------- */}
        <section>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">
            Personal Details / தனிப்பட்ட விவரங்கள்
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

        {/* ---------------- Education & Occupation ---------------- */}
        <section>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">
            Education & Occupation / கல்வி மற்றும் தொழில்
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

        {/* ---------------- Contact & Family Details ---------------- */}
        <section>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">
            Contact & Family Details / தொடர்பு மற்றும் குடும்ப விவரங்கள்
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { name: "address_en", label: "Address/ முகவரி" },
              { name: "phone", label: "Phone / தொலைபேசி" },
              { name: "email", label: "Email / மின்னஞ்சல்", type: "email" },
              { name: "father_name_en", label: "Father’s Name/ தந்தையின் பெயர்" },
              { name: "mother_name_en", label: "Mother’s Name/ தாயின் பெயர்" },
              { name: "siblings", label: "Siblings / சகோதரர்கள்" },
              {name: "location",label:"location/இடம் "},
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

        {/* ---------------- Partner Preferences ---------------- */}
        <section>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">
            Partner Preference / எதிர்பார்ப்பு விவரங்கள்
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

        {/* ---------------- Submit Button ---------------- */}
        <div className="text-center mt-8">
          <button
            type="submit"
            disabled={mutation.isLoading}
            className="px-8 py-3 bg-indigo-600 text-white rounded-sm shadow hover:bg-indigo-700 transition duration-300"
          >
            {mutation.isLoading ? "Submitting..." : "Submit Application / விண்ணப்பத்தை சமர்ப்பிக்கவும்"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
