import { useState } from "react";
import axios from "axios";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

export default function MobileVerificationForm() {
  const [formData, setFormData] = useState({
    title: "",
    FirstName: "",
    LastName: "",
    Phone: "",
    email: "",
  });

  const location = useLocation();
  const membershipId = location.state?.membershipId || "";
  const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const handleNext = () => {
    navigate("/personal-info", {
      state: {
        phone: formData.Phone,
        membershipId: membershipId,
      },
    });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateStepOne = () => {
    const { title, FirstName, LastName, Phone, email } = formData;
    if (!title || !FirstName || !LastName || !Phone || !email) {
      toast.success("Please fill all required fields.");
      return false;
    }
    return true;
  };

  const sendOtp = async () => {
    if (!validateStepOne()) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/step-one`,
        formData
      );
      toast.success("OTP sent successfully!");
      setOtpSent(true);
    } catch (err) {
      toast.error("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      toast.success("Please enter OTP");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/verify_otp`,
        {
          Phone: formData.Phone,
          otp,
        }
      );
      toast.success("OTP verified successfully!");
      setOtpSent(false);
      setOtp("");
      setOtpVerified(true);
    } catch (err) {
      toast.alert("OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4 py-12">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-xl p-10">
        <h2 className="text-3xl font-extrabold text-blue-700 mb-10 text-center tracking-wide">
          Secure Your Account with Phone Verification
        </h2>

        <section className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Title
            </label>
            <div className="flex flex-wrap gap-4">
              {["Mr", "Mrs", "Miss", "Dr", "Prof"].map((option) => (
                <label
                  key={option}
                  className="flex items-center space-x-2 cursor-pointer text-gray-800"
                >
                  <input
                    type="radio"
                    name="title"
                    value={option}
                    checked={formData.title === option}
                    onChange={handleChange}
                    disabled={loading}
                    className="form-radio text-blue-600"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                First Name
              </label>
              <input
                type="text"
                name="FirstName"
                value={formData.FirstName}
                onChange={handleChange}
                disabled={loading}
                placeholder=" "
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="LastName"
                value={formData.LastName}
                onChange={handleChange}
                disabled={loading}
                placeholder="Sharma"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Phone Number
              </label>
              <PhoneInput
                country={"in"}
                value={formData.Phone}
                onChange={(phone) =>
                  setFormData((prev) => ({ ...prev, Phone: `+${phone}` }))
                }
                inputProps={{
                  name: "phone",
                  required: true,
                  autoFocus: false,
                  disabled: loading,
                }}
                containerStyle={{ width: "100%" }}
                inputStyle={{
                  width: "100%",
                  height: "50px",
                  fontSize: "16px",
                  borderRadius: "0.5rem",
                  paddingLeft: "48px",
                  borderColor: "#d1d5db",
                }}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                placeholder="abc@gmail.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="mt-8 text-center">
            {!otpVerified ? (
              <button
                onClick={sendOtp}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold py-3 rounded-lg shadow-lg transition"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white font-semibold py-3 rounded-lg shadow-lg transition"
              >
                Next
              </button>
            )}
          </div>
        </section>

        {/* OTP Modal */}
        {otpSent && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
          >
            <div className="bg-white rounded-xl p-8 w-80 max-w-full shadow-2xl">
              <h3 className="text-xl font-semibold text-gray-800 mb-5 text-center">
                Enter OTP
              </h3>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={loading}
                placeholder="6-digit OTP"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center tracking-widest text-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 mb-6 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                onClick={verifyOtp}
                disabled={loading}
                className={`w-full py-3 rounded-lg font-semibold text-white ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                } transition`}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
