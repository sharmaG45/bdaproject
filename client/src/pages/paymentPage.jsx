import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { phone, membershipId } = location.state || {};
  const [membership, setMembership] = useState(null);

  useEffect(() => {
    if (membershipId) {
      axios
        .get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/v1/subscription/${membershipId}`
        )
        .then((res) => {
          setMembership(res.data.subscription);
        })
        .catch((err) => console.error("Error fetching subscription", err));
    }
  }, [membershipId]);

  let mobileNumber = phone;
  if (phone?.startsWith("+91")) {
    mobileNumber = phone.slice(3);
  } else if (phone?.startsWith("91") && phone.length === 12) {
    mobileNumber = phone.slice(2);
  }

  useEffect(() => {
    if (!phone || !membershipId) {
      navigate("/");
      return;
    }
  }, [phone, membershipId, navigate]);

  const handlePreviewClick = () => {
    navigate("/previewPage", { state: { phone, membershipId } });
  };

  const handlePayNowClick = async () => {
    if (!membership) return;

    const data = {
      name: "BDA",
      mobileNumber: mobileNumber,
      amount: membership.amount.toString(),
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/create-order`,
        data
      );

      // 👇 Redirecting user to PhonePe payment page
      window.location.href = response.data.url;
    } catch (err) {
      console.log("Error in Payment", err);
    }
  };

  if (!membership) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600 text-lg font-medium">
          Loading membership details...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-100 p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
          Subscription Details
        </h1>

        <div className="border border-gray-200 rounded-lg p-6 mb-8 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {membership.title}
          </h2>
          <p className="text-4xl font-extrabold text-yellow-500">
            {membership.price}
          </p>
          <p className="text-gray-600 mt-2 text-sm text-center">
            Subscription amount
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <button
            onClick={handlePayNowClick}
            className="w-full py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition duration-300 shadow-md"
          >
            Proceed to Payment
          </button>

          <button
            onClick={handlePreviewClick}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
          >
            Preview Subscription Details
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition duration-300 shadow-md"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
