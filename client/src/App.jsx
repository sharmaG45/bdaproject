import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PersonalInfoPage from "./pages/personalInfoPage";
import EducationExperienceForm from "./pages/education";
import MembershipForm from "./pages/subscription";
import MobileVerificationForm from "./pages/mobileverification";
import PaymentSuccessPage from "./pages/paymentPage";
import PreviewPage from "./pages/previewPage";
import Success from "./pages/paymentSucess";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Failure() {
  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-2xl font-bold text-red-500">Payment Failed!</h1>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <ToastContainer />
          <Routes>
            <Route path="/" element={<MembershipForm />} />
            <Route path="/basic-info" element={<MobileVerificationForm />} />
            <Route path="/personal-info" element={<PersonalInfoPage />} />
            <Route
              path="/education-info"
              element={<EducationExperienceForm />}
            />
            <Route
              path="/education-info"
              element={<EducationExperienceForm />}
            />
            <Route path="/paymentPage" element={<PaymentSuccessPage />} />
            <Route path="/previewPage" element={<PreviewPage />} />
            <Route path="/payment-success" element={<Success />} />
            <Route path="/payment-failure" element={<Failure />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
