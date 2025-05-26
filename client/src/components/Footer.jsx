import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaClock,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <div className="container text-center text-md-left">
        <div className="row">
          {/* Left side: Contact info */}
          <div className="col-md-6 mb-3">
            <h5>Contact Us</h5>
            <ul className="list-unstyled">
              <li className="mb-2 d-flex align-items-center">
                <FaEnvelope className="me-2" />
                <span>email@example.com</span>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <FaMapMarkerAlt className="me-2" />
                <span>123 Registered Address, Patna, Bihar, India</span>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <FaPhoneAlt className="me-2" />
                <span>+91 98765 43210</span>
              </li>
              <li className="d-flex align-items-center">
                <FaClock className="me-2" />
                <span>Mon - Fri: 9:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Right side: Info & links */}
          <div className="col-md-6">
            <p>© 2025 Bharat Dietetic Association</p>
            <p>
              <a
                href="/terms"
                className="text-white text-decoration-underline mx-2"
              >
                Terms and Conditions
              </a>
              |
              <a
                href="/privacy"
                className="text-white text-decoration-underline mx-2"
              >
                Privacy Policy
              </a>
            </p>
            <p className="mb-0">
              Developed by{" "}
              <a
                href="https://stadoadtech.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-decoration-underline"
              >
                Stado Adtech Patna
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
