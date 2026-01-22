import React, { useEffect, useState } from "react";
import { Check, ThumbsDown, Video, Image } from "lucide-react";
import toast from "react-hot-toast";
import testimonialService from "../../services/testimonialService";

const AdminCSRTestimonials = () => {
  const [pending, setPending] = useState([]);
  const [refreshing, setRefreshing] = useState(true);
  const [notes, setNotes] = useState({});
  const [featuredFlags, setFeaturedFlags] = useState({});

  const loadPending = async () => {
    setRefreshing(true);
    try {
      const payload = await testimonialService.admin.pending();
      setPending(payload?.data || []);
      const featuredState = {};
      (payload?.data || []).forEach((item) => {
        featuredState[item._id] = item.isFeatured;
      });
      setFeaturedFlags(featuredState);
    } catch (err) {
      toast.error(err?.message || "Unable to load testimonials");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleApprove = async (testimonial) => {
    try {
      await testimonialService.admin.approve(testimonial._id, {
        isFeatured: Boolean(featuredFlags[testimonial._id]),
        reviewNotes: notes[testimonial._id] || "",
      });
      toast.success("Testimonial approved");
      setPending((prev) => prev.filter((item) => item._id !== testimonial._id));
    } catch (err) {
      toast.error(err?.message || "Approval failed");
    }
  };

  const handleReject = async (testimonial) => {
    try {
      await testimonialService.admin.reject(testimonial._id, {
        reason: notes[testimonial._id] || "Not a good fit",
      });
      toast.success("Testimonial rejected");
      setPending((prev) => prev.filter((item) => item._id !== testimonial._id));
    } catch (err) {
      toast.error(err?.message || "Rejection failed");
    }
  };

  const toggleFeatured = (id) => {
    setFeaturedFlags((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-10 space-y-6">
        <header>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Admin CSR</p>
          <h1 className="text-3xl font-semibold text-slate-900">Pending Testimonials</h1>
          <p className="text-sm text-slate-500">
            Review school submissions, approve the best stories, and highlight featured experiences.
          </p>
        </header>

        <section className="space-y-4">
          {refreshing && (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
              Loading pending testimonials...
            </div>
          )}
          {!refreshing && pending.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500">
              No pending testimonials at the moment.
            </div>
          )}
          {pending.map((testimonial) => (
            <article
              key={testimonial._id}
              className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Submitted by</p>
                  <h2 className="text-lg font-semibold text-slate-900">{testimonial.title || "Untitled"}</h2>
                  <p className="text-sm text-slate-500">
                    School: {testimonial.schoolId || "Unknown"} • Rating: {testimonial.rating || 0} ★
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 text-xs text-slate-500">
                  <span>{new Date(testimonial.createdAt).toLocaleDateString()}</span>
                  <button
                    type="button"
                    onClick={() => toggleFeatured(testimonial._id)}
                    className={`rounded-full border px-3 py-1 uppercase tracking-[0.3em] text-xs ${
                      featuredFlags[testimonial._id]
                        ? "border-indigo-600 text-indigo-600"
                        : "border-slate-200 text-slate-400"
                    }`}
                  >
                    {featuredFlags[testimonial._id] ? "Featured" : "Set featured"}
                  </button>
                </div>
              </div>
              <p className="text-sm text-slate-600">{testimonial.message}</p>
              {testimonial.media?.videoUrl && (
                <video
                  controls
                  src={testimonial.media.videoUrl}
                  className="w-full rounded-2xl border border-slate-200"
                />
              )}
              {testimonial.media?.photos?.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {testimonial.media.photos.map((photo, index) => (
                    <img
                      key={`${photo}-${index}`}
                      src={photo}
                      alt={`Photo ${index + 1}`}
                      className="h-24 w-full rounded-2xl object-cover"
                    />
                  ))}
                </div>
              )}
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Comments</label>
                <textarea
                  rows={2}
                  value={notes[testimonial._id] || ""}
                  onChange={(e) =>
                    setNotes((prev) => ({ ...prev, [testimonial._id]: e.target.value }))
                  }
                  className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Optional review notes"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => handleApprove(testimonial)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white"
                >
                  <Check className="h-4 w-4" />
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => handleReject(testimonial)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-rose-600"
                >
                  <ThumbsDown className="h-4 w-4" />
                  Reject
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
};

export default AdminCSRTestimonials;
