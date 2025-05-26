import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const transactionId = searchParams.get("transactionId");

  if (!transactionId) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600 font-semibold text-xl">Invalid Access</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
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

        <button
          onClick={() => navigate("/")}
          className="mt-2 px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default Success;
