import { useState } from "react";
import axios from "axios";
import {
  EnvelopeIcon,
  PhoneIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import FloatingShapes from "../components/common/FloatingShapes";
import PageHeader from "../components/common/PageHeader";

const Contact = () => {
  const [activeTab, setActiveTab] = useState("enquiry"); // 'enquiry' or 'profile'
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Enquiry form state
  const [enquiryForm, setEnquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  // Profile creation form state
  const [profileForm, setProfileForm] = useState({
    // Basic Information
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    nationality: "",
    city: "",
    // Career Information
    playingPosition: "",
    preferredFoot: "",
    height: "",
    weight: "",
    currentClub: "",
    yearsOfExperience: "",
    achievements: "",
    videoLink: "",
  });

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
      const response = await axios.post(
        `${apiUrl}/api/contact/enquiry`,
        enquiryForm,
      );
      setSuccessMessage(response.data.message);
      setShowSuccess(true);
      // Reset form
      setEnquiryForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to submit enquiry. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";
      const response = await axios.post(
        `${apiUrl}/api/contact/profile-request`,
        profileForm,
      );
      setSuccessMessage(
        "Request Submitted! Thank you for your profile creation request. Our team will review your information and contact you within 2-3 business days.",
      );
      setShowSuccess(true);
      // Reset form
      setProfileForm({
        fullName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        nationality: "",
        city: "",
        playingPosition: "",
        preferredFoot: "",
        height: "",
        weight: "",
        currentClub: "",
        yearsOfExperience: "",
        achievements: "",
        videoLink: "",
      });
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to submit profile request. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-950 text-white">
      <FloatingShapes />

      <div className="relative z-10">
        <PageHeader
          badge="Get In Touch"
          title="Contact Us"
          subtitle="Have questions? Want to join our network? We're here to help you connect and grow."
        />

        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
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

            {/* Enquiry Form */}
            {activeTab === "enquiry" && (
              <form
                onSubmit={handleEnquirySubmit}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 space-y-6"
              >
                <h3 className="text-2xl font-bold mb-6">Send Us a Message</h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={enquiryForm.name}
                      onChange={(e) =>
                        setEnquiryForm({ ...enquiryForm, name: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                      placeholder="Your Name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={enquiryForm.email}
                      onChange={(e) =>
                        setEnquiryForm({
                          ...enquiryForm,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={enquiryForm.phone}
                      onChange={(e) =>
                        setEnquiryForm({
                          ...enquiryForm,
                          phone: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={enquiryForm.subject}
                      onChange={(e) =>
                        setEnquiryForm({
                          ...enquiryForm,
                          subject: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                      placeholder="How can we help?"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={enquiryForm.message}
                    onChange={(e) =>
                      setEnquiryForm({
                        ...enquiryForm,
                        message: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all shadow-lg shadow-red-500/30 hover:shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}

            {/* Profile Creation Form */}
            {activeTab === "profile" && (
              <form
                onSubmit={handleProfileSubmit}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 space-y-8"
              >
                {/* Basic Information */}
                <div>
                  <h3 className="text-2xl font-bold mb-6">Basic Information</h3>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={profileForm.fullName}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              fullName: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={profileForm.email}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              email: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={profileForm.phone}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              phone: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Date of Birth *
                        </label>
                        <input
                          type="date"
                          required
                          value={profileForm.dateOfBirth}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              dateOfBirth: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Nationality *
                        </label>
                        <input
                          type="text"
                          required
                          value={profileForm.nationality}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              nationality: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                          placeholder="e.g., American"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          required
                          value={profileForm.city}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              city: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                          placeholder="Your City"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Career Information */}
                <div>
                  <h3 className="text-2xl font-bold mb-6">
                    Career Information
                  </h3>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Playing Position *
                        </label>
                        <select
                          required
                          value={profileForm.playingPosition}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              playingPosition: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                        >
                          <option value="" className="bg-gray-900">
                            Select Position
                          </option>
                          <option value="Goalkeeper" className="bg-gray-900">
                            Goalkeeper
                          </option>
                          <option value="Defender" className="bg-gray-900">
                            Defender
                          </option>
                          <option value="Midfielder" className="bg-gray-900">
                            Midfielder
                          </option>
                          <option value="Forward" className="bg-gray-900">
                            Forward
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Preferred Foot *
                        </label>
                        <select
                          required
                          value={profileForm.preferredFoot}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              preferredFoot: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                        >
                          <option value="" className="bg-gray-900">
                            Select Foot
                          </option>
                          <option value="Right" className="bg-gray-900">
                            Right
                          </option>
                          <option value="Left" className="bg-gray-900">
                            Left
                          </option>
                          <option value="Both" className="bg-gray-900">
                            Both
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Height (cm) *
                        </label>
                        <input
                          type="number"
                          required
                          value={profileForm.height}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              height: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                          placeholder="180"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Weight (kg) *
                        </label>
                        <input
                          type="number"
                          required
                          value={profileForm.weight}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              weight: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                          placeholder="75"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Current Club
                        </label>
                        <input
                          type="text"
                          value={profileForm.currentClub}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              currentClub: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                          placeholder="e.g., FC Barcelona"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Years of Experience *
                        </label>
                        <input
                          type="number"
                          required
                          value={profileForm.yearsOfExperience}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              yearsOfExperience: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                          placeholder="5"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Achievements
                      </label>
                      <textarea
                        rows={4}
                        value={profileForm.achievements}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            achievements: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all resize-none"
                        placeholder="List your achievements, awards, or notable accomplishments..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Video Link (YouTube, Vimeo, etc.)
                      </label>
                      <input
                        type="url"
                        value={profileForm.videoLink}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            videoLink: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all shadow-lg shadow-red-500/30 hover:shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit Profile Request"}
                </button>
              </form>
            )}
          </div>
        </section>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-b from-gray-900 via-black to-gray-950 border border-white/10 rounded-2xl p-8 max-w-md w-full relative shadow-2xl shadow-black/20">
            <button
              onClick={() => setShowSuccess(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircleIcon className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Success!</h3>
              <p className="text-gray-300 mb-6">{successMessage}</p>
              <button
                onClick={() => setShowSuccess(false)}
                className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all shadow-lg shadow-red-500/30"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;
