import React, { useEffect, useState } from "react";
import {
  Building2,
  User,
  Mail,
  Phone,
  Globe,
  Briefcase,
  Target,
  Calendar,
  CheckCircle,
  Clock,
  RefreshCw,
  MapPin,
  FileText,
  Edit3,
  Save,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import csrService from "../../services/csrService";
import csrProgramService from "../../services/csr/programService";
import { useAuth } from "../../context/AuthUtils";

const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatStatus = (status) => {
  if (!status) return "Unknown";
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getStatusColor = (status) => {
  switch (status) {
    case "approved":
    case "active":
      return "bg-emerald-100 text-emerald-700";
    case "implementation_in_progress":
      return "bg-amber-100 text-amber-700";
    case "completed":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
};

const CSRProfile = () => {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    registrationNumber: "",
    industry: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, programsRes] = await Promise.all([
          csrService.sponsor.profile(),
          csrProgramService.getMyPrograms(),
        ]);
        // Handle both response formats: direct data or { data: ... }
        const profileData = profileRes?.data || profileRes;
        setProfile(profileData);
        setPrograms(programsRes?.data || []);
        // Initialize form data
        setFormData({
          companyName: profileData?.companyName || "",
          contactName: profileData?.contactName || "",
          email: profileData?.email || authUser?.email || "",
          phone: profileData?.phone || "",
          website: profileData?.website || "",
          registrationNumber: profileData?.registrationNumber || "",
          industry: profileData?.industry || "",
          address: {
            street: profileData?.address?.street || "",
            city: profileData?.address?.city || "",
            state: profileData?.address?.state || "",
            postalCode: profileData?.address?.postalCode || "",
            country: profileData?.address?.country || "",
          },
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [authUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-slate-500">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  // Format address for display
  const formatAddress = () => {
    if (!profile?.address) return "Not provided";
    const addr = profile.address;
    const parts = [
      addr.street,
      addr.city,
      addr.state,
      addr.postalCode,
      addr.country,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Not provided";
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    // Reset form data to original profile
    if (profile) {
      setFormData({
        companyName: profile?.companyName || "",
        contactName: profile?.contactName || "",
        email: profile?.email || authUser?.email || "",
        phone: profile?.phone || "",
        website: profile?.website || "",
        registrationNumber: profile?.registrationNumber || "",
        industry: profile?.industry || "",
        address: {
          street: profile?.address?.street || "",
          city: profile?.address?.city || "",
          state: profile?.address?.state || "",
          postalCode: profile?.address?.postalCode || "",
          country: profile?.address?.country || "",
        },
      });
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updateData = {
        companyName: formData.companyName,
        contactName: formData.contactName,
        email: formData.email,
        phone: formData.phone,
        website: formData.website,
        registrationNumber: formData.registrationNumber,
        industry: formData.industry,
        address: formData.address,
      };

      const response = await csrService.sponsor.update(updateData);
      const updatedProfile = response?.data || response;
      setProfile(updatedProfile);
      setEditing(false);
      toast.success("Profile updated successfully");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* HEADER */}
        <header className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Account</p>
            <h1 className="text-3xl font-bold text-slate-900">Profile</h1>
            <p className="text-sm text-slate-500">
              {editing ? "Edit your company and contact information." : "View your company and contact information."}
            </p>
          </div>
          {!editing && (
            <button
              onClick={handleEdit}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </header>

        {/* COMPANY INFO CARD */}
        <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            {/* Avatar/Logo Placeholder */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-8 h-8 text-indigo-600" />
            </div>

            <div className="flex-1">
              {editing ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name *</label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange("companyName", e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Industry</label>
                    <input
                      type="text"
                      value={formData.industry}
                      onChange={(e) => handleInputChange("industry", e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., IT, Healthcare, Education"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-slate-900">
                    {profile?.companyName || authUser?.organization || "N/A"}
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    {profile?.industry || "Industry not set"}
                  </p>
                </>
              )}

              {/* Status Badge */}
              <div className="mt-3 flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusColor(
                    profile?.status || "active"
                  )}`}
                >
                  {profile?.status || "Active"}
                </span>
                {authUser?.approvalStatus && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      authUser.approvalStatus === "approved"
                        ? "bg-green-100 text-green-700"
                        : authUser.approvalStatus === "pending"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {authUser.approvalStatus === "approved"
                      ? "Approved"
                      : authUser.approvalStatus === "pending"
                      ? "Pending Approval"
                      : "Rejected"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT INFORMATION */}
        <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Contact Information</h3>
            {editing && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !formData.companyName.trim()}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Full Name / Contact Name */}
            <div className={`flex items-start gap-3 p-4 rounded-xl ${editing ? "bg-white border border-slate-200" : "bg-slate-50"}`}>
              <User className="w-5 h-5 text-indigo-500 mt-1" />
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Full Name</p>
                {editing ? (
                  <input
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => handleInputChange("contactName", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="Contact person name"
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-900">
                    {profile?.contactName || authUser?.name || "N/A"}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className={`flex items-start gap-3 p-4 rounded-xl ${editing ? "bg-white border border-slate-200" : "bg-slate-50"}`}>
              <Mail className="w-5 h-5 text-indigo-500 mt-1" />
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Email</p>
                {editing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="contact@company.com"
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-900 break-all">
                    {profile?.email || authUser?.email || "N/A"}
                  </p>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className={`flex items-start gap-3 p-4 rounded-xl ${editing ? "bg-white border border-slate-200" : "bg-slate-50"}`}>
              <Phone className="w-5 h-5 text-indigo-500 mt-1" />
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Phone</p>
                {editing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="+91 1234567890"
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-900">
                    {profile?.phone || "Not provided"}
                  </p>
                )}
              </div>
            </div>

            {/* Website */}
            <div className={`flex items-start gap-3 p-4 rounded-xl ${editing ? "bg-white border border-slate-200" : "bg-slate-50"}`}>
              <Globe className="w-5 h-5 text-indigo-500 mt-1" />
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Website</p>
                {editing ? (
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="https://www.company.com"
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-900">
                    {profile?.website ? (
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-700 hover:underline break-all"
                      >
                        {profile.website}
                      </a>
                    ) : (
                      "Not provided"
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* COMPANY DETAILS */}
        <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Company Details</h3>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Registration Number */}
            <div className={`flex items-start gap-3 p-4 rounded-xl ${editing ? "bg-white border border-slate-200" : "bg-slate-50"}`}>
              <FileText className="w-5 h-5 text-indigo-500 mt-1" />
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">
                  Registration Number
                </p>
                {editing ? (
                  <input
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) => handleInputChange("registrationNumber", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="Company registration number"
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-900">
                    {profile?.registrationNumber || "Not provided"}
                  </p>
                )}
              </div>
            </div>

            {/* Industry - Already shown in company info card, so hide here when editing */}
            {!editing && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50">
                <Briefcase className="w-5 h-5 text-indigo-500" />
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Industry Sector</p>
                  <p className="text-sm font-medium text-slate-900">
                    {profile?.industry || "Not provided"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ADDRESS INFORMATION */}
        {(profile?.address || editing || (profile?.address?.street || profile?.address?.city)) && (
          <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-500" />
              <h3 className="text-lg font-semibold text-slate-900">Address</h3>
            </div>

            {editing ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Street</label>
                  <input
                    type="text"
                    value={formData.address.street}
                    onChange={(e) => handleInputChange("address.street", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="Street address"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => handleInputChange("address.city", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    value={formData.address.state}
                    onChange={(e) => handleInputChange("address.state", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="State"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={formData.address.postalCode}
                    onChange={(e) => handleInputChange("address.postalCode", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="Postal code"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={formData.address.country}
                    onChange={(e) => handleInputChange("address.country", e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="Country"
                  />
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50">
                <p className="text-sm text-slate-900 whitespace-pre-line">
                  {formatAddress()}
                </p>
              </div>
            )}
          </section>
        )}

        {/* SDG GOALS (read-only display) */}
        {profile?.sdgGoals && profile.sdgGoals.length > 0 && (
          <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-500" />
              <h3 className="text-lg font-semibold text-slate-900">SDG Goals</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {profile.sdgGoals.map((goal, index) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100"
                >
                  {goal.sdgCode || goal}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* ASSOCIATED PROGRAMS */}
        <section className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-500" />
            <h3 className="text-lg font-semibold text-slate-900">Associated Programs</h3>
          </div>

          {programs.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No programs assigned yet.</p>
              <p className="text-xs text-slate-400 mt-1">
                Once a program is created for your organization, it will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {programs.map((program) => (
                <div
                  key={program._id}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{program.name}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(program.duration?.startDate)} –{" "}
                        {formatDate(program.duration?.endDate)}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      program.status
                    )}`}
                  >
                    {formatStatus(program.status)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default CSRProfile;
