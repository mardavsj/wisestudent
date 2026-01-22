import React, { useEffect, useState } from "react";
import { ShieldCheck, Upload } from "lucide-react";
import toast from "react-hot-toast";
import csrService from "../../services/csrService";

const sdgOptions = [
  "No Poverty",
  "Quality Education",
  "Gender Equality",
  "Decent Work",
  "Climate Action",
];

const CSRProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    industry: "",
    sdgGoals: [],
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await csrService.sponsor.profile();
        setProfile(res);
        setForm((prev) => ({
          ...prev,
          companyName: res.companyName || "",
          contactName: res.contactName || "",
          email: res.email || "",
          phone: res.phone || "",
          website: res.website || "",
          industry: res.industry || "",
          sdgGoals: res.sdgGoals?.map((goal) => goal.sdgCode) || [],
        }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const toggleGoal = (goal) => {
    setForm((prev) => ({
      ...prev,
      sdgGoals: prev.sdgGoals.includes(goal)
        ? prev.sdgGoals.filter((item) => item !== goal)
        : [...prev.sdgGoals, goal],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await csrService.sponsor.update({
        companyName: form.companyName,
        contactName: form.contactName,
        email: form.email,
        phone: form.phone,
        website: form.website,
        industry: form.industry,
        sdgGoals: form.sdgGoals.map((sdg) => ({ sdgCode: sdg })),
      });
      toast.success("Profile saved");
    } catch (err) {
      toast.error(err?.message || "Unable to save profile");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Profile</p>
          <h1 className="text-3xl font-bold text-slate-900">Company profile</h1>
          <p className="text-sm text-slate-500">Update company info, contact details, and SDG goals.</p>
        </header>
        <form className="space-y-4 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Company name</label>
              <input
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Industry</label>
              <input
                value={form.industry}
                onChange={(e) => setForm({ ...form, industry: e.target.value })}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Contact name</label>
              <input
                value={form.contactName}
                onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Email</label>
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Phone</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Website</label>
              <input
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-slate-400">SDG Goals</label>
            <div className="mt-3 grid gap-2 md:grid-cols-3">
              {sdgOptions.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => toggleGoal(goal)}
                  className={`rounded-2xl border px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] ${
                    form.sdgGoals.includes(goal)
                      ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                      : "border-slate-200 text-slate-600"
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-md"
          >
            <ShieldCheck className="w-4 h-4" />
            Save profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default CSRProfile;
