// pages/forms.js
import React from "react";
import { useForm } from "react-hook-form";
import { useSubmitForm } from "../hooks/useforms";

const Form = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const mutation = useSubmitForm(
    (data) => {
      alert("Form submitted successfully!");
      reset();
    },
    (err) => alert(err)
  );

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  const inputClass = "w-full border rounded-lg p-2";
  const errorClass = "text-red-500 text-sm mt-1";

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl p-8 my-10">
      <h1 className="text-3xl font-bold text-center text-indigo-600 mb-8">
        Matrimonial Profile Application / மணமகன் - மணமகள் விண்ணப்பம் 💍
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

        {/* ---------------- Personal Details ---------------- */}
        <section>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">
            Personal Details / தனிப்பட்ட விவரங்கள்
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            <div>
              <label>Full Name (English) *</label>
              <input {...register("full_name_en", { required: "Full name is required" })} className={inputClass}/>
              {errors.full_name_en && <p className={errorClass}>{errors.full_name_en.message}</p>}
            </div>

            <div>
              <label>Full Name (Tamil) *</label>
              <input {...register("full_name_ta", { required: "Full name in Tamil is required" })} className={inputClass}/>
              {errors.full_name_ta && <p className={errorClass}>{errors.full_name_ta.message}</p>}
            </div>

            <div>
              <label>Gender *</label>
              <select {...register("gender", { required: "Gender is required" })} className={inputClass}>
                <option value="">Select</option>
                <option value="Male">Male / ஆண்</option>
                <option value="Female">Female / பெண்</option>
              </select>
              {errors.gender && <p className={errorClass}>{errors.gender.message}</p>}
            </div>

            <div>
              <label>Date of Birth *</label>
              <input type="date" {...register("dob", { required: "Date of birth is required" })} className={inputClass}/>
              {errors.dob && <p className={errorClass}>{errors.dob.message}</p>}
            </div>

            <div>
              <label>Religion (English) *</label>
              <input {...register("religion_en", { required: "Religion is required" })} className={inputClass}/>
              {errors.religion_en && <p className={errorClass}>{errors.religion_en.message}</p>}
            </div>

            <div>
              <label>Religion (Tamil) *</label>
              <input {...register("religion_ta", { required: "Religion in Tamil is required" })} className={inputClass}/>
              {errors.religion_ta && <p className={errorClass}>{errors.religion_ta.message}</p>}
            </div>

            <div>
              <label>Caste (English) *</label>
              <input {...register("caste_en", { required: "Caste is required" })} className={inputClass}/>
              {errors.caste_en && <p className={errorClass}>{errors.caste_en.message}</p>}
            </div>

            <div>
              <label>Caste (Tamil) *</label>
              <input {...register("caste_ta", { required: "Caste in Tamil is required" })} className={inputClass}/>
              {errors.caste_ta && <p className={errorClass}>{errors.caste_ta.message}</p>}
            </div>

            <div>
              <label>Gothram (English) *</label>
              <input {...register("gothram_en", { required: "Gothram is required" })} className={inputClass}/>
              {errors.gothram_en && <p className={errorClass}>{errors.gothram_en.message}</p>}
            </div>

            <div>
              <label>Gothram (Tamil) *</label>
              <input {...register("gothram_ta", { required: "Gothram in Tamil is required" })} className={inputClass}/>
              {errors.gothram_ta && <p className={errorClass}>{errors.gothram_ta.message}</p>}
            </div>

            <div>
              <label>Star (English) *</label>
              <input {...register("star_en", { required: "Star is required" })} className={inputClass}/>
              {errors.star_en && <p className={errorClass}>{errors.star_en.message}</p>}
            </div>

            <div>
              <label>Star (Tamil) *</label>
              <input {...register("star_ta", { required: "Star in Tamil is required" })} className={inputClass}/>
              {errors.star_ta && <p className={errorClass}>{errors.star_ta.message}</p>}
            </div>

            <div>
              <label>Raasi (English) *</label>
              <input {...register("raasi_en", { required: "Raasi is required" })} className={inputClass}/>
              {errors.raasi_en && <p className={errorClass}>{errors.raasi_en.message}</p>}
            </div>

            <div>
              <label>Raasi (Tamil) *</label>
              <input {...register("raasi_ta", { required: "Raasi in Tamil is required" })} className={inputClass}/>
              {errors.raasi_ta && <p className={errorClass}>{errors.raasi_ta.message}</p>}
            </div>

            <div>
              <label>Height (cm) *</label>
              <input {...register("height", { required: "Height is required" })} className={inputClass}/>
              {errors.height && <p className={errorClass}>{errors.height.message}</p>}
            </div>

            <div>
              <label>Weight (kg) *</label>
              <input {...register("weight", { required: "Weight is required" })} className={inputClass}/>
              {errors.weight && <p className={errorClass}>{errors.weight.message}</p>}
            </div>

            <div>
              <label>Complexion (English) *</label>
              <input {...register("complexion_en", { required: "Complexion is required" })} className={inputClass}/>
              {errors.complexion_en && <p className={errorClass}>{errors.complexion_en.message}</p>}
            </div>

            <div>
              <label>Complexion (Tamil) *</label>
              <input {...register("complexion_ta", { required: "Complexion in Tamil is required" })} className={inputClass}/>
              {errors.complexion_ta && <p className={errorClass}>{errors.complexion_ta.message}</p>}
            </div>

          </div>
        </section>

        {/* ---------------- Education & Occupation ---------------- */}
        <section>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">
            Education & Occupation / கல்வி மற்றும் தொழில்
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label>Education (English) *</label>
              <input {...register("education_en", { required: "Education is required" })} className={inputClass}/>
              {errors.education_en && <p className={errorClass}>{errors.education_en.message}</p>}
            </div>
            <div>
              <label>Education (Tamil) *</label>
              <input {...register("education_ta", { required: "Education in Tamil is required" })} className={inputClass}/>
              {errors.education_ta && <p className={errorClass}>{errors.education_ta.message}</p>}
            </div>
            <div>
              <label>Occupation (English) *</label>
              <input {...register("occupation_en", { required: "Occupation is required" })} className={inputClass}/>
              {errors.occupation_en && <p className={errorClass}>{errors.occupation_en.message}</p>}
            </div>
            <div>
              <label>Occupation (Tamil) *</label>
              <input {...register("occupation_ta", { required: "Occupation in Tamil is required" })} className={inputClass}/>
              {errors.occupation_ta && <p className={errorClass}>{errors.occupation_ta.message}</p>}
            </div>
            <div>
              <label>Income (English) *</label>
              <input {...register("income_en", { required: "Income is required" })} className={inputClass}/>
              {errors.income_en && <p className={errorClass}>{errors.income_en.message}</p>}
            </div>
            <div>
              <label>Income (Tamil) *</label>
              <input {...register("income_ta", { required: "Income in Tamil is required" })} className={inputClass}/>
              {errors.income_ta && <p className={errorClass}>{errors.income_ta.message}</p>}
            </div>
          </div>
        </section>

        {/* ---------------- Contact & Family Details ---------------- */}
        <section>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">
            Contact & Family Details / தொடர்பு மற்றும் குடும்ப விவரங்கள்
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            <div>
              <label>Address (English) *</label>
              <textarea {...register("address_en", { required: "Address is required" })} className={inputClass}/>
              {errors.address_en && <p className={errorClass}>{errors.address_en.message}</p>}
            </div>
            <div>
              <label>Address (Tamil) *</label>
              <textarea {...register("address_ta", { required: "Address in Tamil is required" })} className={inputClass}/>
              {errors.address_ta && <p className={errorClass}>{errors.address_ta.message}</p>}
            </div>
            <div>
              <label>Phone *</label>
              <input {...register("phone", { required: "Phone is required" })} className={inputClass}/>
              {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
            </div>
            <div>
              <label>Email *</label>
              <input type="email" {...register("email", { required: "Email is required" })} className={inputClass}/>
              {errors.email && <p className={errorClass}>{errors.email.message}</p>}
            </div>
            <div>
              <label>Father's Name (English) *</label>
              <input {...register("father_name_en", { required: "Father's name is required" })} className={inputClass}/>
              {errors.father_name_en && <p className={errorClass}>{errors.father_name_en.message}</p>}
            </div>
            <div>
              <label>Father's Name (Tamil) *</label>
              <input {...register("father_name_ta", { required: "Father's name in Tamil is required" })} className={inputClass}/>
              {errors.father_name_ta && <p className={errorClass}>{errors.father_name_ta.message}</p>}
            </div>
            <div>
              <label>Mother's Name (English) *</label>
              <input {...register("mother_name_en", { required: "Mother's name is required" })} className={inputClass}/>
              {errors.mother_name_en && <p className={errorClass}>{errors.mother_name_en.message}</p>}
            </div>
            <div>
              <label>Mother's Name (Tamil) *</label>
              <input {...register("mother_name_ta", { required: "Mother's name in Tamil is required" })} className={inputClass}/>
              {errors.mother_name_ta && <p className={errorClass}>{errors.mother_name_ta.message}</p>}
            </div>
            <div>
              <label>Siblings *</label>
              <input {...register("siblings", { required: "Siblings field is required" })} className={inputClass}/>
              {errors.siblings && <p className={errorClass}>{errors.siblings.message}</p>}
            </div>
            <div>
              <label>Marital Status *</label>
              <select {...register("marital_status", { required: "Marital status is required" })} className={inputClass}>
                <option value="">Select</option>
                <option value="Single">Single</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
              {errors.marital_status && <p className={errorClass}>{errors.marital_status.message}</p>}
            </div>
          </div>
        </section>

        {/* ---------------- Partner Preferences ---------------- */}
        <section>
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">
            Partner Preferences / எதிர்பார்ப்பு விவரங்கள்
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label>Preferred Age Range *</label>
              <input {...register("preferred_age_range", { required: "Preferred age range is required" })} className={inputClass}/>
              {errors.preferred_age_range && <p className={errorClass}>{errors.preferred_age_range.message}</p>}
            </div>
            <div>
              <label>Preferred Religion *</label>
              <input {...register("preferred_religion", { required: "Preferred religion is required" })} className={inputClass}/>
              {errors.preferred_religion && <p className={errorClass}>{errors.preferred_religion.message}</p>}
            </div>
            <div>
              <label>Preferred Occupation *</label>
              <input {...register("preferred_occupation", { required: "Preferred occupation is required" })} className={inputClass}/>
              {errors.preferred_occupation && <p className={errorClass}>{errors.preferred_occupation.message}</p>}
            </div>
            <div>
              <label>Preferred Location *</label>
              <input {...register("preferred_location", { required: "Preferred location is required" })} className={inputClass}/>
              {errors.preferred_location && <p className={errorClass}>{errors.preferred_location.message}</p>}
            </div>
          </div>
        </section>

        {/* ---------------- Submit Button ---------------- */}
        <div className="text-center mt-8">
          <button type="submit" disabled={mutation.isLoading} className="px-8 py-3 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700 transition duration-300">
            {mutation.isLoading ? "Submitting..." : "Submit Application / விண்ணப்பத்தை சமர்ப்பிக்கவும்"}
          </button>
        </div>

      </form>
    </div>
  );
};

export default Form;
