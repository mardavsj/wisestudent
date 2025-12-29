import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Award,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  Clock,
  Copy,
  Globe,
  Loader2,
  Mail,
  MapPin,
  PenLine,
  Phone,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/useAuth";
import { useSocket } from "../../context/SocketContext";
import Avatar from "../../components/Avatar";
import api from "../../utils/api";
import {
  fetchUserProfile,
  updateUserProfile,
  uploadUserAvatar,
} from "../../services/dashboardService";

const SectionCard = ({ title, description, action, children }) => (
  <section className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm transition-all hover:shadow-md">
    <div className="flex flex-col gap-2 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{title}</h2>
        {description && (
          <p className="text-sm text-slate-600 mt-1">{description}</p>
        )}
      </div>
      {action}
    </div>
    <div className="px-6 py-6">{children}</div>
  </section>
);

const StatCard = ({ icon, label, value, badge, gradient = "from-indigo-500 to-purple-600", iconBg = "bg-gradient-to-br from-indigo-500 to-purple-600" }) => {
  const Icon = icon;
  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 px-4 py-4 shadow-sm transition-all hover:shadow-lg hover:border-indigo-200">
      <div className="relative flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBg} text-white shadow-lg transition-transform group-hover:scale-110 group-hover:shadow-xl`}>
            {Icon ? <Icon className="h-6 w-6" /> : null}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">
              {label}
            </p>
            <p className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mt-1">{value}</p>
          </div>
        </div>
        {badge && (
          <span className="rounded-full px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-xs font-semibold text-indigo-700 border border-indigo-200">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
};

const ReadOnlyMetric = ({ icon, title, value, helper }) => {
  const Icon = icon;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          {Icon ? <Icon className="h-4 w-4" /> : null}
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {title}
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
          {helper && <p className="text-xs text-slate-500 mt-0.5">{helper}</p>}
        </div>
      </div>
    </div>
  );
};

const AssignmentCard = ({ item }) => (
  <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4 shadow-sm">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-slate-900">
          {item.label || "Class Assignment"}
        </p>
        {item.academicYear && (
          <p className="text-xs text-slate-500 mt-0.5">Academic Year {item.academicYear}</p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {item.subjects?.length ? (
          <span className="inline-flex items-center gap-1 rounded bg-indigo-100 px-2 py-0.5 font-medium text-indigo-700">
            <BookOpen className="h-3 w-3" />
            {item.subjects.length} Subjects
          </span>
        ) : null}
        <span className="inline-flex items-center gap-1 rounded bg-green-100 px-2 py-0.5 font-medium text-green-700">
          <Users className="h-3 w-3" />
          {item.sections?.reduce(
            (total, section) => total + (section.studentCount || 0),
            0
          )}{" "}
          Learners
        </span>
      </div>
    </div>
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      {item.sections?.map((section) => (
        <div
          key={`${item.id}-${section.name}`}
          className="rounded-lg border border-slate-200 bg-white px-4 py-3"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">
              {section.name}
            </p>
            <span className="text-xs font-medium text-indigo-600">
              {section.role}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            {section.studentCount || 0} learners{" "}
            {section.capacity
              ? `· Capacity ${section.capacity}`
              : section.currentStrength
              ? `· Strength ${section.currentStrength}`
              : ""}
          </p>
        </div>
      ))}
      {item.sections?.length === 0 && (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-500">
          Awaiting allocation
        </div>
      )}
    </div>
  </div>
);

const mergeNested = (base = {}, patch = {}) => {
  const result = { ...(base || {}) };
  Object.entries(patch || {}).forEach(([key, value]) => {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      !(value instanceof Date)
    ) {
      result[key] = mergeNested(base?.[key] || {}, value);
    } else if (value !== undefined) {
      result[key] = value;
    }
  });
  return result;
};

const toDateInputValue = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
};

const formatTenure = (joiningDate) => {
  if (!joiningDate) return null;
  const date = new Date(joiningDate);
  if (Number.isNaN(date.getTime())) return null;
  const now = new Date();
  let years = now.getFullYear() - date.getFullYear();
  let months = now.getMonth() - date.getMonth();
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  if (years < 0) return null;
  if (years === 0 && months === 0) return "Joined recently";
  const parts = [];
  if (years > 0) parts.push(`${years} year${years > 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} month${months > 1 ? "s" : ""}`);
  return parts.join(" · ");
};

const TeacherProfile = () => {
  const { user } = useAuth();
  const { subscribeProfileUpdate, socket } = useSocket();

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [personalForm, setPersonalForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    bio: "",
    dateOfBirth: "",
  });
  const [personalErrors, setPersonalErrors] = useState({});
  const [personalSaving, setPersonalSaving] = useState(false);

  const [professionalForm, setProfessionalForm] = useState({
    department: "",
    designation: "",
    specialization: "",
    experience: "",
    achievements: "",
    joiningDate: "",
    certifications: "",
  });

  const [avatarPreview, setAvatarPreview] = useState("/avatars/avatar1.png");
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarInputRef = useRef(null);

  const apiBaseUrl =
    import.meta.env.VITE_API_URL?.trim() || "http://localhost:5000";

  const normalizeAvatarUrl = useCallback(
    (src) => {
      if (!src) return src;
      if (src.startsWith("http")) return src;
      if (src.startsWith("/uploads/")) return `${apiBaseUrl}${src}`;
      return src;
    },
    [apiBaseUrl]
  );

  const applyProfilePatch = useCallback(
    (patch, { silent } = {}) => {
      const data = patch?.data && typeof patch.data === "object" ? patch.data : patch;
      if (!data) return;

      setProfile((prev) => {
        const next = { ...(prev || {}) };
        if (data.fullName || data.name) {
          next.fullName = data.fullName || data.name;
          next.name = data.fullName || data.name;
        }
        if (data.email !== undefined) next.email = data.email || "";
        if (data.phone !== undefined) next.phone = data.phone || "";
        if (data.location !== undefined || data.city !== undefined) {
          next.location = data.location || data.city || "";
        }
        if (data.website !== undefined) next.website = data.website || "";
        if (data.bio !== undefined) next.bio = data.bio || "";
        if (data.avatar) next.avatar = data.avatar;
        if (data.dateOfBirth !== undefined || data.dob !== undefined) {
          next.dateOfBirth = data.dateOfBirth || data.dob || "";
        }
        if (data.professional) {
          next.professional = mergeNested(next.professional, data.professional);
        }
        if (data.school) {
          next.school = mergeNested(next.school, data.school);
        }
        if (data.teacherDetails) {
          next.teacherDetails = mergeNested(
            next.teacherDetails,
            data.teacherDetails
          );
        }
        if (data.stats) {
          next.stats = mergeNested(next.stats, data.stats);
        }
        if (data.metadata) {
          next.metadata = mergeNested(next.metadata, data.metadata);
        }
        if (data.linkingCode) next.linkingCode = data.linkingCode;
        if (data.createdAt) next.createdAt = data.createdAt;
        return next;
      });

      setPersonalForm((prev) => ({
        ...prev,
        name: data.fullName || data.name || prev.name,
        phone: data.phone !== undefined ? data.phone || "" : prev.phone || "",
        location:
          data.location !== undefined || data.city !== undefined
            ? data.location || data.city || ""
            : prev.location || "",
        website:
          data.website !== undefined ? data.website || "" : prev.website || "",
        bio: data.bio !== undefined ? data.bio || "" : prev.bio || "",
        dateOfBirth:
          data.dateOfBirth || data.dob
            ? toDateInputValue(data.dateOfBirth || data.dob)
            : prev.dateOfBirth,
      }));

      if (data.professional || data.metadata) {
        setProfessionalForm((prev) => {
          const next = { ...prev };
          if (data.professional) {
            Object.assign(next, data.professional);
            next.joiningDate = data.professional.joiningDate
              ? toDateInputValue(data.professional.joiningDate)
              : next.joiningDate;
          }
          if (!next.experience) {
            const metadataExperience = data.metadata?.experience;
            if (metadataExperience !== undefined && metadataExperience !== null) {
              next.experience = metadataExperience.toString();
            }
          }
          return next;
        });
      }

      if (data.avatar) {
        setAvatarPreview(normalizeAvatarUrl(data.avatar));
      }

      if (!silent) {
        toast.info("Profile updated in real-time");
      }
    },
    [normalizeAvatarUrl]
  );

  const loadProfile = useCallback(async () => {
    if (!user) return;
    setLoadingProfile(true);
    try {
      const response = await fetchUserProfile();
      const data = response?.data && typeof response.data === "object" ? response.data : response;

      setProfile({
        id: data._id || user._id || user.id,
        fullName:
          data.fullName || data.name || user.fullName || user.name || "",
        name: data.fullName || data.name || user.fullName || user.name || "",
        email: data.email || user.email || "",
        phone: data.phone || "",
        location: data.location || data.city || "",
        website: data.website || "",
        bio: data.bio || "",
        avatar: data.avatar || "",
        dateOfBirth: data.dateOfBirth || data.dob || "",
        professional: data.professional || {},
        teacherDetails: data.teacherDetails || null,
        school: data.school || null,
        stats: data.stats || {},
        role: data.role,
        linkingCode: data.linkingCode,
        createdAt: data.createdAt || data.joiningDate || user.createdAt || null,
        metadata: data.metadata || {},
      });

      setPersonalForm({
        name:
          data.fullName || data.name || user.fullName || user.name || "",
        email: data.email || user.email || "",
        phone: data.phone || "",
        location: data.location || data.city || "",
        website: data.website || "",
        bio: data.bio || "",
        dateOfBirth: toDateInputValue(data.dateOfBirth || data.dob),
      });

      setProfessionalForm({
        department: data.professional?.department || "",
        designation: data.professional?.designation || "",
        specialization: data.professional?.specialization || "",
        experience:
          data.professional?.experience ??
          (data.metadata?.experience !== undefined &&
          data.metadata?.experience !== null
            ? data.metadata.experience.toString()
            : ""),
        achievements: data.professional?.achievements || "",
        joiningDate: toDateInputValue(data.professional?.joiningDate),
        certifications: data.professional?.certifications || "",
      });

      setAvatarPreview(
        normalizeAvatarUrl(data.avatar) || "/avatars/avatar1.png"
      );
    } catch (error) {
      console.error("Error fetching teacher profile:", error);
      toast.error("Unable to load your teacher profile right now.");
    } finally {
      setLoadingProfile(false);
    }
  }, [normalizeAvatarUrl, user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (!user || !subscribeProfileUpdate) return undefined;
    const unsubscribe = subscribeProfileUpdate((payload) => {
      if (payload.userId && payload.userId !== (user._id || user.id)) {
        return;
      }
      applyProfilePatch(payload, { silent: false });
    });
    return () => unsubscribe();
  }, [applyProfilePatch, subscribeProfileUpdate, user]);

  const handleAvatarFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be under 5MB");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);
    setAvatarUploading(true);
    try {
      const res = await uploadUserAvatar(formData);
      const newAvatar = res?.avatar;
      if (newAvatar) {
        applyProfilePatch({ avatar: newAvatar }, { silent: true });
        setAvatarPreview(normalizeAvatarUrl(newAvatar));
        toast.success("Profile photo updated");
      }
    } catch (error) {
      console.error("Avatar upload failed:", error);
      toast.error("Failed to update profile photo");
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleAvatarReset = async () => {
    setAvatarUploading(true);
    try {
      const res = await api.post("/api/user/avatar", {
        avatar: "/avatars/avatar1.png",
      });
      const newAvatar = res.data?.avatar || "/avatars/avatar1.png";
      applyProfilePatch({ avatar: newAvatar }, { silent: true });
      setAvatarPreview(normalizeAvatarUrl(newAvatar));
      toast.success("Profile photo reset");
    } catch (error) {
      console.error("Avatar reset failed:", error);
      toast.error("Could not reset profile photo");
    } finally {
      setAvatarUploading(false);
    }
  };

  const handlePersonalSave = async () => {
    setPersonalErrors({});
    if (!personalForm.name.trim()) {
      setPersonalErrors({ name: "Name is required" });
      return;
    }

    setPersonalSaving(true);
    try {
      const payload = {
        personal: {
          name: personalForm.name.trim(),
          phone: personalForm.phone?.trim() || "",
          location: personalForm.location?.trim() || "",
          website: personalForm.website?.trim() || "",
          bio: personalForm.bio || "",
        },
        dateOfBirth: personalForm.dateOfBirth || null,
      };
      const res = await updateUserProfile(payload);
      applyProfilePatch(
        {
          ...payload.personal,
          dateOfBirth: payload.dateOfBirth,
          fullName: payload.personal.name,
          ...res?.user,
        },
        { silent: true }
      );
      toast.success("Personal information updated");
    } catch (error) {
      console.error("Personal update error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to update personal information"
      );
    } finally {
      setPersonalSaving(false);
    }
  };

  const teachingSummary = useMemo(() => {
    const details = profile?.teacherDetails;
    if (!details) {
      return {
        schoolName: profile?.school?.name || "Not linked",
        totalClasses: 0,
        totalSections: 0,
        totalStudents: 0,
        totalSubjects: 0,
        subjects: [],
        classes: [],
        lastUpdated: null,
      };
    }
    return {
      schoolName:
        details.schoolName || profile?.school?.name || "Not linked",
      totalClasses: details.totalClasses || 0,
      totalSections: details.totalSections || 0,
      totalStudents: details.totalStudents || 0,
      totalSubjects: details.totalSubjects || 0,
      subjects: Array.isArray(details.subjects) ? details.subjects : [],
      classes: Array.isArray(details.classes) ? details.classes : [],
      lastUpdated: details.lastUpdated || null,
    };
  }, [profile]);

  const avatarUser = useMemo(() => {
    if (!user) return null;
    const avatarSource = profile?.avatar
      ? normalizeAvatarUrl(profile.avatar)
      : avatarPreview;
    return { ...user, avatar: avatarSource };
  }, [avatarPreview, normalizeAvatarUrl, profile?.avatar, user]);

  const tenure = useMemo(() => {
    const joiningDate =
      professionalForm.joiningDate ||
      profile?.professional?.joiningDate ||
      null;
    return formatTenure(joiningDate);
  }, [professionalForm.joiningDate, profile?.professional?.joiningDate]);

  const experienceDisplay = useMemo(() => {
    const formExperience = professionalForm.experience
      ? professionalForm.experience.toString().trim()
      : "";
    if (formExperience) return formExperience;

    const profileExperience = profile?.professional?.experience;
    if (profileExperience) return profileExperience;

    const metadataExperience = profile?.metadata?.experience;
    if (metadataExperience !== undefined && metadataExperience !== null) {
      if (typeof metadataExperience === "number" && !Number.isNaN(metadataExperience)) {
        const years = metadataExperience;
        return `${years} year${years === 1 ? "" : "s"}`;
      }
      if (typeof metadataExperience === "string") {
        const trimmed = metadataExperience.trim();
        if (trimmed) {
          return trimmed;
        }
      }
    }

    const teacherDetailsExperience =
      profile?.teacherDetails?.experience ??
      profile?.teacherDetails?.experienceYears ??
      profile?.teacherDetails?.yearsOfExperience;

    if (
      typeof teacherDetailsExperience === "number" &&
      !Number.isNaN(teacherDetailsExperience)
    ) {
      const years = teacherDetailsExperience;
      return `${years} year${years === 1 ? "" : "s"}`;
    }

    if (typeof teacherDetailsExperience === "string") {
      return teacherDetailsExperience.trim();
    }

    return "";
  }, [professionalForm.experience, profile]);

  const handleCopyCode = async (value) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Linking code copied");
    } catch (error) {
      console.error("Clipboard error:", error);
      toast.error("Unable to copy right now");
    }
  };

  if (loadingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-6 rounded-t-xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col items-center gap-4 md:flex-row">
                <div className="relative">
                  <Avatar
                    user={avatarUser || user}
                    size="large"
                    showCustomize
                    onAvatarUpdate={(updated) => {
                      const nextAvatar =
                        updated?.url || updated?.avatar || updated;
                      if (!nextAvatar) return;
                      applyProfilePatch(
                        { avatar: nextAvatar },
                        { silent: true }
                      );
                      setAvatarPreview(normalizeAvatarUrl(nextAvatar));
                      if (socket) {
                        socket.emit("profile_updated", {
                          userId: user?._id || user?.id,
                          avatar: nextAvatar,
                        });
                      }
                    }}
                  />
                  {avatarUploading && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-white/70">
                      <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                    </div>
                  )}
                </div>
                <div className="text-center md:text-left">
                  <h1 className="text-2xl font-bold text-white">
                    {personalForm.name || "Teacher Profile"}
                  </h1>
                  <p className="mt-1 text-sm text-white/80">
                    Build deeper classroom impact with a complete professional profile.
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs text-white/90 md:justify-start">
                    {personalForm.email && (
                      <span className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5" />
                        {personalForm.email}
                      </span>
                    )}
                    {personalForm.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5" />
                        {personalForm.phone}
                      </span>
                    )}
                    {tenure && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {tenure}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {profile?.linkingCode && (
                <div className="rounded-xl border-2 border-white/30 bg-white/20 backdrop-blur-md px-5 py-4 text-center shadow-lg">
                  <p className="text-xs font-bold uppercase tracking-wider text-white/90">
                    Teacher Linking Code
                  </p>
                  <p className="mt-2 text-lg font-mono font-bold text-white drop-shadow-md">
                    {profile.linkingCode}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(profile.linkingCode)}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-white/30 hover:scale-105 active:scale-95 shadow-md"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Copy Code
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Profile Actions */}
          <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-md transition-all hover:from-indigo-600 hover:to-purple-700 hover:shadow-lg hover:scale-105 active:scale-95"
                onClick={() => avatarInputRef.current?.click()}
              >
                ✨ Change photo
              </button>
              <button
                type="button"
                className="rounded-lg bg-gradient-to-r from-red-500 to-pink-600 px-4 py-2 text-xs font-semibold text-white shadow-md transition-all hover:from-red-600 hover:to-pink-700 hover:shadow-lg hover:scale-105 active:scale-95"
                onClick={handleAvatarReset}
              >
                🔄 Reset to default
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarFileChange}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="px-6 py-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            <StatCard
              icon={Building2}
              label="School"
              value={teachingSummary.schoolName || "Not linked"}
              badge="Campus"
              gradient="from-blue-500 to-cyan-600"
              iconBg="bg-gradient-to-br from-blue-500 to-cyan-600"
            />
            <StatCard
              icon={Users}
              label="Learners"
              value={teachingSummary.totalStudents || 0}
              badge={`${teachingSummary.totalClasses} classes`}
              gradient="from-purple-500 to-pink-600"
              iconBg="bg-gradient-to-br from-purple-500 to-pink-600"
            />
            <StatCard
              icon={Award}
              label="Experience"
              value={experienceDisplay || "Add tenure"}
              badge="Professional"
              gradient="from-amber-500 to-orange-600"
              iconBg="bg-gradient-to-br from-amber-500 to-orange-600"
            />
          </div>
        </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          <div className="flex flex-col gap-8">
            <SectionCard
              title="Personal Information"
              description="Keep your contact information up to date for quick collaboration."
              action={
                <button
                  type="button"
                  onClick={handlePersonalSave}
                  disabled={personalSaving}
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 hover:shadow-lg hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                >
                  {personalSaving && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  Save changes
                </button>
              }
            >
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block space-y-1">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <PenLine className="h-4 w-4 text-indigo-500" />
                    Full name
                  </span>
                  <input
                    name="name"
                    value={personalForm.name}
                    onChange={(event) =>
                      setPersonalForm((prev) => ({
                        ...prev,
                        name: event.target.value,
                      }))
                    }
                    placeholder="Your full name"
                    className={`w-full rounded-lg border bg-white px-4 py-2 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
                      personalErrors.name ? "border-red-400" : "border-slate-300"
                    }`}
                  />
                  {personalErrors.name && (
                    <span className="text-xs text-red-500">
                      {personalErrors.name}
                    </span>
                  )}
                </label>
                <label className="block space-y-1">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <Mail className="h-4 w-4 text-purple-500" />
                    Email address
                  </span>
                  <input
                    name="email"
                    value={personalForm.email}
                    disabled
                    className="w-full rounded-lg border border-slate-300 bg-slate-100 px-4 py-2 text-sm text-slate-500"
                  />
                </label>
                <label className="block space-y-1">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <Phone className="h-4 w-4 text-pink-500" />
                    Phone number
                  </span>
                  <input
                    name="phone"
                    value={personalForm.phone}
                    onChange={(event) =>
                      setPersonalForm((prev) => ({
                        ...prev,
                        phone: event.target.value,
                      }))
                    }
                    placeholder="e.g. +91 98765 43210"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </label>
                <label className="block space-y-1">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    Location
                  </span>
                  <input
                    name="location"
                    value={personalForm.location}
                    onChange={(event) =>
                      setPersonalForm((prev) => ({
                        ...prev,
                        location: event.target.value,
                      }))
                    }
                    placeholder="City, Country"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </label>
                <label className="block space-y-1">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <Globe className="h-4 w-4 text-cyan-500" />
                    Portfolio or website
                  </span>
                  <input
                    name="website"
                    value={personalForm.website}
                    onChange={(event) =>
                      setPersonalForm((prev) => ({
                        ...prev,
                        website: event.target.value,
                      }))
                    }
                    placeholder="https://"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </label>
                <label className="block space-y-1">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <Calendar className="h-4 w-4 text-amber-500" />
                    Date of birth
                  </span>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={personalForm.dateOfBirth || ""}
                    onChange={(event) =>
                      setPersonalForm((prev) => ({
                        ...prev,
                        dateOfBirth: event.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </label>
              </div>
              <div className="mt-4">
                <label className="block space-y-1">
                  <span className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                    <Sparkles className="h-4 w-4 text-violet-500" />
                    Bio
                  </span>
                  <textarea
                    name="bio"
                    value={personalForm.bio}
                    onChange={(event) =>
                      setPersonalForm((prev) => ({
                        ...prev,
                        bio: event.target.value,
                      }))
                    }
                    placeholder="Share your teaching philosophy, focus areas, and achievements."
                    rows={4}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none"
                  />
                </label>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;

