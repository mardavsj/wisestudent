import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import testimonialService from "../../services/testimonialService";

const SchoolTestimonialSubmit = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    schoolId: user?.orgId || user?.schoolId || "",
    title: "",
    message: "",
    rating: "5",
    videoUrl: "",
    impactTags: "",
  });
  const [photoInput, setPhotoInput] = useState("");
  const [photoUrls, setPhotoUrls] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleAddPhoto = () => {
    if (!photoInput.trim()) return;
    setPhotoUrls((prev) => [...prev, photoInput.trim()]);
    setPhotoInput("");
  };

  const handleRemovePhoto = (index) => {
    setPhotoUrls((prev) => prev.filter((_, idx) => idx !== index));
  };

  const impactTagArray = useMemo(
    () =>
      form.impactTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    [form.impactTags]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        schoolId: form.schoolId,
        title: form.title,
        message: form.message,
        rating: Number(form.rating),
        impactTags: impactTagArray,
        media: {
          photos: photoUrls,
          videoUrl: form.videoUrl,
        },
      };
      await testimonialService.submit(payload);
      toast.success("Thank you! Your testimonial is awaiting review.");
      navigate("/school/admin/dashboard");
    } catch (err) {
      console.error("Testimonial submission failed:", err);
      toast.error(err?.message || "Unable to submit testimonial");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-10 space-y-6">
        <header>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">School testimonial</p>
          <h1 className="text-3xl font-semibold text-slate-900">Share your CSR story</h1>
          <p className="text-sm text-slate-500">
            Tell donators how their support is changing outcomes. Upload photos, video, and a short
            testimonial that the CSR team can share.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          <form
            className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            onSubmit={handleSubmit}
          >
            <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Testimonial title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
              placeholder="Title (optional)"
            />

            <label className="text-xs uppercase tracking-[0.3em] text-slate-400">Message</label>
            <textarea
              required
              rows={4}
              value={form.message}
              onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
              className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
              placeholder="Describe the impact you've witnessed..."
            />

            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-2 text-xs uppercase tracking-[0.3em] text-slate-400">
                School ID
                <input
                  type="text"
                  value={form.schoolId}
                  onChange={(e) => setForm((prev) => ({ ...prev, schoolId: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
                  placeholder="School identifier"
                />
              </label>
              <label className="space-y-2 text-xs uppercase tracking-[0.3em] text-slate-400">
                Rating
                <select
                  value={form.rating}
                  onChange={(e) => setForm((prev) => ({ ...prev, rating: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm"
                >
                  {[5, 4, 3, 2, 1].map((value) => (
                    <option key={value} value={value}>
                      {value} ★
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Impact tags
              </label>
              <input
                type="text"
                value={form.impactTags}
                onChange={(e) => setForm((prev) => ({ ...prev, impactTags: e.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
                placeholder="e.g., STEM, Girls' education, Nutrition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Photo URLs
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={photoInput}
                  onChange={(e) => setPhotoInput(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="flex-1 rounded-2xl border border-slate-200 px-4 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddPhoto}
                  className="rounded-2xl bg-indigo-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {photoUrls.map((url, index) => (
                  <div key={`${url}-${index}`} className="relative">
                    <img src={url} alt={`Photo ${index + 1}`} className="h-16 w-16 rounded-2xl object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute -top-1 -right-1 rounded-full bg-rose-500 p-1 text-white"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Video URL
              </label>
              <input
                type="url"
                value={form.videoUrl}
                onChange={(e) => setForm((prev) => ({ ...prev, videoUrl: e.target.value }))}
                placeholder="https://example.com/video.mp4"
                className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-md disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit testimonial"}
            </button>
          </form>

          <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Preview</p>
              <h2 className="text-lg font-semibold text-slate-900">{form.title || "Untitled story"}</h2>
            </div>
            <p className="text-sm text-slate-600">{form.message || "Your message preview will appear here."}</p>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              Rating: {form.rating} ★
            </div>
            {photoUrls.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {photoUrls.map((url, index) => (
                  <img
                    key={`${url}-${index}`}
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="h-24 w-full rounded-2xl object-cover"
                  />
                ))}
              </div>
            )}
            {form.videoUrl && (
              <video controls src={form.videoUrl} className="w-full rounded-2xl border border-slate-200" />
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default SchoolTestimonialSubmit;
