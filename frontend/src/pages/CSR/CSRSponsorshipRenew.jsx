import React, { useEffect, useMemo, useState } from "react";
import { Calendar, DollarSign, Repeat, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import csrSponsorshipService from "../../services/csrSponsorshipService";

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const padDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().slice(0, 10);
};

const CSRSponsorshipRenew = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    durationMonths: 12,
    totalBudget: 0,
    type: "full",
    startDate: "",
    renewalNotes: "",
  });

  const fetchDetails = async () => {
    setLoading(true);
    try {
      const response = await csrSponsorshipService.get(id);
      setDetails(response?.data);
    } catch (err) {
      console.error("Failed to load sponsorship for renewal", err);
      toast.error(err.response?.data?.message || "Unable to fetch sponsorship");
      navigate("/csr/sponsorships");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  useEffect(() => {
    if (details) {
      const defaultStart = details.endDate
        ? new Date(details.endDate)
        : new Date();
      defaultStart.setDate(defaultStart.getDate() + 1);

      setForm((prev) => ({
        ...prev,
        durationMonths: details.durationMonths || 12,
        totalBudget: details.totalBudget || 0,
        type: details.type || "full",
        startDate: padDate(defaultStart),
      }));
    }
  }, [details]);

  const computedEndDate = useMemo(() => {
    if (!form.startDate || !form.durationMonths) return null;
    const start = new Date(form.startDate);
    const end = new Date(start);
    end.setMonth(end.getMonth() + Number(form.durationMonths || 0));
    return end;
  }, [form]);

  const remainingBudget = useMemo(() => {
    const target = Number(form.totalBudget || 0);
    const committed = details?.committedFunds || 0;
    return target - committed;
  }, [form.totalBudget, details]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!details) return;
    setSubmitting(true);
    try {
      const payload = {
        durationMonths: Number(form.durationMonths),
        totalBudget: Number(form.totalBudget),
        type: form.type,
        startDate: form.startDate,
        endDate: computedEndDate?.toISOString(),
        renewalNotes: form.renewalNotes || "CSR renewal submission",
      };
      const response = await csrSponsorshipService.renew(details._id, payload);
      toast.success("Renewal created successfully");
      navigate(`/csr/sponsorships/${response?.data?.renewal?._id || details._id}`);
    } catch (err) {
      console.error("Renewal failed:", err);
      toast.error(err.response?.data?.message || "Renewal submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !details) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="inline-flex items-center gap-2 rounded-xl border px-5 py-3 bg-white text-slate-600 shadow">
          <Repeat className="w-4 h-4 animate-spin" />
          Preparing renewal workspace...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Renew Sponsorship</p>
            <h1 className="text-3xl font-bold text-slate-900">Renew {details.title}</h1>
            <p className="text-sm text-slate-500">Keep your impact ongoing with the same school partner.</p>
          </div>
          <button
            onClick={() => navigate(`/csr/sponsorships/${details._id}`)}
            className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-400"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to sponsorship
          </button>
        </div>

        <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <p className="text-sm font-semibold text-slate-900">Current Sponsorship Details</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Duration</p>
              <p className="text-lg font-semibold text-slate-900">
                {details.durationMonths || "N/A"} months
              </p>
              <p className="text-xs text-slate-500">
                {new Date(details.startDate || details.createdAt).toLocaleDateString()} –{" "}
                {new Date(details.endDate || Date.now()).toLocaleDateString()}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Budget</p>
              <p className="text-2xl font-semibold text-slate-900">
                {formatCurrency(details.totalBudget)}
              </p>
              <p className="text-xs text-slate-500">Status: {details.status}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Type</p>
              <p className="text-lg font-semibold text-slate-900">{details.type || "Full"}</p>
              <p className="text-xs text-slate-500">{details.schoolId || "School ID unknown"}</p>
            </div>
          </div>
        </section>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 space-y-6"
        >
          <div className="flex items-center gap-3">
            <Repeat className="w-5 h-5 text-indigo-600" />
            <p className="text-sm font-semibold text-slate-900">Renewal Options</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2 text-sm text-slate-600">
              <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Duration (months)</span>
              <input
                type="number"
                min={1}
                value={form.durationMonths}
                onChange={(e) => handleChange("durationMonths", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-slate-900"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-600">
              <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Start date</span>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-slate-900"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-600">
              <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Type</span>
              <select
                value={form.type}
                onChange={(e) => handleChange("type", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-slate-900"
              >
                <option value="full">Full</option>
                <option value="partial">Partial</option>
                <option value="urgent">Urgent</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-600">
              <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Total budget</span>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 px-3 py-2">
                <DollarSign className="w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  min={0}
                  value={form.totalBudget}
                  onChange={(e) => handleChange("totalBudget", e.target.value)}
                  className="w-full border-none bg-transparent text-slate-900 focus:ring-0"
                />
              </div>
            </label>
            <label className="space-y-2 text-sm text-slate-600">
              <span className="text-xs uppercase tracking-[0.3em] text-slate-400">Notes</span>
              <textarea
                value={form.renewalNotes}
                onChange={(e) => handleChange("renewalNotes", e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-slate-900"
                rows={3}
                placeholder="Optional notes for the renewal request"
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-1">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Projected end date</p>
              <p className="text-lg font-semibold text-slate-900">
                {computedEndDate ? computedEndDate.toLocaleDateString() : "Select dates"}
              </p>
              <p className="text-xs text-slate-500">Based on duration and start date</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-1">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Remaining budget</p>
              <p className="text-lg font-semibold text-slate-900">{formatCurrency(remainingBudget)}</p>
              <p className="text-xs text-slate-500">Committed funds carry over from current sponsorship</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold uppercase tracking-[0.4em] text-white transition hover:bg-indigo-500 disabled:opacity-50"
            >
              <Repeat className="w-4 h-4" />
              {submitting ? "Creating renewal..." : "Create Renewal"}
            </button>
            <p className="text-xs text-slate-500">
              Renewals are drafted as new sponsorships so you can review budgets, students, and approvals before activation.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CSRSponsorshipRenew;
