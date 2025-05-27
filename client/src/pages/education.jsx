import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EducationExperienceForm = () => {
  const location = useLocation();
  const phone = location.state?.phone || "";
  const navigate = useNavigate();
  const membershipId = location.state?.membershipId || "";

  if (!phone) {
    return <Navigate to="/basic-info" replace />;
  }

  const [education, setEducation] = useState([
    { degree: "", institution: "", year: "", document: null },
  ]);
  const [experience, setExperience] = useState([
    { role: "", company: "", duration: "", document: null },
  ]);

  useEffect(() => {
    if (!phone) return;

    axios
      .get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/user-details/${encodeURIComponent(phone)}`
      )
      .then((res) => {
        const userData = res.data?.userData;

        if (
          userData.education &&
          Array.isArray(userData.education) &&
          userData.education.length > 0
        ) {
          const educationWithDoc = userData.education.map((edu) => ({
            ...edu,
            document: null,
          }));
          setEducation(educationWithDoc);
        }
        if (
          userData.experience &&
          Array.isArray(userData.experience) &&
          userData.experience.length > 0
        ) {
          const experienceWithDoc = userData.experience.map((exp) => ({
            ...exp,
            document: null,
          }));
          setExperience(experienceWithDoc);
        }
      })
      .catch((err) => {
        console.error("Error fetching existing user data:", err);
      });
  }, [phone]);

  const handleEducationChange = (index, e) => {
    const updated = [...education];
    if (e.target.name === "document") {
      updated[index].document = e.target.files[0] || null;
    } else {
      updated[index][e.target.name] = e.target.value;
    }
    setEducation(updated);
  };

  const handleExperienceChange = (index, e) => {
    const updated = [...experience];
    if (e.target.name === "document") {
      updated[index].document = e.target.files[0] || null;
    } else {
      updated[index][e.target.name] = e.target.value;
    }
    setExperience(updated);
  };

  const addEducation = () =>
    setEducation([
      ...education,
      { degree: "", institution: "", year: "", document: null },
    ]);

  const addExperience = () =>
    setExperience([
      ...experience,
      { role: "", company: "", duration: "", document: null },
    ]);

  const removeEducation = (index) => {
    const updated = [...education];
    updated.splice(index, 1);
    setEducation(
      updated.length
        ? updated
        : [{ degree: "", institution: "", year: "", document: null }]
    );
  };

  const removeExperience = (index) => {
    const updated = [...experience];
    updated.splice(index, 1);
    setExperience(
      updated.length
        ? updated
        : [{ role: "", company: "", duration: "", document: null }]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phone) {
      toast.error("Phone number is missing. Cannot submit.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("Phone", phone);
      formData.append(
        "education",
        JSON.stringify(education.map(({ document, ...rest }) => rest))
      );
      formData.append(
        "experience",
        JSON.stringify(experience.map(({ document, ...rest }) => rest))
      );

      education.forEach((edu, idx) => {
        if (edu.document) {
          formData.append(`document_edu_${idx}`, edu.document);
        }
      });

      experience.forEach((exp, idx) => {
        if (exp.document) {
          formData.append(`document_exp_${idx}`, exp.document);
        }
      });

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/step-three`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Form submitted successfully!");
      navigate("/paymentPage", {
        state: {
          phone,
          membershipId,
        },
      });
    } catch (error) {
      console.error("Submission error:", error.response?.data || error.message);
      toast.error("Error submitting form. See console for details.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4 py-12">
      <div className="max-w-6xl w-full bg-white rounded-xl shadow-xl p-10">
        <form onSubmit={handleSubmit} className="space-y-8">
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
            Education Information
          </h2>

          {/* Education Section */}
          <section className="mb-12">
            <h3 className="text-2xl font-bold mb-6 border-b border-gray-300 pb-2 text-gray-800">
              Education
            </h3>

            {education.map((edu, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-md p-6 mb-6 shadow-sm bg-gray-50"
              >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xl font-semibold text-gray-700">
                    Education #{index + 1}
                  </h4>
                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
                    className="text-red-600 hover:text-red-800 font-bold"
                    aria-label={`Remove education entry ${index + 1}`}
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                  <div className="flex flex-col">
                    <label
                      htmlFor={`degree-${index}`}
                      className="mb-1 font-medium text-gray-700"
                    >
                      Degree <span className="text-red-500">*</span>
                    </label>
                    <input
                      id={`degree-${index}`}
                      name="degree"
                      type="text"
                      placeholder="e.g. B.Sc Computer Science"
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(index, e)}
                      required
                      className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor={`institution-${index}`}
                      className="mb-1 font-medium text-gray-700"
                    >
                      Institution <span className="text-red-500">*</span>
                    </label>
                    <input
                      id={`institution-${index}`}
                      name="institution"
                      type="text"
                      placeholder="University / College"
                      value={edu.institution}
                      onChange={(e) => handleEducationChange(index, e)}
                      required
                      className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor={`year-${index}`}
                      className="mb-1 font-medium text-gray-700"
                    >
                      Year <span className="text-red-500">*</span>
                    </label>
                    <input
                      id={`year-${index}`}
                      name="year"
                      type="text"
                      placeholder="e.g. 2024"
                      value={edu.year}
                      onChange={(e) => handleEducationChange(index, e)}
                      required
                      className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label
                      htmlFor={`document-edu-${index}`}
                      className="block mb-2 font-medium text-gray-700"
                    >
                      Upload Document<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      id={`document-edu-${index}`}
                      name="document"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => handleEducationChange(index, e)}
                      className="block w-full text-gray-600"
                      required
                    />
                    {edu.document && (
                      <p className="mt-1 text-green-600 text-sm truncate">
                        {edu.document.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addEducation}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow-md transition"
            >
              + Add Another Education
            </button>
          </section>

          {/* Experience Section */}
          <section>
            <h3 className="text-2xl font-bold mb-6 border-b border-gray-300 pb-2 text-gray-800">
              Experience
            </h3>

            {experience.map((exp, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-md p-6 mb-6 shadow-sm bg-gray-50"
              >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xl font-semibold text-gray-700">
                    Experience #{index + 1}
                  </h4>
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="text-red-600 hover:text-red-800 font-bold"
                    aria-label={`Remove experience entry ${index + 1}`}
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                  <div className="flex flex-col">
                    <label
                      htmlFor={`role-${index}`}
                      className="mb-1 font-medium text-gray-700"
                    >
                      Role <span className="text-red-500">*</span>
                    </label>
                    <input
                      id={`role-${index}`}
                      name="role"
                      type="text"
                      placeholder="Job title / position"
                      value={exp.role}
                      onChange={(e) => handleExperienceChange(index, e)}
                      required
                      className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor={`company-${index}`}
                      className="mb-1 font-medium text-gray-700"
                    >
                      Company <span className="text-red-500">*</span>
                    </label>
                    <input
                      id={`company-${index}`}
                      name="company"
                      type="text"
                      placeholder="Company name"
                      value={exp.company}
                      onChange={(e) => handleExperienceChange(index, e)}
                      required
                      className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor={`duration-${index}`}
                      className="mb-1 font-medium text-gray-700"
                    >
                      Duration <span className="text-red-500">*</span>
                    </label>
                    <input
                      id={`duration-${index}`}
                      name="duration"
                      type="text"
                      placeholder="e.g. Jan 2020 - Dec 2022"
                      value={exp.duration}
                      onChange={(e) => handleExperienceChange(index, e)}
                      required
                      className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label
                      htmlFor={`document-exp-${index}`}
                      className="block mb-2 font-medium text-gray-700"
                    >
                      Upload Document<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      id={`document-exp-${index}`}
                      name="document"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => handleExperienceChange(index, e)}
                      className="block w-full text-gray-600"
                      required
                    />
                    {exp.document && (
                      <p className="mt-1 text-green-600 text-sm truncate">
                        {exp.document.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addExperience}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded shadow-md transition"
            >
              + Add Another Experience
            </button>
          </section>

          <div className="mt-10 text-center">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-12 rounded shadow-lg transition"
            >
              Submit & Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EducationExperienceForm;
