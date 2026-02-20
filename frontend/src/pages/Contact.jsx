import { useState } from "react";
import { EnvelopeIcon, UserIcon } from "@heroicons/react/24/outline";
import FloatingShapes from "../components/common/FloatingShapes";
import PageHeader from "../components/common/PageHeader";
import EnquiryForm from "../components/contact/EnquiryForm";
import ProfileRequestForm from "../components/contact/ProfileRequestForm";
import SuccessModal from "../components/contact/SuccessModal";

const Contact = () => {
  const [activeTab, setActiveTab] = useState("enquiry"); // 'enquiry' or 'profile'
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccess(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-950 text-white">
      <FloatingShapes />

      <main className="relative z-10">
        <PageHeader
          badge="Get In Touch"
          title="Contact Us"
          subtitle="Have questions? Want to join our network? We're here to help you connect and grow."
        />

        <section className="py-20 px-4">
          <div className="max-w-2xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => setActiveTab("enquiry")}
                className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all ${
                  activeTab === "enquiry"
                    ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                    : "bg-white/5 backdrop-blur-sm text-gray-400 hover:bg-white/10"
                }`}
              >
                <EnvelopeIcon className="w-5 h-5 inline-block mr-2" />
                Enquiry Form
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all ${
                  activeTab === "profile"
                    ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                    : "bg-white/5 backdrop-blur-sm text-gray-400 hover:bg-white/10"
                }`}
              >
                <UserIcon className="w-5 h-5 inline-block mr-2" />
                Profile Creation
              </button>
            </div>

            {/* Forms */}
            {activeTab === "enquiry" ? (
              <EnquiryForm onSuccess={handleSuccess} />
            ) : (
              <ProfileRequestForm onSuccess={handleSuccess} />
            )}
          </div>
        </section>
      </main>

      <SuccessModal
        show={showSuccess}
        message={successMessage}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
};

export default Contact;
