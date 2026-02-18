import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  ChartBarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftIcon,
  UserCircleIcon,
  TrophyIcon,
  EnvelopeIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import FloatingShapes from "../components/common/FloatingShapes";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [services, setServices] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [profileRequests, setProfileRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem("adminToken");
    const admin = localStorage.getItem("adminData");

    if (!token || !admin || admin === "undefined") {
      navigate("/login");
      return;
    }

    try {
      setAdminData(JSON.parse(admin));
      fetchDashboardData(token);
    } catch (error) {
      console.error("Error parsing admin data:", error);
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");
      navigate("/login");
    }
  }, []);

  const fetchDashboardData = async (token) => {
    try {
      const [statsRes, servicesRes, enquiriesRes, profilesRes] =
        await Promise.all([
          axios.get(`${API_URL}/api/dashboard/stats`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/api/services`),
          axios.get(`${API_URL}/api/contact/enquiries`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/api/contact/profile-requests`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

      setStats(statsRes.data || {});
      setServices(Array.isArray(servicesRes.data) ? servicesRes.data : []);
      setEnquiries(Array.isArray(enquiriesRes.data) ? enquiriesRes.data : []);
      setProfileRequests(
        Array.isArray(profilesRes.data) ? profilesRes.data : [],
      );
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Set default empty arrays on error
      setServices([]);
      setEnquiries([]);
      setProfileRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
    navigate("/login");
  };

  const updateEnquiryStatus = async (id, status) => {
    const token = localStorage.getItem("adminToken");
    try {
      await axios.put(
        `${API_URL}/api/contact/enquiries/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      // Refresh enquiries
      const res = await axios.get(`${API_URL}/api/contact/enquiries`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEnquiries(res.data);
    } catch (error) {
      console.error("Error updating enquiry:", error);
    }
  };

  const updateProfileStatus = async (id, status) => {
    const token = localStorage.getItem("adminToken");
    try {
      await axios.put(
        `${API_URL}/api/contact/profile-requests/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      // Refresh profile requests
      const res = await axios.get(`${API_URL}/api/contact/profile-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfileRequests(res.data);
    } catch (error) {
      console.error("Error updating profile request:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-950 text-white">
      <FloatingShapes />

      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-white/10 bg-black/40 backdrop-blur-sm sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-sm text-gray-400">
                  Welcome back, {adminData?.name}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  to="/"
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all border border-white/10"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                  Go Back
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all border border-white/10"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { id: "overview", label: "Overview", icon: ChartBarIcon },
              { id: "services", label: "Services", icon: Cog6ToothIcon },
              { id: "enquiries", label: "Enquiries", icon: EnvelopeIcon },
              {
                id: "profiles",
                label: "Profile Requests",
                icon: UserCircleIcon,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 pb-20">
          {/* Overview Tab */}
          {activeTab === "overview" && stats && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  icon={UserGroupIcon}
                  title="Total Players"
                  value={stats.totalPlayers || 0}
                  color="blue"
                />
                <StatCard
                  icon={DocumentTextIcon}
                  title="Blog Posts"
                  value={stats.totalBlogs || 0}
                  color="green"
                />
                <StatCard
                  icon={Cog6ToothIcon}
                  title="Services"
                  value={(services || []).length}
                  color="purple"
                />
                <StatCard
                  icon={EnvelopeIcon}
                  title="Enquiries"
                  value={(enquiries || []).length}
                  color="red"
                />
              </div>

              {/* Quick Stats */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4">Quick Stats</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Pending Enquiries</p>
                    <p className="text-2xl font-bold text-yellow-500">
                      {
                        (enquiries || []).filter((e) => e.status === "pending")
                          .length
                      }
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">
                      Pending Profile Requests
                    </p>
                    <p className="text-2xl font-bold text-orange-500">
                      {
                        (profileRequests || []).filter(
                          (p) => p.status === "pending",
                        ).length
                      }
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Active Services</p>
                    <p className="text-2xl font-bold text-green-500">
                      {(services || []).filter((s) => s.isActive).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === "services" && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Manage Services</h3>
                <button className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-medium transition-all">
                  Add New Service
                </button>
              </div>
              <div className="space-y-4">
                {(services || []).map((service) => (
                  <div
                    key={service._id}
                    className="bg-white/5 rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold">{service.title}</h4>
                      <p className="text-sm text-gray-400 line-clamp-1">
                        {service.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          service.isActive
                            ? "bg-green-500/20 text-green-500"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {service.isActive ? "Active" : "Inactive"}
                      </span>
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-all">
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                      <button className="p-2 hover:bg-red-500/20 rounded-lg transition-all text-red-500">
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Enquiries Tab */}
          {activeTab === "enquiries" && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-6">Enquiries Management</h3>
              <div className="space-y-4">
                {(enquiries || []).map((enquiry) => (
                  <div key={enquiry._id} className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold">{enquiry.name}</h4>
                        <p className="text-sm text-gray-400">
                          {enquiry.email} • {enquiry.phone}
                        </p>
                        <p className="text-sm text-red-500 mt-1">
                          {enquiry.subject}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          enquiry.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-500"
                            : enquiry.status === "in-progress"
                              ? "bg-blue-500/20 text-blue-500"
                              : enquiry.status === "resolved"
                                ? "bg-green-500/20 text-green-500"
                                : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {enquiry.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">
                      {enquiry.message}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          updateEnquiryStatus(enquiry._id, "in-progress")
                        }
                        className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-500 rounded text-sm transition-all"
                      >
                        In Progress
                      </button>
                      <button
                        onClick={() =>
                          updateEnquiryStatus(enquiry._id, "resolved")
                        }
                        className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-500 rounded text-sm transition-all"
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() =>
                          updateEnquiryStatus(enquiry._id, "closed")
                        }
                        className="px-3 py-1 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 rounded text-sm transition-all"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Profile Requests Tab */}
          {activeTab === "profiles" && (
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-6">Profile Requests</h3>
              <div className="space-y-4">
                {(profileRequests || []).map((profile) => (
                  <div key={profile._id} className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">
                          {profile.basicInfo.fullName}
                        </h4>
                        <p className="text-sm text-gray-400">
                          {profile.basicInfo.email} • {profile.basicInfo.phone}
                        </p>
                        <p className="text-sm text-gray-400">
                          {profile.basicInfo.city},{" "}
                          {profile.basicInfo.nationality}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          profile.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-500"
                            : profile.status === "reviewing"
                              ? "bg-blue-500/20 text-blue-500"
                              : profile.status === "approved"
                                ? "bg-green-500/20 text-green-500"
                                : "bg-red-500/20 text-red-500"
                        }`}
                      >
                        {profile.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                      <div className="bg-white/5 rounded p-2">
                        <p className="text-xs text-gray-400">Position</p>
                        <p className="text-sm font-medium">
                          {profile.careerInfo.playingPosition}
                        </p>
                      </div>
                      <div className="bg-white/5 rounded p-2">
                        <p className="text-xs text-gray-400">Foot</p>
                        <p className="text-sm font-medium">
                          {profile.careerInfo.preferredFoot}
                        </p>
                      </div>
                      <div className="bg-white/5 rounded p-2">
                        <p className="text-xs text-gray-400">Height</p>
                        <p className="text-sm font-medium">
                          {profile.careerInfo.height} cm
                        </p>
                      </div>
                      <div className="bg-white/5 rounded p-2">
                        <p className="text-xs text-gray-400">Experience</p>
                        <p className="text-sm font-medium">
                          {profile.careerInfo.yearsOfExperience} years
                        </p>
                      </div>
                    </div>

                    {profile.careerInfo.currentClub && (
                      <p className="text-sm text-gray-300 mb-2">
                        🏟️ Current Club: {profile.careerInfo.currentClub}
                      </p>
                    )}

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() =>
                          updateProfileStatus(profile._id, "reviewing")
                        }
                        className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-500 rounded text-sm transition-all"
                      >
                        Review
                      </button>
                      <button
                        onClick={() =>
                          updateProfileStatus(profile._id, "approved")
                        }
                        className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-500 rounded text-sm transition-all flex items-center gap-1"
                      >
                        <CheckCircleIcon className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          updateProfileStatus(profile._id, "rejected")
                        }
                        className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded text-sm transition-all flex items-center gap-1"
                      >
                        <XCircleIcon className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon: Icon, title, value, color }) => {
  const colorClasses = {
    blue: "bg-blue-500/20 text-blue-500",
    green: "bg-green-500/20 text-green-500",
    purple: "bg-purple-500/20 text-purple-500",
    red: "bg-red-500/20 text-red-500",
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
      <div
        className={`inline-flex items-center justify-center w-12 h-12 ${colorClasses[color]} rounded-xl mb-3`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-gray-400 text-sm mb-1">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
};

export default AdminDashboard;
