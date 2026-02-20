import { useState } from "react";
import { api } from "../../services/api";

const ProfileRequestForm = ({ onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await api.submitProfileRequest(formData);
      onSuccess(
        "Request Submitted! Thank you for your profile creation request. Our team will review your information and contact you within 2-3 business days.",
      );
      // Reset form
      setFormData({
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
    <form
      onSubmit={handleSubmit}
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
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Phone *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
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
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
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
                value={formData.nationality}
                onChange={(e) =>
                  setFormData({ ...formData, nationality: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                placeholder="e.g., American"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">City *</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
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
        <h3 className="text-2xl font-bold mb-6">Career Information</h3>

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Playing Position *
              </label>
              <select
                required
                value={formData.playingPosition}
                onChange={(e) =>
                  setFormData({ ...formData, playingPosition: e.target.value })
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
                value={formData.preferredFoot}
                onChange={(e) =>
                  setFormData({ ...formData, preferredFoot: e.target.value })
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
                value={formData.height}
                onChange={(e) =>
                  setFormData({ ...formData, height: e.target.value })
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
                value={formData.weight}
                onChange={(e) =>
                  setFormData({ ...formData, weight: e.target.value })
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
                value={formData.currentClub}
                onChange={(e) =>
                  setFormData({ ...formData, currentClub: e.target.value })
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
                value={formData.yearsOfExperience}
                onChange={(e) =>
                  setFormData({
                    ...formData,
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
              value={formData.achievements}
              onChange={(e) =>
                setFormData({ ...formData, achievements: e.target.value })
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
              value={formData.videoLink}
              onChange={(e) =>
                setFormData({ ...formData, videoLink: e.target.value })
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
  );
};

export default ProfileRequestForm;
