import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Copy, Eye, ArrowLeft, Users } from "lucide-react";
import { toast } from "react-hot-toast";
import { fetchAdminAccounts, fetchAccountDetails, updateAccountPlan, deleteAccount } from "../../services/adminService";
import { useSocket } from "../../context/SocketContext";

const PER_PAGE_OPTIONS = [10, 25, 50, 100];

const categories = [
  { label: "All", value: "all" },
  { label: "Schools", value: "schools" },
  { label: "Students", value: "students" },
  { label: "Teachers", value: "teachers" },
  { label: "Parents", value: "parents" },
  { label: "CSR", value: "csr" },
];

const roleLabels = {
  admin: "Admin",
  student: "Student",
  parent: "Parent",
  csr: "CSR",
  seller: "Seller",
  school_admin: "School Admin",
  school_teacher: "Teacher",
  school_student: "School Student",
  school_parent: "School Parent",
  school_accountant: "School Accountant",
  school_librarian: "School Librarian",
  school_transport_staff: "Transport Staff",
  teacher: "Teacher",
};

const isStudentRole = (detailData) => {
  const role = detailData?.user?.role;
  return role === "student" || role === "school_student";
};

const isParentRole = (detailData) => {
  const role = detailData?.user?.role;
  return role === "parent" || role === "school_parent";
};

const isTeacherRole = (detailData) => {
  const role = detailData?.user?.role;
  return role === "teacher" || role === "school_teacher";
};

const parentCityName = (detailData) => {
  const schools = detailData?.parentDetails?.linkedStudents
    ?.map((child) => child.schoolName)
    .filter(Boolean);
  if (!schools?.length) {
    return null;
  }
  const unique = [...new Set(schools)];
  return unique.join(", ");
};

const dedupeAddressString = (value) => {
  if (!value) return null;
  const parts = value
    .split(",")
    .map((segment) => segment.trim())
    .filter(Boolean);
  const seen = new Set();
  const deduped = [];
  for (const part of parts) {
    if (seen.has(part)) continue;
    seen.add(part);
    deduped.push(part);
  }
  if (!deduped.length) return null;
  return deduped.join(", ");
};

const PLAN_DISPLAY_OVERRIDES = {
  free: "Free Plan",
  student_premium: "Student Premium",
  student_parent_premium_pro: "Student + Parent Pro",
  educational_institutions_premium: "School Plan",
};

const PLAN_OPTIONS = [
  {
    type: "free",
    label: "Free Plan",
    description: "Default access to core learning resources.",
  },
  {
    type: "student_premium",
    label: "Student Premium",
    description: "Premium student gameplay, progress reports, and challenges.",
  },
  {
    type: "student_parent_premium_pro",
    label: "Student + Parent Pro",
    description: "Premium access plus parent dashboards and reporting.",
  },
  {
    type: "educational_institutions_premium",
    label: "School Plan",
    description: "School-wide plan with expanded limits and supervision.",
  },
];

const SCHOOL_BLOCKED_MESSAGES = {
  free: "School accounts cannot be downgraded to free plan",
  student_premium: "School accounts cannot be downgraded to student premium plan",
  student_parent_premium_pro: "School accounts cannot be downgraded to student+parent pro plan",
};

const TEACHER_BLOCKED_MESSAGES = {
  free: "Teacher accounts cannot be downgraded to free plan",
  student_premium: "Teacher accounts cannot be downgraded to student premium plan",
  student_parent_premium_pro: "Teacher accounts cannot be downgraded to student+parent pro plan",
};

const PARENT_BLOCKED_MESSAGES = {
  free: "Parent accounts cannot be set to free plan",
  student_premium: "Parent accounts cannot be set to student premium plan",
};

const formatDate = (value) => {
  if (!value) return "Not set";
  try {
    return new Date(value).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch (error) {
    return "Invalid date";
  }
};

const buildDurationText = (msDifference) => {
  const units = [
    { label: "year", ms: 365 * 24 * 60 * 60 * 1000 },
    { label: "month", ms: 30 * 24 * 60 * 60 * 1000 },
    { label: "day", ms: 24 * 60 * 60 * 1000 },
  ];

  for (const unit of units) {
    if (msDifference >= unit.ms) {
      const value = Math.floor(msDifference / unit.ms);
      return `${value} ${unit.label}${value === 1 ? "" : "s"}`;
    }
  }

  if (msDifference >= 60 * 60 * 1000) {
    const hours = Math.floor(msDifference / (60 * 60 * 1000));
    return `${hours} hour${hours === 1 ? "" : "s"}`;
  }

  return "Less than an hour left";
};

const getPlanTimeLeftText = (planType, endDate) => {
  if (planType === "free") {
    return "Infinite";
  }
  if (!endDate) {
    return "Not set";
  }

  const expiresAt = new Date(endDate);
  const now = new Date();
  const diff = expiresAt - now;
  if (diff <= 0) {
    return "Expired";
  }
  return buildDurationText(diff);
};

const AdminIndividuals = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [planModalAccount, setPlanModalAccount] = useState(null);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [selectedPlanType, setSelectedPlanType] = useState("free");
  const [planUpdating, setPlanUpdating] = useState(false);
  const [schoolLinkingCode, setSchoolLinkingCode] = useState("");
  const [planModalChildList, setPlanModalChildList] = useState([]);
  const [planModalChildLoading, setPlanModalChildLoading] = useState(false);
  const [planModalChildError, setPlanModalChildError] = useState(null);
  const [planModalChildEmail, setPlanModalChildEmail] = useState("");
  const planTimeLeftText = planModalAccount
    ? getPlanTimeLeftText(planModalAccount.planType, planModalAccount.planEndDate)
    : null;
  const isSchoolAccount = planModalAccount?.role === "school_admin";
  const isTeacherAccount = planModalAccount
    ? ["teacher", "school_teacher"].includes(planModalAccount.role)
    : false;
  const isParentAccount = planModalAccount
    ? ["parent", "school_parent"].includes(planModalAccount.role)
    : false;
  const requiresStudentSchoolLinking =
    planModalAccount?.role === "student" &&
    selectedPlanType === "educational_institutions_premium";
  const requiresParentChildEmail =
    isParentAccount && selectedPlanType === "educational_institutions_premium";
  const normalizedChildEmail = planModalChildEmail.trim().toLowerCase();
  const childEmailMatches =
    normalizedChildEmail.length > 0 &&
    planModalChildList.some(
      (child) => child.email?.toLowerCase() === normalizedChildEmail
    );
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [linkingCodeCopied, setLinkingCodeCopied] = useState(false);
  const copyTimeoutRef = useRef(null);
  const { socket } = useSocket();

  const fetchAccountsForPage = useCallback(
    async (targetPage) => {
      setLoading(true);

      try {
        const response = await fetchAdminAccounts({
          category,
          page: targetPage,
          perPage,
          search: debouncedSearch,
        });

        const payload = response.data || {};
        const normalized = (payload.accounts || []).map((account) => ({
          id: account.id,
          name: account.name,
          email: account.email,
          role: account.role,
          phone: account.phone,
          plan: account.plan,
          planType: account.planType || "free",
          planEndDate: account.planEndDate,
          planStartDate: account.planStartDate,
          planStatus: account.planStatus,
          createdAt: account.createdAt,
          isVerified: account.isVerified,
          organization: account.organization,
          tenantId: account.tenantId,
        }));

        setAccounts(normalized);
        setTotal(payload.total || 0);
        setPage(targetPage);
        setLastUpdated(new Date().toISOString());
      } catch (error) {
        console.error("Failed to fetch admin accounts:", error);
        toast.error("Unable to load accounts right now.");
      } finally {
        setLoading(false);
      }
    },
    [category, debouncedSearch, perPage]
  );

  const loadPlanModalChildren = useCallback(async (accountId) => {
    setPlanModalChildError(null);
    setPlanModalChildList([]);
    setPlanModalChildEmail("");
    setPlanModalChildLoading(true);
    try {
      const response = await fetchAccountDetails(accountId);
      const payload = response?.data || response || {};
      const children = payload.parentDetails?.linkedStudents || [];
      setPlanModalChildList(children);
      const defaultChild = children.find((child) => child.email);
      if (defaultChild?.email) {
        setPlanModalChildEmail(defaultChild.email);
      }
    } catch {
      console.error("Failed to load parent children:");
      setPlanModalChildError("Unable to load linked students.");
    } finally {
      setPlanModalChildLoading(false);
    }
  }, []);

  const openPlanModal = (account) => {
    if (!account) return;
    setPlanModalAccount(account);
    setSelectedPlanType(account.planType || "free");
    setSchoolLinkingCode("");
    setPlanModalChildList([]);
    setPlanModalChildError(null);
    setPlanModalChildEmail("");
    if (["parent", "school_parent"].includes(account.role)) {
      loadPlanModalChildren(account.id);
    }
    setPlanModalOpen(true);
  };

  const closePlanModal = () => {
    setPlanModalOpen(false);
    setPlanModalAccount(null);
    setSelectedPlanType("free");
    setSchoolLinkingCode("");
    setPlanModalChildList([]);
    setPlanModalChildEmail("");
    setPlanModalChildError(null);
    setPlanModalChildLoading(false);
  };

  const getErrorMessage = (error) =>
    error?.response?.data?.message ||
    error?.message ||
    "Unable to update account plan right now.";

  const handlePlanUpdate = async () => {
    if (!planModalAccount || !selectedPlanType) return;
    setPlanUpdating(true);
    try {
      const option = PLAN_OPTIONS.find((entry) => entry.type === selectedPlanType);
      const payload = {};
      if (
        planModalAccount?.role === "student" &&
        selectedPlanType === "educational_institutions_premium"
      ) {
        if (!schoolLinkingCode.trim()) {
          toast.error("School linking code is required to upgrade a student.");
          setPlanUpdating(false);
          return;
        }
        payload.schoolLinkingCode = schoolLinkingCode.trim();
      }
      if (requiresParentChildEmail) {
        if (!planModalChildEmail.trim()) {
          toast.error("Child email is required to upgrade a parent.");
          setPlanUpdating(false);
          return;
        }
        payload.childEmail = planModalChildEmail.trim();
      }
      await updateAccountPlan(planModalAccount.id, selectedPlanType, payload);
      toast.success(`${planModalAccount.name || planModalAccount.email} is now on ${option?.label || "the selected plan"}`);
      fetchAccountsForPage(page);
      closePlanModal();
    } catch (error) {
      console.error("Failed to update plan:", error);
      toast.error(getErrorMessage(error));
    } finally {
      setPlanUpdating(false);
    }
  };

  const openDetailModal = useCallback(
    async (account) => {
      if (!account?.id) return;
      setDetailModalOpen(true);
      setDetailLoading(true);
      setDetailError(null);
      setDetailData(null);
      try {
        const response = await fetchAccountDetails(account.id);
        const payload = response?.data || response || {};
        setDetailData(payload);
      } catch (error) {
        console.error("Failed to fetch account details:", error);
        setDetailError(error?.message || "Unable to load details");
      } finally {
        setDetailLoading(false);
      }
    },
    []
  );

  const closeDetailModal = useCallback(() => {
    setDetailModalOpen(false);
    setDetailData(null);
    setDetailError(null);
    setDeleteConfirmOpen(false);
    setDeleteLoading(false);
  }, []);

  const openDeleteConfirm = useCallback(() => {
    if (!detailData?.user?.id) return;
    setDeleteConfirmOpen(true);
  }, [detailData]);

  const handleAccountDelete = useCallback(async () => {
    if (!detailData?.user?.id) return;
    setDeleteLoading(true);
    try {
      await deleteAccount(detailData.user.id);
      toast.success("Account deleted successfully.");
      fetchAccountsForPage(page);
      closeDetailModal();
    } catch (error) {
      console.error("Failed to delete account:", error);
      toast.error(error?.response?.data?.message || "Unable to delete account right now.");
    } finally {
      setDeleteLoading(false);
      setDeleteConfirmOpen(false);
    }
  }, [detailData, page, fetchAccountsForPage, closeDetailModal]);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    const disableScroll = planModalOpen || detailModalOpen || deleteConfirmOpen;
    document.body.style.overflow = disableScroll ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [planModalOpen, detailModalOpen, deleteConfirmOpen]);

  useEffect(() => {
    if (!detailModalOpen) {
      setLinkingCodeCopied(false);
    }
  }, [detailModalOpen]);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setAccounts([]);
    setTotal(0);
    setPage(1);
    fetchAccountsForPage(1);
  }, [category, debouncedSearch, perPage, fetchAccountsForPage]);

  useEffect(() => {
    if (!socket) return undefined;
    const handler = () => fetchAccountsForPage(1);
    socket.on("admin:accounts:updated", handler);
    return () => {
      socket.off("admin:accounts:updated", handler);
    };
  }, [socket, fetchAccountsForPage]);

  useEffect(() => {
    const handle = setInterval(() => {
      if (page === 1) {
        fetchAccountsForPage(1);
      }
    }, 30000);

    return () => clearInterval(handle);
  }, [page, fetchAccountsForPage]);

  const activeCategoryLabel = useMemo(
    () => categories.find((item) => item.value === category)?.label || categories[0].label,
    [category]
  );
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const startItem = total === 0 ? 0 : (page - 1) * perPage + 1;
  const endItem = Math.min(page * perPage, total);

  const handlePrevPage = () => {
    if (page <= 1 || loading) return;
    fetchAccountsForPage(page - 1);
  };
  const handleNextPage = () => {
    if (page >= totalPages || loading) return;
    fetchAccountsForPage(page + 1);
  };
  const handleFirstPage = () => {
    if (page <= 1 || loading) return;
    fetchAccountsForPage(1);
  };
  const handleLastPage = () => {
    if (page >= totalPages || loading) return;
    fetchAccountsForPage(totalPages);
  };
  const handlePerPageChange = (e) => {
    const value = Number(e.target.value);
    if (PER_PAGE_OPTIONS.includes(value)) {
      setPerPage(value);
      setPage(1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-50">
      <header className="w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 shadow-2xl border border-purple-500/30 px-4 py-12 md:py-14">
        <div className="max-w-7xl mx-auto flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="p-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors shrink-0 mt-0.5"
              aria-label="Back to dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/80">Platform Directory</p>
              <h1 className="text-2xl md:text-3xl font-black text-white mt-2 flex items-center gap-3">
                <Users className="w-8 h-8 shrink-0" />
                All Accounts
              </h1>
              <p className="text-sm text-white/85 max-w-2xl mt-1.5 leading-relaxed">
                Monitor and manage every registered account. Filter by Schools, Students, Teachers, Parents, or CSR.
              </p>
            </div>
          </div>
          <div className="text-right space-y-1 flex-shrink-0 md:pl-4">
            <p className="text-sm font-medium text-white/90">
              Filter: <span className="font-bold text-white">{activeCategoryLabel}</span>
            </p>
            <p className="text-xs text-white/70">
              {lastUpdated ? `Last refreshed ${formatDate(lastUpdated)}` : "Loading…"}
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-[85rem] mx-auto px-4 md:px-8 lg:px-12 -mt-8">
        <section className="bg-gradient-to-br from-white via-slate-50 to-indigo-50 rounded-3xl shadow-xl border border-indigo-100/60 p-6 space-y-6">
          <div className="flex flex-wrap gap-3">
            {categories.map((item) => (
              <button
                key={item.value}
                onClick={() => setCategory(item.value)}
                className={`cursor-pointer px-4 py-2 rounded-full border transition ${category === item.value
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700 font-semibold shadow-inner"
                  : "border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600"
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Search</label>
              <div className="mt-2 relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by name, email, or phone"
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div>
                <p className="text-xs uppercase tracking-wide">Total accounts</p>
                <p className="text-2xl font-black text-gray-900">{total.toLocaleString()}</p>
              </div>
              <span className="hidden lg:inline-flex h-10 border-l border-dashed border-gray-300" />
              <div>
                <p className="text-xs uppercase tracking-wide">Showing</p>
                <p className="text-lg font-bold text-gray-700">{`${accounts.length.toLocaleString()} entries`}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="py-10">
          <section className="bg-gradient-to-br from-white via-indigo-50 to-pink-50 rounded-md border border-indigo-100 overflow-hidden">
            {loading && accounts.length === 0 ? (
              <div className="flex items-center justify-center p-12">
                <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-500 animate-spin" />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Plan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Organization
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-indigo-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white/90 divide-y divide-gray-200">
                      {accounts.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                            No accounts found for this filter yet.
                          </td>
                        </tr>
                      ) : (
                        accounts.map((account) => (
                          <tr
                            key={account.id || account.email}
                            className="transition hover:bg-indigo-50/60"
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                              {account.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{account.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm tracking-wide text-indigo-600">
                              {roleLabels[account.role] || account.role || "Unknown"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 max-w-[160px]">
                              <button
                                type="button"
                                className="w-full text-left cursor-pointer"
                                title={`${account.plan || "Free Plan"} (click to modify plan)`}
                                onClick={() => openPlanModal(account)}
                              >
                                <span className="block text-sm font-semibold text-gray-800 truncate hover:text-indigo-600">
                                  {PLAN_DISPLAY_OVERRIDES[account.planType] || account.plan || "Free Plan"}
                                </span>
                              </button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {account.organization?.name || account.tenantId || "—"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(account.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => openDetailModal(account)}
                                className="flex h-9 w-9 items-center justify-center rounded-md bg-transparent text-gray-600 transition hover:text-indigo-600 cursor-pointer"
                                aria-label={`View details for ${account.name}`}
                              >
                                <Eye className="h-5 w-5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-4 border-t border-gray-100 bg-white/50">
                  <div className="flex flex-wrap items-center gap-4">
                    <p className="text-sm text-gray-600">
                      Showing <span className="font-semibold text-gray-900">{startItem.toLocaleString()}</span>
                      –<span className="font-semibold text-gray-900">{endItem.toLocaleString()}</span> of{" "}
                      <span className="font-semibold text-gray-900">{total.toLocaleString()}</span> accounts
                    </p>
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                      Per page
                      <select
                        value={perPage}
                        onChange={handlePerPageChange}
                        disabled={loading}
                        className="rounded-lg border border-gray-200 px-2 py-1.5 text-sm font-medium text-gray-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                        aria-label="Rows per page"
                      >
                        {PER_PAGE_OPTIONS.map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 mr-2">
                      Page <span className="font-semibold text-gray-700">{page}</span> of{" "}
                      <span className="font-semibold text-gray-700">{totalPages}</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleFirstPage}
                      disabled={page <= 1 || loading}
                      className="px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed hover:border-indigo-400 hover:text-indigo-600"
                      aria-label="First page"
                    >
                      First
                    </button>
                    <button
                      type="button"
                      onClick={handlePrevPage}
                      disabled={page <= 1 || loading}
                      className="px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed hover:border-indigo-400 hover:text-indigo-600"
                      aria-label="Previous page"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={handleNextPage}
                      disabled={page >= totalPages || loading}
                      className="px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed hover:border-indigo-400 hover:text-indigo-600"
                      aria-label="Next page"
                    >
                      Next
                    </button>
                    <button
                      type="button"
                      onClick={handleLastPage}
                      disabled={page >= totalPages || loading}
                      className="px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed hover:border-indigo-400 hover:text-indigo-600"
                      aria-label="Last page"
                    >
                      Last
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
        {planModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closePlanModal}
              aria-hidden="true"
            />
            <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-black/10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-indigo-500">Plan override</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {planModalAccount?.name || planModalAccount?.email || "Account"}
                  </h3>
                  {planModalAccount?.email && (
                    <p className="text-sm text-gray-500">{planModalAccount.email}</p>
                  )}
                </div>
                <div className="flex items-start gap-3">
                  {planTimeLeftText && (
                    <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-2 text-center text-sm font-semibold text-amber-800 shadow-sm">
                      <p className="text-[10px] uppercase tracking-wide text-amber-600">Plan time left</p>
                      <p className="text-sm font-semibold">{planTimeLeftText}</p>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={closePlanModal}
                    className="h-10 w-10 rounded-xl border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 cursor-pointer"
                    aria-label="Close plan modal"
                  >
                    x
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                Pick any plan and the system will immediately apply it—no payment workflow required.
              </p>
              <div className="mt-5 space-y-3">
                {PLAN_OPTIONS.map((option) => {
                  const isParentRestricted =
                    isParentAccount && ["free", "student_premium"].includes(option.type);
                  const isDisabled =
                    ((isSchoolAccount || isTeacherAccount) &&
                      option.type !== "educational_institutions_premium") ||
                    isParentRestricted;
                  const getBlockedMessage = () => {
                    if (isParentRestricted) {
                      return (
                        PARENT_BLOCKED_MESSAGES[option.type] ||
                        `Parent accounts cannot be set to ${option.label}`
                      );
                    }
                    if (isTeacherAccount) {
                      return (
                        TEACHER_BLOCKED_MESSAGES[option.type] ||
                        `Teacher accounts cannot be set to ${option.label}`
                      );
                    }
                    if (isSchoolAccount) {
                      return (
                        SCHOOL_BLOCKED_MESSAGES[option.type] ||
                        `School accounts cannot be set to ${option.label}`
                      );
                    }
                    return "Accounts cannot be upgraded or downgraded";
                  };
                  return (
                    <button
                      key={option.type}
                      type="button"
                      onClick={() => {
                        if (isDisabled) {
                          toast.error(getBlockedMessage());
                          return;
                        }
                        setSelectedPlanType(option.type);
                      }}
                      className={`w-full rounded-2xl border px-4 py-3 text-left transition ${selectedPlanType === option.type
                          ? "border-indigo-500 bg-indigo-50 shadow-inner cursor-pointer"
                          : "border-gray-200 bg-white hover:border-indigo-300 cursor-pointer"
                        } ${isDisabled ? "cursor-not-allowed opacity-60 hover:border-gray-200" : ""}`}
                      aria-pressed={selectedPlanType === option.type}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{option.label}</p>
                          <p className="text-xs text-gray-500">{option.description}</p>
                        </div>
                        {selectedPlanType === option.type && (
                          <span className="text-xs font-bold uppercase text-indigo-600">Selected</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              {requiresStudentSchoolLinking && (
                <div className="mt-4 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50 p-4 text-sm text-gray-700">
                  <p className="text-xs uppercase tracking-wide text-indigo-600">
                    Secret Linking Code
                  </p>
                  <input
                    type="text"
                    value={schoolLinkingCode}
                    onChange={(event) => setSchoolLinkingCode(event.target.value)}
                    placeholder="Enter school code"
                    className="mt-2 w-full rounded-2xl border border-indigo-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Provide a valid school linking code so the student can be mapped to the campus.
                  </p>
                </div>
              )}
              {requiresParentChildEmail && (
                <div className="mt-4 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50 p-4 text-sm text-gray-700">
                  <p className="text-xs uppercase tracking-wide text-indigo-600">Child email</p>
                  <input
                    type="email"
                    value={planModalChildEmail}
                    onChange={(event) => setPlanModalChildEmail(event.target.value)}
                    placeholder="Enter linked child's email"
                    className="mt-2 w-full rounded-2xl border border-indigo-200 bg-white px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none"
                  />
                  {planModalChildEmail.trim() && (
                    <p
                      className={`mt-2 text-xs font-semibold ${childEmailMatches ? "text-emerald-600" : "text-gray-500"
                        }`}
                    >
                      {childEmailMatches
                        ? "Child found."
                        : "The system will verify this child before applying the plan."}
                    </p>
                  )}
                  {planModalChildLoading && (
                    <p className="mt-2 text-xs text-gray-500">Loading linked students…</p>
                  )}
                  {!planModalChildLoading && planModalChildList.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {planModalChildList.map((childOption) => {
                        const normalizedOptionEmail = childOption.email?.toLowerCase() || "";
                        const matches = normalizedOptionEmail === normalizedChildEmail && normalizedChildEmail;
                        return (
                          <button
                            key={childOption.id || childOption.email || childOption.name}
                            type="button"
                            onClick={() => setPlanModalChildEmail(childOption.email || "")}
                            className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${matches
                                ? "border-indigo-600 bg-indigo-600 text-white"
                                : "border-gray-200 bg-white text-gray-600 hover:border-indigo-300"
                              }`}
                          >
                            <span className="block">
                              {childOption.email || childOption.name || "Linked student"}
                            </span>
                            {childOption.name && childOption.email && (
                              <span className="text-[11px] uppercase tracking-wide text-gray-400">
                                {childOption.name}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {!planModalChildLoading && planModalChildList.length === 0 && (
                    <p className="mt-2 text-xs text-gray-500">
                      No linked students available for this parent.
                    </p>
                  )}
                  {planModalChildError && (
                    <p className="mt-2 text-xs text-rose-600">{planModalChildError}</p>
                  )}
                </div>
              )}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closePlanModal}
                  className="rounded-2xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:border-gray-300 hover:text-gray-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePlanUpdate}
                  disabled={planUpdating}
                  className="rounded-2xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {planUpdating ? "Updating…" : "Confirm plan change"}
                </button>
              </div>
            </div>
          </div>
        )}
        {detailModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeDetailModal}
              aria-hidden="true"
            />
            <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-black/10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-indigo-500">Account details</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {detailData?.user?.name || "Account details"}
                  </h3>
                  {detailData?.user?.email && (
                    <p className="text-sm text-gray-500">{detailData.user.email}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={closeDetailModal}
                  className="h-10 w-10 rounded-xl border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 cursor-pointer"
                  aria-label="Close detail modal"
                >
                  x
                </button>
              </div>
              {detailLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-500" />
                </div>
              ) : detailError ? (
                <p className="text-sm text-rose-600 mt-6">{detailError}</p>
              ) : !detailData?.user ? (
                <p className="text-sm text-gray-500 mt-6">No details are available for this account.</p>
              ) : (
                <>
                  <div className="mt-6 space-y-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">Mobile</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {detailData.user.phone || "Not provided"}
                        </p>
                      </div>
                      {(detailData.schoolSummary?.location ||
                        detailData.user.schoolName ||
                        parentCityName(detailData)) && (
                          <div>
                            <p className="text-xs uppercase tracking-wide text-gray-500">School</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {detailData.schoolSummary?.location ||
                                detailData.user.schoolName ||
                                parentCityName(detailData)}
                            </p>
                          </div>
                        )}
                      {detailData.schoolLinkingCode && (
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-3">
                            <p className="text-[11px] uppercase tracking-[0.3em] text-indigo-500">
                              Secret Linking Code
                            </p>
                          </div>
                          <div className="flex items-center justify-between rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50/80 via-indigo-50/40 to-transparent px-4 py-3 shadow-inner shadow-indigo-100">
                            <span className="text-base font-bold tracking-wide text-indigo-900">
                              {detailData.schoolLinkingCode}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const code = detailData.schoolLinkingCode || "";
                                if (navigator.clipboard && code) {
                                  navigator.clipboard
                                    .writeText(code)
                                    .then(() => {
                                      setLinkingCodeCopied(true);
                                      if (copyTimeoutRef.current) {
                                        clearTimeout(copyTimeoutRef.current);
                                      }
                                      copyTimeoutRef.current = setTimeout(() => {
                                        setLinkingCodeCopied(false);
                                      }, 2000);
                                    })
                                    .catch(() => {
                                      toast.error("Unable to copy linking code");
                                    });
                                } else {
                                  toast.error("Unable to copy linking code");
                                }
                              }}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-indigo-700 transition hover:text-indigo-900 cursor-pointer"
                              aria-label="Copy linking code"
                            >
                              {linkingCodeCopied ? (
                                <Check className="h-4 w-4 text-emerald-600" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                      {(detailData.user.dateOfBirth || detailData.user.gender) && (
                        <>
                          <div>
                            <p className="text-xs uppercase tracking-wide text-gray-500">Date of Birth</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {detailData.user.dateOfBirth
                                ? formatDate(detailData.user.dateOfBirth)
                                : "Not set"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wide text-gray-500">Gender</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {detailData.user.gender
                                ? detailData.user.gender.charAt(0).toUpperCase() +
                                detailData.user.gender.slice(1)
                                : "Not specified"}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                    {detailData.schoolSummary && (
                      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                        <p className="text-xs uppercase tracking-wide text-gray-500">School summary</p>
                        <div className="mt-2 grid gap-4 md:grid-cols-3">
                          <div>
                            <p className="text-2xl font-bold text-gray-900">
                              {detailData.schoolSummary.totalStudents ?? 0}
                            </p>
                            <p className="text-xs uppercase tracking-wide text-gray-500">Students</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900">
                              {detailData.schoolSummary.totalTeachers ?? 0}
                            </p>
                            <p className="text-xs uppercase tracking-wide text-gray-500">Teachers</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              {dedupeAddressString(detailData.schoolSummary.location) || "Location not set"}
                            </p>
                            <p className="text-xs uppercase tracking-wide text-gray-500">Location</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {isParentRole(detailData) && (
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">Linked students</p>
                        {detailData.parentDetails?.linkedStudents?.length ? (
                          <ul className="mt-2 space-y-2">
                            {detailData.parentDetails.linkedStudents.map((child) => (
                              <li key={child.id} className="text-sm text-gray-700">
                                <span className="font-semibold text-gray-900">{child.name}</span>
                                {child.schoolName && (
                                  <span className="text-xs text-gray-500 block">
                                    {child.schoolName}
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-1 text-sm text-gray-500">
                            No students linked to this parent.
                          </p>
                        )}
                      </div>
                    )}
                    {isTeacherRole(detailData) && detailData.teacherStats && (
                      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                        <p className="text-xs uppercase tracking-wide text-gray-500">Teacher summary</p>
                        <div className="mt-2 grid gap-4 md:grid-cols-3">
                          <div>
                            <p className="text-2xl font-bold text-gray-900">{detailData.teacherStats.totalClasses}</p>
                            <p className="text-xs uppercase tracking-wide text-gray-500">Classes</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900">{detailData.teacherStats.totalStudents}</p>
                            <p className="text-xs uppercase tracking-wide text-gray-500">Students</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              {detailData.teacherStats.schoolName || "School not assigned"}
                            </p>
                            <p className="text-xs uppercase tracking-wide text-gray-500">School</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {isStudentRole(detailData) && (
                      <div className="grid gap-6 md:grid-cols-2">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-500">Parents</p>
                          {detailData.parents?.length ? (
                            <ul className="mt-2 space-y-2">
                              {detailData.parents.map((parent) => (
                                <li key={parent.id} className="flex flex-col text-sm text-gray-700">
                                  <span className="font-semibold text-gray-900">{parent.name}</span>
                                  <span>{parent.email || "Email not provided"}</span>
                                  <span className="text-xs text-gray-500">
                                    {parent.phone || "Phone not provided"}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="mt-1 text-sm text-gray-500">No linked parents.</p>
                          )}
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wide text-gray-500">Teachers</p>
                          {detailData.teachers?.length ? (
                            <ul className="mt-2 space-y-2">
                              {detailData.teachers.map((teacher) => (
                                <li key={teacher.id} className="flex flex-col text-sm text-gray-700">
                                  <span className="font-semibold text-gray-900">{teacher.name}</span>
                                  <span>{teacher.email || "Email not provided"}</span>
                                  <span className="text-xs text-gray-500">
                                    {teacher.phone || "Phone not provided"}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="mt-1 text-sm text-gray-500">No linked teachers.</p>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <button
                        type="button"
                        onClick={openDeleteConfirm}
                        className="w-full max-w-xs rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 hover:border-red-300 cursor-pointer"
                      >
                        Delete account
                      </button>
                      <div className="pt-3">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${detailData.user.isVerified
                              ? "bg-green-50 text-green-700 border border-green-100"
                              : "bg-yellow-50 text-amber-700 border border-amber-100"
                            }`}
                        >
                          {detailData.user.isVerified ? "Verified" : "Unverified"}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        {deleteConfirmOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setDeleteConfirmOpen(false)}
              aria-hidden="true"
            />
            <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-black/10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Confirm delete</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    This action permanently removes the account and all related data.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="h-10 w-10 rounded-xl text-gray-500 hover:text-gray-700 cursor-pointer"
                  aria-label="Close delete confirmation"
                >
                  x
                </button>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmOpen(false)}
                  className="rounded-2xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:border-gray-300 hover:text-gray-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAccountDelete}
                  disabled={deleteLoading}
                  className="rounded-2xl bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {deleteLoading ? "Deleting…" : "Delete account"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminIndividuals;
