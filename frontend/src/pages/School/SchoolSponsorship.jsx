import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Camera, HeartHandshake, ShieldCheck, Users } from "lucide-react";
import schoolSponsorshipService from "../../services/schoolSponsorshipService";
import { toast } from "react-hot-toast";

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const SchoolSponsorship = () => {
  const [sponsorship, setSponsorship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [schoolInfo, setSchoolInfo] = useState(null);
  const [studentCount, setStudentCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchSponsorship = async () => {
      try {
        const { sponsorship: payload, school, studentCount: covered } = await schoolSponsorshipService.getDetails();
        if (!isMounted) return;
        setSponsorship(payload || null);
        setSchoolInfo(school || null);
        setStudentCount(covered || 0);
      } catch (error) {
        toast.error("Unable to load sponsorship data right now.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchSponsorship();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500 text-lg font-semibold">Loading sponsorship...</div>
      </div>
    );
  }

  const sponsor = sponsorship?.sponsorId || {};
  const hasSponsor = Boolean(sponsorship && sponsor.companyName);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 pt-10 pb-16 space-y-8">
        <header className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-wide text-indigo-500 font-semibold">Sponsored Partnership</p>
              <h1 className="text-3xl font-black text-slate-900">School Sponsorship</h1>
              <p className="text-sm text-slate-500 mt-1">Track the CSR partner, students, and impact commitments.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/school/sponsorship/gallery")}
                className="px-4 py-2 bg-indigo-600 text-white rounded-2xl flex items-center gap-2 text-sm font-semibold shadow-md hover:bg-indigo-500 transition"
              >
                <Camera className="w-4 h-4" />
                Upload photos/videos
              </button>
              <button
                onClick={() => navigate("/school/sponsorship/thank-you")}
                className="px-4 py-2 border border-slate-200 rounded-2xl flex items-center gap-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                <HeartHandshake className="w-4 h-4 text-rose-500" />
                Send thank you
              </button>
            </div>
          </div>
        </header>

        {hasSponsor ? (
          <section className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-center gap-4">
                {sponsor.metadata?.logo ? (
                  <img src={sponsor.metadata.logo} alt={sponsor.companyName} className="w-20 h-20 rounded-2xl object-cover border-2 border-white/40" />
                ) : (
                  <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white">
                    {sponsor.companyName?.[0] || "S"}
                  </div>
                )}
                <div>
                  <p className="text-sm uppercase tracking-wide text-white/80">Partner</p>
                  <h3 className="text-2xl font-black">{sponsor.companyName}</h3>
                  <p className="text-sm text-white/80 mt-1">{sponsor.industry || "Corporate CSR"}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/20">
                  <p className="text-xs uppercase tracking-wide text-white/70">Period</p>
                  <p className="font-semibold text-lg">
                    {formatDate(sponsorship.startDate)} - {formatDate(sponsorship.endDate)}
                  </p>
                </div>
                <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/20">
                  <p className="text-xs uppercase tracking-wide text-white/70">Students covered</p>
                  <p className="font-semibold text-lg">{studentCount}</p>
                </div>
                <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/20">
                  <p className="text-xs uppercase tracking-wide text-white/70">Committed budget</p>
                  <p className="font-semibold text-lg">₹{sponsorship.committedFunds?.toLocaleString("en-IN") || 0}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/10 p-4 rounded-2xl">
                <p className="text-xs uppercase text-white/70 tracking-wide">Status</p>
                <p className="font-semibold text-lg">{sponsorship.status || "Active"}</p>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl">
                <p className="text-xs uppercase text-white/70 tracking-wide">Focused SDGs</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(sponsorship.sdgMapping || []).slice(0, 3).map((sdg) => (
                    <span key={sdg.sdgCode} className="px-3 py-1 bg-white/20 rounded-full text-xs uppercase">
                      {sdg.sdgCode}
                    </span>
                  ))}
                  {!sponsorship.sdgMapping?.length && <span className="text-xs uppercase text-white/70">No mapping yet</span>}
                </div>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl">
                <p className="text-xs uppercase text-white/70 tracking-wide">Next renewal</p>
                <p className="font-semibold text-lg">{formatDate(sponsorship.renewal?.nextRenewalDate)}</p>
              </div>
            </div>
          </section>
        ) : (
          <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm text-slate-600">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-indigo-600" />
              <div>
                <p className="text-sm font-semibold">No sponsor linked yet</p>
                <p className="text-sm text-slate-500">
                  Share this page with your CSR partner to register their sponsorship or contact support.
                </p>
              </div>
            </div>
          </section>
        )}

        {schoolInfo && (
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-wide text-indigo-500">School</p>
                <h2 className="text-2xl font-black">{schoolInfo.name}</h2>
              </div>
              <button
                onClick={() => navigate("/school/sponsorship")}
                className="text-indigo-600 font-semibold flex items-center gap-1 text-sm"
              >
                Refresh <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Relationship started</p>
                <p className="font-semibold">{formatDate(schoolInfo.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Campus count</p>
                <p className="font-semibold">{schoolInfo.campuses?.length || 1}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Active students</p>
                <p className="font-semibold">{schoolInfo.userCount || 0}</p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default SchoolSponsorship;
