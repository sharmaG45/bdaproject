import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

const BASE_URL = "http://localhost:3000"; // your backend base URL
const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const transactionId = searchParams.get("transactionId");
  const phone = searchParams.get("phone");

  const rawPhone = searchParams.get("phone") || ""; // e.g. "+919097989707"
  const cleaned = rawPhone.trim(); // no spaces
  const fullPhone = cleaned.startsWith("+") ? cleaned : `+${cleaned}`; // ensure +91 prefix

  // encode ONLY when building the URL:
  const phoneParam = encodeURIComponent(fullPhone);

  const shubhamPhone = decodeURIComponent(phoneParam);
  console.log("Success Payment Page Phone Number", shubhamPhone);

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!phone) return;

    axios
      .get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/user-details/${encodeURIComponent(phoneParam)}`
      )
      .then((res) => {
        setUserData(res.data.userData);
      })
      .catch((err) => {
        console.error("Failed to fetch user data:", err);
      });
  }, [phoneParam]);

  console.log("User Details", userData);

  if (!transactionId) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600 font-semibold text-xl">Invalid Access</p>
      </div>
    );
  }

  if (!phone) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-center text-red-600 font-semibold text-lg">
          No preview data available.
        </p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg font-medium">Loading...</p>
      </div>
    );
  }

  const {
    FirstName,
    LastName,
    DOB,
    Gender,
    email,
    address,
    city,
    state,
    country,
    pin,
    title,
    education = [],
    experience = [],
    profileImage,
    signature,
    documents = [], // assuming documents is an array of { name, url }
  } = userData;

  const formattedDOB = DOB
    ? new Date(DOB).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  const getFullUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http") || url.startsWith("data:")) return url;
    return `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-lg p-10 max-w-md w-full text-center border border-green-400">
        <div className="text-green-600 text-6xl mb-4">
          <i className="fas fa-check-circle"></i>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Payment Successful
        </h2>
        <p className="text-gray-600 mb-4">
          Thank you for your payment. Your transaction was completed
          successfully.
        </p>

        <div className="bg-gray-100 rounded p-4 text-sm text-left text-gray-700 mb-6">
          <p>
            <span className="font-semibold">Transaction ID:</span>{" "}
            <span className="text-blue-700">{transactionId}</span>
          </p>
        </div>
      </div>

      <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center">
        <div className="max-w-3xl w-full bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
           Membership Details 
          </h2>

          <div className="flex gap-10">
            {/* Left side - Info */}
            <div className="flex-1 space-y-6 text-gray-800">
              <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
                <p className="text-lg font-semibold mb-1">Title</p>
                <p>{title || "N/A"}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-lg font-semibold mb-1">Name</p>
                  <p>
                    {FirstName} {LastName}
                  </p>
                </div>
                <div>
                  <p className="text-lg font-semibold mb-1">DOB</p>
                  <p>{formattedDOB}</p>
                </div>
                <div>
                  <p className="text-lg font-semibold mb-1">Gender</p>
                  <p>{Gender}</p>
                </div>
                <div>
                  <p className="text-lg font-semibold mb-1">Email</p>
                  <p>{email}</p>
                </div>
                <div>
                  <p className="text-lg font-semibold mb-1">Phone</p>
                  <p>{phone}</p>
                </div>
                {/* <div>
                  <p className="text-lg font-semibold mb-1">Membership ID</p>
                  <p>{membershipId}</p>
                </div> */}
              </div>

              <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
                <p className="text-lg font-semibold mb-1">Address</p>
                <p>
                  {address}, {city}, {state}, {pin}, {country}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 border-b pb-1">
                  Education
                </h3>
                {education.length === 0 ? (
                  <p className="text-gray-500 italic">No education details</p>
                ) : (
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {education.map((edu, idx) => (
                      <li key={idx}>
                        {edu.degree} from {edu.institution} ({edu.year})
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3 border-b pb-1">
                  Experience
                </h3>
                {experience.length === 0 ? (
                  <p className="text-gray-500 italic">No experience details</p>
                ) : (
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {experience.map((exp, idx) => (
                      <li key={idx}>
                        {exp.role} at {exp.company} ({parseInt(exp.duration)}{" "}
                        year
                        {parseInt(exp.duration) > 1 ? "s" : ""})
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Right side - Images and Documents */}
            <div className="flex flex-col items-center space-y-6 w-48">
              {profileImage && (
                <div className="text-center">
                  <p className="text-lg font-semibold mb-2">Profile Image</p>
                  <img
                    src={getFullUrl(profileImage)}
                    alt="Profile"
                    className="w-28 h-28 rounded-lg border object-cover mx-auto"
                  />
                </div>
              )}

              {signature && (
                <div className="text-center">
                  <p className="text-lg font-semibold mb-2">Signature</p>
                  <img
                    src={getFullUrl(signature)}
                    alt="Signature"
                    className="w-40 h-auto border rounded mx-auto"
                  />
                </div>
              )}

              {documents.length > 0 && (
                <div className="w-full">
                  <h3 className="text-xl font-semibold mb-3 border-b pb-1 text-center">
                    Uploaded Documents
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-blue-700 underline cursor-pointer">
                    {documents.map((doc, idx) => (
                      <li key={idx}>
                        <a
                          href={getFullUrl(doc.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {doc.name || `Document ${idx + 1}`}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
