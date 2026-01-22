import React, { useEffect, useMemo, useState } from "react";
import { Filter, Star } from "lucide-react";
import testimonialService from "../../services/testimonialService";

const ratingOptions = ["all", "5", "4", "3", "2", "1"];

const renderStars = (rating = 0) => {
  return Array.from({ length: 5 }, (_, index) => (
    <Star
      key={index}
      className={`h-4 w-4 ${
        index < Math.floor(rating) ? "text-amber-500" : "text-slate-300"
      }`}
    />
  ));
};

const CSRTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [schoolFilter, setSchoolFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [error, setError] = useState("");

  const loadTestimonials = async () => {
    setLoading(true);
    setError("");
    try {
      const payload = await testimonialService.list();
      setTestimonials(payload?.data || []);
    } catch (err) {
      setError(err?.message || "Unable to load testimonials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const featuredTestimonials = useMemo(
    () => testimonials.filter((item) => item.isFeatured),
    [testimonials]
  );

  const filteredTestimonials = useMemo(() => {
    return testimonials.filter((item) => {
      if (ratingFilter !== "all" && Math.floor(item.rating || 0) < Number(ratingFilter)) {
        return false;
      }
      if (schoolFilter) {
        const schoolId = item.schoolId?.toString?.() || "";
        return schoolId.includes(schoolFilter.trim());
      }
      return true;
    });
  }, [testimonials, ratingFilter, schoolFilter]);

  const testimonialCards = useMemo(
    () => filteredTestimonials.filter((item) => !item.isFeatured),
    [filteredTestimonials]
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Testimonials</p>
          <h1 className="text-3xl font-bold text-slate-900">Stories of impact</h1>
          <p className="text-sm text-slate-500">
            Read how CSR partnerships are transforming classrooms, with featured stories and fresh
            submissions from schools.
          </p>
        </header>

        <section>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              <Filter className="h-4 w-4" />
              Filters
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <input
                value={schoolFilter}
                onChange={(e) => setSchoolFilter(e.target.value)}
                className="w-44 rounded-2xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="School ID"
              />
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                {ratingOptions.map((rating) => (
                  <option key={rating} value={rating}>
                    {rating === "all" ? "All ratings" : `${rating}★ & up`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-slate-900">Featured testimonials</h2>
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-6 text-sm text-slate-500">
              Loading featured stories...
            </div>
          ) : featuredTestimonials.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-6 text-sm text-slate-500">
              No featured testimonials yet.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {featuredTestimonials.map((item) => (
                <article
                  key={item.testimonialId}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Featured</p>
                    <div className="flex items-center gap-1">{renderStars(item.rating)}</div>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-slate-900">{item.title || "Impact story"}</h3>
                  <p className="mt-2 text-sm text-slate-600">{item.message}</p>
                  <p className="mt-3 text-xs text-slate-500">School: {item.schoolId || "Unknown"}</p>
                  {item.media?.videoUrl && (
                    <div className="mt-4">
                      <video
                        controls
                        src={item.media.videoUrl}
                        className="w-full rounded-2xl border border-slate-200"
                      />
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">All testimonials</h2>
            <p className="text-xs text-slate-400">{testimonialCards.length} stories</p>
          </div>
          {error && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {testimonialCards.map((item) => (
              <article
                key={item.testimonialId}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500" />
                    <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
                      Rating
                    </span>
                  </div>
                  <div className="flex items-center gap-1">{renderStars(item.rating)}</div>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-slate-900">
                  {item.title || "Impact story"}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{item.message}</p>
                <p className="mt-3 text-xs text-slate-500">School: {item.schoolId || "Unknown"}</p>
                {item.media?.videoUrl && (
                  <div className="mt-4">
                    <video
                      controls
                      src={item.media.videoUrl}
                      className="w-full rounded-2xl border border-slate-200"
                    />
                  </div>
                )}
                {item.media?.photos?.length > 0 && (
                  <div className="mt-3 flex items-center gap-2">
                    {item.media.photos.slice(0, 3).map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={item.title || "Testimonial photo"}
                        className="h-14 w-14 rounded-2xl object-cover"
                      />
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
          {testimonialCards.length === 0 && !loading && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500">
              Nothing matched your filters.
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CSRTestimonials;
