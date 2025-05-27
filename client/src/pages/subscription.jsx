import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MembershipModal from "./membershipModal";

const MembershipForm = () => {
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const memberships = [
    {
      id: "AM",
      title: "Associate Membership (AM)",
      eligibility: `
A person is eligible for associate membership if he or she is interested in dietetics and believes in and supports the aims and objectives of the association.
Doctors, Medical laboratory and life science professionals; trauma, surgical, and anaesthesia related technology professionals; burn care professionals; physiotherapy professionals; ophthalmic sciences professionals; occupational therapy professionals; community care and behavioural health science professionals; medical radiology professionals; health informative professionals, etc. are also encouraged to be a part of the membership.
He or she has a science graduate or postgraduate degree in the concerned field.
Anyone engaged in the teaching profession.
`,
      requirements: [
        "Soft copies of all marksheet/degree of academic qualifications, internships, or training and updated curriculum vitae (CV).",
        "Details of your work experience.",
        "A soft copy of a passport-size recent photograph in colour.",
        "Credit, debit card, UPI, or net banking details are needed to complete the payment.",
      ],
      benefits: [
        "A downloadable official BDA Certificate of Membership.",
        "Use of the website for member activities and e-learning.",
        "Reduced subscription rates to conferences, seminars, workshops, symposiums, courses, and journals.",
        "Reduced entrance fees to international, national, and affiliated regional meetings by BDA.",
        "Regular e-newsletters on various topics pertaining to dietetics and nutrition.",
      ],
      additionalBenefits: [
        "Associate Members shall be entitled to participate in all activities of the BDA.",
        "Award of appreciation to individuals who have made extraordinary contributions to the hospital, research, and health administration.",
      ],
      price: "₹ 2000 /-",
    },
    {
      id: "RD",
      title: "Registered Dietician (RD)",
      eligibility: `
Lifetime membership is mandatory for registered dietician membership.
A person is eligible for RD membership if he or she has the following qualifications:
M.Sc. Dietetics / M.Sc. Nutrition / M.Sc. Dietetics & Nutrition / M.Sc. Nutrition and Dietetics / M.Sc. Dietetics & Food Service Management / M.Sc. Clinical Nutrition and Dietetics / M.Sc. Food, Nutrition and Dietetics / M.Sc. Food Science and Nutrition / M.Sc. Food and Nutrition from a recognized university plus six months of internship and two years of experience in a hospital as a full-time dietician (clinical only).
The certificate of qualification shall be verified and approved by the registration committee. The membership shall be available on a one-time payment.
Only registered dieticians can organise dietetic internship programmes under them.
`,
      requirements: [
        "Soft copies of all marksheet/degree of academic qualifications, internships or training, and updated curriculum vitae (CV).",
        "Details of your work experience.",
        "A soft copy of a passport-size recent photograph in colour.",
        "Credit, debit card, UPI, or net banking details are needed to complete the payment.",
      ],
      benefits: [
        "A downloadable official BDA Certificate of Membership.",
        "Use of the website for member activities and e-learning.",
        "Reduced subscription rates to conferences, seminars, workshops, symposiums, courses and journals.",
        "Reduced entrance fees to international, national, and affiliated regional meetings by BDA.",
        "Regular e-newsletters on various topics pertaining to dietetics and nutrition.",
      ],
      additionalBenefits: [
        "Apply for the Centre of Excellence and Fellowship in the Dietetics and Nutrition field.",
        "RD Members shall be entitled to participate in all activities of the BDA.",
        "RD Members will be eligible to be an officer of the BDA.",
        "Award of appreciation to individuals who have made extraordinary contributions to the hospital, research, and health administration.",
      ],
      price: "₹ 2500 /-",
    },
    {
      id: "HM",
      title: "Honorary Membership (HM)",
      eligibility:
        "Any person interested in the field of dietetics and nutrition who believes in and supports the aims and objectives of the association is granted honorary membership after consideration and confirmation by the NEC.",
      price: "₹0 /-",
      documents: [
        "Curriculum Vitae (CV)",
        "A soft copy of a passport-size recent photograph in colour",
      ],
      benefits: ["Recognition by the NEC", "No membership fee applicable"],
    },
    {
      id: "SM",
      title: "Student Membership (SM)",
      eligibility: `Any student pursuing Graduation, Postgraduation, Diploma or Postgraduate Diploma (after B.Sc.) or Degree or Postgraduate Degree in Dietetics / Nutrition / Dietetics & Nutrition / Nutrition and Dietetics / Dietetics & Food Service Management / Clinical Nutrition and Dietetics / Food Nutrition and Dietetics / Food Science and Nutrition / Food and Nutrition / Food Technology & Nutrition and their specialization from a recognized university or its equivalent in other countries, shall be eligible for student membership in the association.
The membership shall be valid for a year, which has to be renewed every year.
After course completion the member can avail of a life membership.`,
      price: "₹ 500 /-",
      documents: [
        "Soft copies of all marksheet/degree of academic qualifications, internships, or training.",
        "Details of your work experience, if any.",
        "A soft copy of a passport-size recent photograph in colour.",
        "Credit, debit card, UPI, or net banking details are needed to complete the payment.",
      ],
      benefits: [
        "A downloadable official BDA Certificate of Membership.",
        "Use of the website for member activities and e-learning.",
        "Reduced subscription rates to conferences, seminars, workshops, symposiums, courses, and journals.",
        "Reduced entrance fees to international, national, and affiliated regional meetings by BDA.",
        "Regular e-newsletters on various topics pertaining to dietetics and nutrition.",
      ],
      additionalBenefits: [
        "Apply for the Scholarship in the Dietetics and Nutrition field.",
        "Student Members shall be entitled to participate in all activities of the BDA.",
        "Award of appreciation to the individuals who have made extraordinary contributions.",
      ],
    },
    {
      id: "OM",
      title: "Overseas Membership (OM)",
      eligibility: `It shall consist of individuals from countries outside India who meet the same qualifications of RD Member, Life Member, Associate Member and Student Member.
The process of availing of membership shall be the same as for domestic membership.`,
      price: "₹ 10,000 /-",
      documents: [
        "Soft copies of all marksheet/degree of academic qualifications, internships or training, and updated curriculum vitae (CV).",
        "Details of your work experience, if any.",
        "A soft copy of a passport-size recent photograph in colour.",
        "Credit, debit card, UPI, or net banking details are needed to complete the payment.",
      ],
      benefits: [
        "A downloadable official BDA Certificate of Membership.",
        "Use of the website for member activities and e-learning.",
        "Reduced subscription rates to conferences, seminars, workshops, symposiums, courses, and journals.",
        "Reduced entrance fees to international, national, and affiliated regional meetings by BDA.",
        "Regular e-newsletters on various topics pertaining to dietetics and nutrition.",
      ],
      additionalBenefits: [
        "Apply for the Centre of Excellence and Fellowship in the Dietetics and Nutrition field.",
        "The same additional benefits of RD Members, Life Members, Associate Members, and Student Members (as described above) shall be entitled to Overseas Members to participate in all activities of the BDA.",
        "Award of appreciation to individuals who have made extraordinary contributions to the hospital, research and health administration.",
      ],
    },
    {
      id: "IM",
      title: "Institutional Membership (IM)",
      eligibility: `Any non-government organization (NGO) or institution teaching or disseminating education in dietetics, nutrition, food technology, or food and nutrition science that the association recognizes is eligible to become an institutional member by paying a one-time entry fee to Head Office, BDA.`,
      price: "₹ 2,00,000/-",
      documents: [
        "Soft copies of all marksheet/degree of academic qualifications, internships or training, and updated curriculum vitae (CV) of faculty members.",
        "Details of faculty work experience.",
        "A soft copy of a passport-size recent photograph of faculty members in colour.",
        "Credit, debit card, UPI, or net banking details are needed to complete the payment.",
      ],
      benefits: [
        "A downloadable official BDA Certificate of Membership.",
        "Use of the website for member activities and e-learning.",
        "Reduced subscription rates to conferences, seminars, workshops, symposiums, courses, and journals.",
        "Reduced entrance fees to international, national, and affiliated regional meetings by BDA.",
        "Regular e-newsletters on various topics pertaining to dietetics and nutrition.",
      ],
      additionalBenefits: [
        "Institutional Members shall be entitled to participate in all activities of the BDA.",
        "Award of appreciation to individuals who have made extraordinary contributions to the hospital, research, and health administration.",
      ],
    },
    {
      id: "LM",
      title: "Life Member (LM).",
      eligibility: `A person is eligible for life membership if he or she has the minimum educational qualifications:
M.Sc. Dietetics / M.Sc. Nutrition / M.Sc. Dietetics & Nutrition / M.Sc. Nutrition and Dietetics / M.Sc. Dietetics & Food Service Management / M.Sc. Clinical Nutrition and Dietetics / M.Sc. Food, Nutrition and Dietetics / M.Sc. Food Science and Nutrition / M.Sc. Food and Nutrition from a recognized university plus six months of internship.
​After qualifying the eligibility criteria for Registered Dietician (RD), the life member can avail of RD membership.`,
      price: "	₹ 2500 /-",
      documents: [
        "Soft copies of all marksheet/degree of academic qualifications, internships, or training and updated curriculum vitae (CV).",
        "Details of your work experience.",
        "A soft copy of a passport-size recent photograph in colour.",
        "Credit, debit card, UPI, or net banking details are needed to complete the payment.",
      ],
      benefits: [
        "A downloadable official BDA Certificate of Membership.",
        "Use of the website for member activities and e-learning.",
        "Reduced subscription rates to conferences, seminars, workshops, symposiums, courses, and journals.",
        "Reduced entrance fees to international, national, and affiliated regional meetings by BDA.",
        "Regular e-newsletters on various topics pertaining to dietetics and nutrition.",
      ],
      additionalBenefits: [
        "Apply for the Centre of Excellence and Fellowship in the Dietetics and Nutrition field.",
        "Life Members shall be entitled to participate in all activities of the BDA.",
        "Life Members will be eligible to be officers of the BDA.",
        "Award of appreciation to the individuals who have made extraordinary contributions to the hospital, research, and health administration.",
      ],
    },
    {
      id: "CM",
      title: "Corporate Membership (CM)",
      eligibility: `Any non-government organization (NGO) or institution teaching or disseminating education in dietetics, nutrition, food technology, or food and nutrition science that the association recognizes is eligible to become an institutional member by paying a one-time entry fee to Head Quarters.`,
      price: "₹ 2,00,000/-",
      documents: [
        "Soft copies of the registration certificate.",
        "A soft copy of a passport-size photograph of Director/Proprietor.",
        "Name of Company/Organization.",
        "CIN/Registration No.",
        "Head Office Address.",
      ],
      benefits: [
        "A downloadable official BDA Corporate Membership Certificate.",
        "Use of the BDA name and logo for activities.",
        "Branding and visibility on the website.",
        "A platform to collaborate with the dieticians and use their expertise in research and development.",
        "Regular e-newsletters on various topics pertaining to dietetics and nutrition.",
      ],
    },
  ];

  const handleSelect = (membership) => {
    setSelectedMembership(membership);
    setShowModal(true);
  };

  const containerStyle = {
    maxWidth: "1024px",
    margin: "0 auto",
    padding: "16px",
  };

  const titleStyle = {
    color: "#374151",
    marginBottom: "24px",
    fontSize: "18px",
    fontWeight: "600",
    textAlign: "center",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "32px",
    marginBottom: "20px",
  };

  const cardBaseStyle = {
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    overflow: "hidden",
    marginBottom: "20px",
    padding: "10px 10px 0 10px",
    border: "1px solid #e5e7eb",
  };

  const headerBaseStyle = {
    padding: "12px",
    fontWeight: "600",
    fontSize: "12px",
    textAlign: "center",
    textTransform: "uppercase",
    color: "#fff",
  };

  const priceBaseStyle = {
    padding: "32px",
    fontSize: "28px",
    textAlign: "center",
    color: "#fff",
  };

  const infoStyle = {
    backgroundColor: "#fff",
    textAlign: "center",
    padding: "24px",
  };

  const buttonStyle = {
    marginTop: "8px",
    backgroundColor: "#2563eb",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>ONLINE MEMBERSHIP APPLICATION SYSTEM (OMAS)</h1>

      <div style={gridStyle}>
        {memberships.map((membership) => (
          <div key={membership.id} style={cardBaseStyle}>
            <div
              style={{
                ...headerBaseStyle,
                backgroundColor:
                  membership.id === "AM"
                    ? "#56bebc"
                    : membership.id === "RD"
                    ? "#34a268"
                    : membership.id === "HM"
                    ? "#6a7a7a"
                    : membership.id === "SM"
                    ? "#faa03a"
                    : membership.id === "OM"
                    ? "#9a54ff"
                    : membership.id === "IM"
                    ? "#56bebc"
                    : membership.id === "CM"
                    ? "#5098d1"
                    : membership.id === "LM"
                    ? "#f7659f"
                    : "#d4a3ff",
              }}
            >
              {membership.title}
            </div>
            <div
              style={{
                ...priceBaseStyle,
                backgroundColor:
                  membership.id === "AM"
                    ? "#34a2a2"
                    : membership.id === "RD"
                    ? "#059669"
                    : membership.id === "HM"
                    ? "#6b7280"
                    : membership.id === "SM"
                    ? "#d97706"
                    : membership.id === "OM"
                    ? "#9333ea"
                    : membership.id === "IM"
                    ? "#03eccc"
                    : membership.id === "CM"
                    ? "#4aaefc"
                    : membership.id === "LM"
                    ? "#d15083"
                    : "#dc2626",
              }}
            >
              {membership.price}
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "normal",
                  marginTop: "4px",
                }}
              >
                (Incl. 18% GST)
              </div>
            </div>
            <div style={infoStyle}>
              <button
                onClick={() => handleSelect(membership)}
                style={{
                  padding: "8px 16px",
                  background: "#1976d2",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                }}
              >
                View Details & Apply
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && selectedMembership && (
        <MembershipModal
          membership={selectedMembership}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default MembershipForm;
