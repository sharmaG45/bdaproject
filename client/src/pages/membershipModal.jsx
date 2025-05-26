import React from "react";
import { useNavigate } from "react-router-dom";

const MembershipModal = ({ membership, onClose }) => {
  const navigate = useNavigate();
  if (!membership) return null;

  const handleNext = () => {
    navigate("/basic-info", {
      state: {
        membershipId: membership.id,
      },
    });
  };

  return (
    // Overlay
    <div
      className="fixed inset-0 flex justify-center items-center p-4 z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
      onClick={onClose}
    >
      {/* Modal content */}
      <div
        className="max-w-4xl w-full bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto relative p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          aria-label="Close modal"
          className="absolute top-4 right-5 text-3xl font-bold text-gray-500 hover:text-red-500 transition-colors"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="mb-4 text-2xl font-semibold text-gray-900">
          {membership.title}
        </h2>

        {/* Eligibility */}
        <h4 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-2">
          Eligibility
        </h4>
        <p className="mb-4 text-gray-700">{membership.eligibility}</p>

        {/* Requirements */}
        {membership.requirements && membership.requirements.length > 0 && (
          <>
            <h4 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-2">
              Requirements
            </h4>
            <ul className="list-disc list-inside mb-4 text-gray-700">
              {membership.requirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </>
        )}

        {/* Documents */}
        {membership.documents && membership.documents.length > 0 && (
          <>
            <h4 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-2">
              Documents
            </h4>
            <ul className="list-disc list-inside mb-4 text-gray-700">
              {membership.documents.map((doc, i) => (
                <li key={i}>{doc}</li>
              ))}
            </ul>
          </>
        )}

        {/* Benefits */}
        <h4 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-2">
          Benefits
        </h4>
        <ul className="list-disc list-inside mb-4 text-gray-700">
          {membership.benefits.map((benefit, i) => (
            <li key={i}>{benefit}</li>
          ))}
        </ul>

        {/* Additional Benefits */}
        {membership.additionalBenefits &&
          membership.additionalBenefits.length > 0 && (
            <>
              <h4 className="text-lg font-semibold border-b border-gray-300 pb-1 mb-2">
                Additional Benefits
              </h4>
              <ul className="list-disc list-inside mb-4 text-gray-700">
                {membership.additionalBenefits.map((benefit, i) => (
                  <li key={i}>{benefit}</li>
                ))}
              </ul>
            </>
          )}

        {/* Price */}
        <h4 className="text-lg font-semibold mt-6 mb-4">
          Price: <span className="text-primary">{membership.price}</span>
        </h4>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleNext}
            className="btn btn-primary px-5 py-2 font-semibold transition hover:bg-blue-700"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-outline-secondary px-5 py-2 font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default MembershipModal;
