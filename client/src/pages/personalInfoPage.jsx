import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { toast } from "react-toastify";

const documentTypes = [
  "Aadhar Card",
  "PAN Card",
  "Passport",
  "Driver's License",
  "Voter ID",
];

const StepTwoForm = ({ initialPhone }) => {
  const location = useLocation();
  const phoneFromRoute = location.state?.phone || "";
  const membershipId = location.state?.membershipId || "";
  const navigate = useNavigate();

  if (!phoneFromRoute) return <Navigate to="/basic-info" replace />;

  const [formData, setFormData] = useState({
    title: "",
    FirstName: "",
    LastName: "",
    Phone: phoneFromRoute,
    email: "",
    DOB: "",
    Gender: "",
    address: "",
    city: "",
    state: "",
    pin: "",
    country: "",
    profileImage: null,
    signature: null,
    documentType: "",
    documentFile: null,
    documentNumber: "",
  });

  const [errors, setErrors] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const phoneToUse = initialPhone || phoneFromRoute;
    if (!phoneToUse) return;

    const fetchUserData = async () => {
      try {
        const encodedPhone = encodeURIComponent(phoneToUse);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/userData/${encodedPhone}`
        );
        if (response.data?.userData) {
          setFormData((prev) => ({ ...prev, ...response.data.userData }));
        } else {
          setErrors("No user data found.");
        }
      } catch (error) {
        setErrors(error.response?.data?.message || "Error fetching data.");
      }
    };

    fetchUserData();
  }, [initialPhone, phoneFromRoute]);

  const [images, setImages] = useState({
    profileImage: null,
    signature: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setImages((prev) => ({
        ...prev,
        [name]: imageUrl,
      }));
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // For Country and State dropdowns
  const handleCountryChange = (val) => {
    setFormData((prev) => ({ ...prev, country: val, state: "" }));
  };
  const handleStateChange = (val) => {
    setFormData((prev) => ({ ...prev, state: val }));
  };

  const validate = () => {
    const requiredFields = [
      "title",
      "FirstName",
      "LastName",
      "Phone",
      "email",
      "country",
      "state",
      "pin",
    ];
    const missing = requiredFields.filter((field) => !formData[field]);

    if (missing.length > 0) {
      setErrors(`Missing required fields: ${missing.join(", ")}`);
      return false;
    }

    // Basic international phone regex (E.164 format)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(formData.Phone)) {
      setErrors("Invalid phone number format.");
      toast.error("Invalid phone number format.");
      return false;
    }

    // If documentType is selected, both documentFile and documentNumber must be provided
    if (!formData.documentType) {
      setErrors("Please select a document type.");
      toast.error("Please select a document type.");
      return false;
    }

    if (!formData.documentNumber) {
      setErrors("Please enter the document number.");
      toast.error("Please enter the document number.");
      return false;
    }

    if (!formData.documentFile) {
      setErrors("Please upload the selected document file.");
      toast.error("Please upload the selected document file.");
      return false;
    }

    setErrors(""); // Clear all errors if validation passes
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const submissionData = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          submissionData.append(key, value);
        }
      });

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/step-two`,
        submissionData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccessMessage(response.data.message);
      setErrors("");
      navigate("/education-info", {
        state: { phone: phoneFromRoute, membershipId },
      });
    } catch (error) {
      setErrors(error.response?.data?.message || "Submission failed.");
      toast.error("Submission failed.");
      setSuccessMessage("");
    }
  };

  const getDocumentNumberLabel = (docType) => {
    switch (docType) {
      case "Aadhar":
        return "Aadhar Number";
      case "PAN Card":
        return "PAN Number";
      case "Passport":
        return "Passport Number";
      case "Driving License":
        return "Driving License Number";
      default:
        return "Document Number";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4 py-12">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-xl p-10">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">
          Personal Information
        </h2>

        {errors && <p className="text-red-600 mb-4 text-sm">{errors}</p>}
        {successMessage && (
          <p className="text-green-600 mb-4 text-sm">{successMessage}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile and Sign Upload */}

          <section>
            <div className="p-6 border border-gray-300 rounded-md grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Profile Image Upload */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Profile Image<span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  name="profileImage"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md"
                  required
                />
                {images.profileImage && (
                  <img
                    src={images.profileImage}
                    alt="Profile Preview"
                    className="w-32 h-32 rounded-full mt-2 object-cover border border-gray-300"
                    required
                  />
                )}
              </div>

              {/* Signature Upload */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Signature<span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  name="signature"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md"
                  required
                />
                {images.signature && (
                  <img
                    src={images.signature}
                    alt="Signature Preview"
                    className="w-full h-24 mt-2 object-contain border border-gray-300"
                    required
                  />
                )}
              </div>
            </div>
          </section>

          {/* Personal Section */}
          <section className="mb-12">
            <h3 className="text-2xl font-bold mb-6 border-b border-gray-300 pb-2 text-gray-800">
              Personal Details
            </h3>
            <div className=" p-6 mb-6  border border-gray-300 rounded-md grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { label: "Title*", name: "title" },
                { label: "First Name*", name: "FirstName" },
                { label: "Last Name*", name: "LastName" },
                { label: "Date of Birth", name: "DOB", type: "date" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    {field.label.includes("*") ? (
                      <>
                        {field.label.replace("*", "")}
                        <span className="text-red-500">*</span>
                      </>
                    ) : (
                      field.label
                    )}
                  </label>
                  <input
                    type={field.type || "text"}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              ))}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Gender
                </label>
                <select
                  name="Gender"
                  value={formData.Gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select</option>
                  {["Male", "Female", "Other"].map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="mb-12">
            <h3 className="text-2xl font-bold mb-6 border-b border-gray-300 pb-2 text-gray-800">
              Contact Information
            </h3>
            <div className="p-6 mb-6  border border-gray-300 rounded-md grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Phone<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="Phone"
                  value={formData.Phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+1234567890"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Email<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="example@email.com"
                />
              </div>
            </div>
          </section>

          {/* Address Section */}
          <section>
            <h3 className="text-2xl font-bold mb-6 border-b border-gray-300 pb-2 text-gray-800">
              Address Details
            </h3>
            <div className="p-6 mb-6  border border-gray-300 rounded-md grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-3">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Street address, P.O. box, etc."
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Country<span className="text-red-500">*</span>
                </label>
                <CountryDropdown
                  value={formData.country}
                  onChange={handleCountryChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  priorityOptions={["IN", "US", "GB"]}
                  blankOptionLabel="Select country"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  State<span className="text-red-500">*</span>
                </label>
                <RegionDropdown
                  country={formData.country}
                  value={formData.state}
                  onChange={handleStateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  blankOptionLabel="Select state"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Pin Code<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="pin"
                  value={formData.pin}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </section>

          {/* Upload Section */}
          <section>
            <h3 className="text-2xl font-bold mb-6 border-b border-gray-300 pb-2 text-gray-800">
              Uploads
            </h3>
            <div>
              <label className="block mb-1 font-medium">
                Document Type<span className="text-red-500">*</span>
              </label>
              <select
                name="documentType"
                value={formData.documentType}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">-- Select Document Type --</option>
                {documentTypes.map((doc) => (
                  <option key={doc} value={doc}>
                    {doc}
                  </option>
                ))}
              </select>
            </div>

            {formData.documentType && (
              <>
                <div className="mt-4">
                  <label className="block mb-1 font-medium">
                    {getDocumentNumberLabel(formData.documentType)}
                  </label>
                  <input
                    type="text"
                    name="documentNumber"
                    value={formData.documentNumber}
                    onChange={handleChange}
                    placeholder={`Enter your ${getDocumentNumberLabel(
                      formData.documentType
                    )}`}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div className="mt-4">
                  <label className="block mb-1 font-medium">
                    Upload {formData.documentType} Document
                  </label>
                  <input
                    type="file"
                    name="documentFile"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}
          </section>

          {/* Submit */}
          <div className="mt-8 text-center">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold py-3 rounded-lg shadow-lg transition"
            >
              Submit & Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StepTwoForm;
