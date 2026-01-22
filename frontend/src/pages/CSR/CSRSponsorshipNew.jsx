import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, ChevronLeft, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import csrSponsorshipService from "../../services/csrSponsorshipService";

const STEPS = [
  "Select School",
  "Choose Type",
  "Duration & Budget",
  "Confirm Sponsorship",
];

const SPONSORSHIP_TYPES = [
  { key: "full", label: "Full sponsorship" },
  { key: "partial", label: "Partial support" },
  { key: "urgent", label: "Urgent needs" },
];

const CSRSponsorshipNew = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [schoolFilter, setSchoolFilter] = useState("");
  const [type, setType] = useState("full");
  const [duration, setDuration] = useState(6);
  const [monthlyBudget, setMonthlyBudget] = useState(75000);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchSchools = async () => {
    try {
      const response = await csrSponsorshipService.getSchools({
        search: schoolFilter,
        includeInactive: false,
      });
      setSchools(response?.data || []);
    } catch (err) {
      console.error("Failed to load schools", err);
      toast.error("Unable to load schools");
    }
  };

  useEffect(() => {
    fetchSchools();
  }, [schoolFilter]);

  const estimatedTotal = useMemo(() => duration * monthlyBudget, [duration, monthlyBudget]);

  const handleCreate = async () => {
    if (!selectedSchool) {
      toast.error("Select a school before submitting");
      setStep(1);
      return;
    }
    if (!title) {
      toast.error("Give your sponsorship a title");
      return;
    }

    setSubmitting(true);
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + Number(duration));

      await csrSponsorshipService.create({
        title,
        description,
        type,
        schoolId: selectedSchool._id,
        startDate,
        endDate,
        durationMonths: Number(duration),
        totalBudget: estimatedTotal,
        costBreakdown: [
          {
            category: "Monthly support",
            amount: monthlyBudget,
          },
        ],
      });
      toast.success("Sponsorship created");
      navigate("/csr/sponsorships");
    } catch (err) {
      console.error("Creation failed", err);
      toast.error(err.response?.data?.message || "Unable to create sponsorship");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <header>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">New Sponsorship</p>
          <h1 className="text-3xl font-bold text-slate-900">Launch a new CSR partnership</h1>
          <p className="text-sm text-slate-500">
            Follow the guided steps to review schools, budgets, and commit to impact.
          </p>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 space-y-4">
          <div className="flex items-center gap-2">
            {STEPS.map((label, index) => (
              <div key={label} className="flex-1">
                <div
                  className={`text-xs font-semibold text-center uppercase tracking-[0.3em] rounded-full py-1 ${
                    index + 1 === step
                      ? "bg-indigo-600 text-white"
                      : index < step
                      ? "bg-indigo-50 text-indigo-600"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {index + 1}
                </div>
                <p className="text-[11px] text-center text-slate-500 mt-1">{label}</p>
              </div>
            ))}
          </div>

          {step === 1 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Choose a school</h2>
                <div className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600">
                  <Filter className="w-4 h-4" />
                  Filter
                </div>
              </div>
              <input
                value={schoolFilter}
                onChange={(e) => setSchoolFilter(e.target.value)}
                placeholder="Search by region or name"
                className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                {schools.map((school) => (
                  <button
                    key={school._id}
                    onClick={() => setSelectedSchool(school)}
                    type="button"
                    className={`text-left rounded-2xl border p-4 transition ${
                      selectedSchool?._id === school._id
                        ? "border-indigo-500 bg-indigo-50 shadow-inner"
                        : "border-slate-200 bg-white hover:border-indigo-300"
                    }`}
                  >
                    <p className="font-semibold text-slate-900">{school.name}</p>
                    <p className="text-xs text-slate-500">
                      {school.city || school.address?.city || "Unknown city"}
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                      Students onboarded: {school.studentCount ?? "N/A"}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Select Sponsorship Type</h2>
              <div className="grid gap-3 md:grid-cols-3">
                {SPONSORSHIP_TYPES.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setType(item.key)}
                    type="button"
                    className={`rounded-2xl border p-4 text-sm text-left transition ${
                      type === item.key
                        ? "border-indigo-500 bg-indigo-50 shadow-inner"
                        : "border-slate-200 bg-white hover:border-indigo-300"
                    }`}
                  >
                    <p className="font-semibold text-slate-900">{item.label}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Tailor the support for the current school priorities.
                    </p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Duration & Budget</h2>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Duration (months)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Monthly Budget (INR)
                  </label>
                  <input
                    type="number"
                    min={1000}
                    value={monthlyBudget}
                    onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
                <p className="text-xs uppercase tracking-widest text-slate-400">Estimated total</p>
                <p className="text-2xl font-semibold text-slate-900">₹{estimatedTotal.toLocaleString()}</p>
                <p className="text-xs text-slate-500">Based on {duration} months of support.</p>
              </div>
            </section>
          )}

          {step === 4 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Finalize Details</h2>
              <div className="grid gap-3">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Sponsorship title"
                  className="rounded-2xl border border-slate-200 px-4 py-2 text-sm"
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description for your team"
                  className="rounded-2xl border border-slate-200 px-4 py-2 text-sm min-h-[120px]"
                />
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm space-y-1">
                <p className="font-semibold text-slate-900 text-xs uppercase tracking-[0.3em]">Review</p>
                <p>School: {selectedSchool?.name || "TBD"}</p>
                <p>Type: {type}</p>
                <p>
                  Duration: {duration} month{duration > 1 ? "s" : ""} · Monthly ₹{monthlyBudget.toLocaleString()}
                </p>
                <p>Total Commitment: ₹{estimatedTotal.toLocaleString()}</p>
              </div>
            </section>
          )}

          <div className="flex items-center justify-between mt-4">
            {step > 1 ? (
              <button
                onClick={() => setStep((prev) => prev - 1)}
                className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-600"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div />
            )}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (step < STEPS.length) setStep((prev) => prev + 1);
                }}
                disabled={step === STEPS.length}
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-lg ${step === STEPS.length ? "bg-slate-300 cursor-not-allowed" : "bg-gradient-to-r from-indigo-600 to-purple-600"}`}
              >
                {step === STEPS.length ? "Review" : "Continue"}
                <ArrowRight className="w-4 h-4" />
              </button>
              {step === STEPS.length && (
                <button
                  onClick={handleCreate}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-wider"
                >
                  {submitting ? "Submitting..." : "Create Sponsorship"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CSRSponsorshipNew;
