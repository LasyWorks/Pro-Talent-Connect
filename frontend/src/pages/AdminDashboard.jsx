import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";
import {
  ChartBarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  EnvelopeIcon,
  UserCircleIcon,
  TrophyIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
  LockClosedIcon,
  ArrowLeftIcon,
  ArrowRightOnRectangleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import FloatingShapes from "../components/common/FloatingShapes";
import BlogManagement from "../components/blogs/BlogManagement";
import PlayerManagement from "../components/admin/PlayerManagement";
import ServiceManagement from "../components/admin/ServiceManagement";
import AboutManagement from "../components/admin/AboutManagement";
import AdminManagement from "../components/admin/AdminManagement";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [adminData, setAdminData] = useState(null);
  const [enquiries, setEnquiries] = useState([]);
  const [profileRequests, setProfileRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Change Password state
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);
  const [changingPassword, setChangingPassword] = useState(false);

  const isSuperAdmin = adminData?.role === "Super Admin";

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const admin = localStorage.getItem("adminData");

    if (!token || !admin || admin === "undefined") {
      navigate("/login");
      return;
    }

    try {
      setAdminData(JSON.parse(admin));
    } catch (err) {
      console.error("Error parsing admin data:", err);
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");
      navigate("/login");
    }
  }, [navigate]);

  // Sync auth state across tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "adminToken") {
        if (!e.newValue) {
          // Token removed in another tab → redirect to login
          navigate("/login");
        }
      }
      if (e.key === "adminData") {
        if (e.newValue && e.newValue !== "undefined") {
          try {
            setAdminData(JSON.parse(e.newValue));
          } catch { /* ignore parse errors */ }
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [navigate]);

  const fetchDashboardData = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError(null);

      const [statsRes, enquiriesRes, profilesRes] = await Promise.all([
        api.getDashboardStats({ signal }),
        api.getEnquiries({ signal }),
        api.getProfileRequests({ signal }),
      ]);

      if (!signal.aborted) {
        setStats(statsRes.data || {});
        const enqData = enquiriesRes.data?.enquiries || enquiriesRes.data;
        setEnquiries(Array.isArray(enqData) ? enqData : []);
        const profData = profilesRes.data?.requests || profilesRes.data;
        setProfileRequests(Array.isArray(profData) ? profData : []);
      }
    } catch (err) {
      if (!signal.aborted) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
        setEnquiries([]);
        setProfileRequests([]);
      }
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    if (adminData) {
      fetchDashboardData(abortController.signal);
    }
    return () => abortController.abort();
  }, [adminData, fetchDashboardData]);

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminData");
      navigate("/login");
    }
  };

  const updateEnquiryStatus = async (id, status) => {
    try {
      await api.updateEnquiryStatus(id, status);
      const res = await api.getEnquiries();
      const enqData = res.data?.enquiries || res.data;
      setEnquiries(Array.isArray(enqData) ? enqData : []);
    } catch (err) {
      console.error("Error updating enquiry:", err);
    }
  };

  const updateProfileStatus = async (id, status) => {
    try {
      await api.updateProfileStatus(id, status);
      // If approved, refetch will show updated status
      const res = await api.getProfileRequests();
      const profData = res.data?.requests || res.data;
      setProfileRequests(Array.isArray(profData) ? profData : []);
    } catch (err) {
      console.error("Error updating profile request:", err);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    try {
      setChangingPassword(true);
      await api.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordSuccess("Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  // Tab definitions - role-based visibility
  const tabs = [
    { id: "overview", label: "Overview", icon: ChartBarIcon },
    { id: "players", label: "Players", icon: TrophyIcon },
    { id: "blogs", label: "Blogs", icon: DocumentTextIcon },
    { id: "services", label: "Services", icon: Cog6ToothIcon },
    { id: "about", label: "About", icon: InformationCircleIcon },
    { id: "enquiries", label: "Enquiries", icon: EnvelopeIcon },
    { id: "profiles", label: "Profile Requests", icon: UserCircleIcon },
    ...(isSuperAdmin ? [
      { id: "admins", label: "Admins", icon: ShieldCheckIcon },
    ] : []),
    { id: "settings", label: "Settings", icon: LockClosedIcon },
  ];

  if (loading && !stats) {
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
                  {isSuperAdmin && (
                    <span className="ml-2 px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs font-medium">
                      Super Admin
                    </span>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  to="/"
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all border border-white/10 text-sm"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  Go Back
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all border border-white/10 text-sm"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap text-sm ${
                    activeTab === tab.id
                      ? "bg-red-500 text-white shadow-lg shadow-red-500/30"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 pb-20">

          {/* ─── Overview ─── */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={TrophyIcon} title="Total Players" value={stats?.totalPlayers || 0} color="blue" />
                <StatCard icon={DocumentTextIcon} title="Blog Posts" value={stats?.totalBlogs || 0} color="green" />
                <StatCard icon={EnvelopeIcon} title="Enquiries" value={enquiries.length} color="red" />
                <StatCard icon={UserCircleIcon} title="Profile Requests" value={profileRequests.length} color="purple" />
              </div>

              {/* Quick Stats */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Pending Enquiries</p>
                    <p className="text-2xl font-bold text-yellow-500">
                      {enquiries.filter((e) => e.status === "pending").length}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Pending Profile Requests</p>
                    <p className="text-2xl font-bold text-orange-500">
                      {profileRequests.filter((p) => p.status === "pending").length}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Published Blogs</p>
                    <p className="text-2xl font-bold text-green-500">
                      {stats?.totalBlogs || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recent Activity Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Enquiries */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">Recent Enquiries</h3>
                    <button onClick={() => setActiveTab("enquiries")} className="text-red-500 text-sm hover:text-red-400">
                      View All →
                    </button>
                  </div>
                  <div className="space-y-3">
                    {enquiries.slice(0, 3).map((e) => (
                      <div key={e._id} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">{e.name}</p>
                          <p className="text-xs text-gray-500 truncate">{e.subject}</p>
                        </div>
                        <span className={`shrink-0 ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                          e.status === "pending" ? "bg-yellow-500/20 text-yellow-500" :
                          e.status === "resolved" ? "bg-green-500/20 text-green-500" :
                          "bg-blue-500/20 text-blue-500"
                        }`}>
                          {e.status}
                        </span>
                      </div>
                    ))}
                    {enquiries.length === 0 && <p className="text-gray-500 text-sm">No enquiries yet.</p>}
                  </div>
                </div>

                {/* Recent Profile Requests */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold">Recent Profiles</h3>
                    <button onClick={() => setActiveTab("profiles")} className="text-red-500 text-sm hover:text-red-400">
                      View All →
                    </button>
                  </div>
                  <div className="space-y-3">
                    {profileRequests.slice(0, 3).map((p) => (
                      <div key={p._id} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">{p.fullName}</p>
                          <p className="text-xs text-gray-500 truncate">{p.playingPosition}</p>
                        </div>
                        <span className={`shrink-0 ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                          p.status === "pending" ? "bg-yellow-500/20 text-yellow-500" :
                          p.status === "approved" ? "bg-green-500/20 text-green-500" :
                          p.status === "rejected" ? "bg-red-500/20 text-red-500" :
                          "bg-blue-500/20 text-blue-500"
                        }`}>
                          {p.status}
                        </span>
                      </div>
                    ))}
                    {profileRequests.length === 0 && <p className="text-gray-500 text-sm">No profile requests yet.</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── Players ─── */}
          {activeTab === "players" && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <PlayerManagement />
            </div>
          )}

          {/* ─── Blogs ─── */}
          {activeTab === "blogs" && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <BlogManagement />
            </div>
          )}

          {/* ─── Services & How It Works ─── */}
          {activeTab === "services" && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <ServiceManagement />
            </div>
          )}

          {/* ─── About Page ─── */}
          {activeTab === "about" && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <AboutManagement />
            </div>
          )}

          {/* ─── Enquiries ─── */}
          {activeTab === "enquiries" && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-6">Enquiries Management</h3>
              {enquiries.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No enquiries found.</p>
              ) : (
                <div className="space-y-4">
                  {enquiries.map((enquiry) => (
                    <div key={enquiry._id} className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold">{enquiry.name}</h4>
                          <p className="text-sm text-gray-400">{enquiry.email} • {enquiry.phone}</p>
                          <p className="text-sm text-red-500 mt-1">{enquiry.subject}</p>
                        </div>
                        <span className={`shrink-0 ml-2 px-3 py-1 rounded-full text-xs font-medium ${
                          enquiry.status === "pending" ? "bg-yellow-500/20 text-yellow-500" :
                          enquiry.status === "in-progress" ? "bg-blue-500/20 text-blue-500" :
                          enquiry.status === "resolved" ? "bg-green-500/20 text-green-500" :
                          "bg-gray-500/20 text-gray-400"
                        }`}>
                          {enquiry.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 mb-3">{enquiry.message}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateEnquiryStatus(enquiry._id, "in-progress")}
                          className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-500 rounded text-sm transition-all"
                        >
                          In Progress
                        </button>
                        <button
                          onClick={() => updateEnquiryStatus(enquiry._id, "resolved")}
                          className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-500 rounded text-sm transition-all"
                        >
                          Resolve
                        </button>
                        <button
                          onClick={() => updateEnquiryStatus(enquiry._id, "closed")}
                          className="px-3 py-1 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 rounded text-sm transition-all"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── Profile Requests ─── */}
          {activeTab === "profiles" && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-6">Profile Requests</h3>
              {profileRequests.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No profile requests found.</p>
              ) : (
                <div className="space-y-4">
                  {profileRequests.map((profile) => (
                    <div key={profile._id} className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-lg">{profile.fullName}</h4>
                          <p className="text-sm text-gray-400">{profile.email} • {profile.phone}</p>
                          <p className="text-sm text-gray-400">{profile.city}, {profile.nationality}</p>
                        </div>
                        <span className={`shrink-0 ml-2 px-3 py-1 rounded-full text-xs font-medium ${
                          profile.status === "pending" ? "bg-yellow-500/20 text-yellow-500" :
                          profile.status === "reviewing" ? "bg-blue-500/20 text-blue-500" :
                          profile.status === "approved" ? "bg-green-500/20 text-green-500" :
                          "bg-red-500/20 text-red-500"
                        }`}>
                          {profile.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                        <div className="bg-white/5 rounded p-2">
                          <p className="text-xs text-gray-400">Position</p>
                          <p className="text-sm font-medium">{profile.playingPosition}</p>
                        </div>
                        <div className="bg-white/5 rounded p-2">
                          <p className="text-xs text-gray-400">Foot</p>
                          <p className="text-sm font-medium">{profile.preferredFoot}</p>
                        </div>
                        <div className="bg-white/5 rounded p-2">
                          <p className="text-xs text-gray-400">Height</p>
                          <p className="text-sm font-medium">{profile.height} cm</p>
                        </div>
                        <div className="bg-white/5 rounded p-2">
                          <p className="text-xs text-gray-400">Experience</p>
                          <p className="text-sm font-medium">{profile.yearsOfExperience} years</p>
                        </div>
                      </div>

                      {profile.currentClub && (
                        <p className="text-sm text-gray-300 mb-2">Current Club: {profile.currentClub}</p>
                      )}

                      {profile.achievements && (
                        <p className="text-sm text-gray-300 mb-2">Achievements: {profile.achievements}</p>
                      )}

                      {profile.videoLink && (
                        <p className="text-sm mb-2"><a href={profile.videoLink} target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300 underline">View Video</a></p>
                      )}

                      <div className="flex gap-2 mt-3">
                        {profile.status !== "reviewing" && (
                          <button
                            onClick={() => updateProfileStatus(profile._id, "reviewing")}
                            className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-500 rounded text-sm transition-all"
                          >
                            Review
                          </button>
                        )}
                        {profile.status !== "approved" && (
                          <button
                            onClick={() => updateProfileStatus(profile._id, "approved")}
                            className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-500 rounded text-sm transition-all flex items-center gap-1"
                          >
                            <CheckCircleIcon className="w-4 h-4" />
                            Approve
                          </button>
                        )}
                        {profile.status !== "rejected" && (
                          <button
                            onClick={() => updateProfileStatus(profile._id, "rejected")}
                            className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded text-sm transition-all flex items-center gap-1"
                          >
                            <XCircleIcon className="w-4 h-4" />
                            Reject
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── Admin Management (Super Admin Only) ─── */}
          {activeTab === "admins" && isSuperAdmin && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <AdminManagement />
            </div>
          )}

          {/* ─── Settings ─── */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              {/* Change Password */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-6">Change Password</h3>

                {passwordError && (
                  <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm">
                    {passwordError}
                  </div>
                )}
                {passwordSuccess && (
                  <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 text-sm">
                    {passwordSuccess}
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="max-w-md space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Current Password</label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500/50 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">New Password</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500/50 text-sm"
                      placeholder="Min 6 characters"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500/50 text-sm"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-medium transition-all text-sm disabled:opacity-50"
                  >
                    {changingPassword ? "Changing..." : "Change Password"}
                  </button>
                </form>
              </div>

              {/* Account Info */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Name</p>
                    <p className="text-sm font-medium">{adminData?.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="text-sm font-medium">{adminData?.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Role</p>
                    <p className="text-sm font-medium">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        adminData?.role === "Super Admin"
                          ? "bg-purple-500/20 text-purple-400"
                          : "bg-blue-500/20 text-blue-400"
                      }`}>
                        {adminData?.role}
                      </span>
                    </p>
                  </div>
                </div>
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
      <div className={`inline-flex items-center justify-center w-12 h-12 ${colorClasses[color]} rounded-xl mb-3`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-gray-400 text-sm mb-1">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
};

export default AdminDashboard;
