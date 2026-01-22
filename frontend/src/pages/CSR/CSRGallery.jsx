import React, { useEffect, useMemo, useState } from "react";
import { Image, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import csrService from "../../services/csrService";
import testimonialService from "../../services/testimonialService";

const CSRGallery = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("");
  const [form, setForm] = useState({
    url: "",
    caption: "",
    schoolId: "",
  });
  const [loading, setLoading] = useState(true);
  const [modalItem, setModalItem] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialLoading, setTestimonialLoading] = useState(true);
  const navigate = useNavigate();

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await csrService.gallery.list({ schoolId: filter });
      setItems(res?.data || []);
    } catch (err) {
      toast.error(err?.message || "Unable to fetch gallery");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [filter]);

  const fetchTestimonials = async () => {
    setTestimonialLoading(true);
    try {
      const res = await testimonialService.list();
      setTestimonials(res?.data || []);
    } catch (err) {
      toast.error(err?.message || "Unable to fetch testimonials");
    } finally {
      setTestimonialLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const testimonialPhotos = useMemo(
    () => testimonials.flatMap((testimonial) => testimonial.media?.photos || []),
    [testimonials]
  );

  const handleUpload = async (event) => {
    event.preventDefault();
    try {
      await csrService.gallery.upload({
        url: form.url,
        caption: form.caption,
        schoolId: form.schoolId,
        mediaType: "photo",
      });
      toast.success("Gallery item uploaded");
      setForm({ url: "", caption: "", schoolId: "" });
      fetchItems();
    } catch (err) {
      toast.error(err?.message || "Upload failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <header className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Gallery</p>
            <h1 className="text-3xl font-bold text-slate-900">CSR Moments</h1>
          </div>
          <div className="flex items-center gap-3">
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter by school ID"
              className="rounded-2xl border border-slate-200 px-4 py-2 text-sm"
            />
            <button
              onClick={() => fetchItems()}
              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white"
            >
              <Image className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {items.length === 0 && !loading ? (
            <div className="col-span-3 rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
              No media uploaded yet.
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.galleryId}
                className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
              >
                <div
                  className="h-48 cursor-pointer bg-slate-100"
                  style={{ backgroundImage: `url(${item.thumbnailUrl || item.url})`, backgroundSize: "cover" }}
                  onClick={() => setModalItem(item)}
                />
                <div className="p-4">
                  <p className="text-sm font-semibold text-slate-900">{item.caption || "Untitled"}</p>
                  <p className="text-xs text-slate-400">{item.sdgTags?.join(", ")}</p>
                </div>
              </div>
            ))
          )}
        </section>

        <section className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Testimonial photos</p>
              <h2 className="text-lg font-semibold text-slate-900">Featured snapshots</h2>
            </div>
            <button
              type="button"
              onClick={() => navigate("/csr/testimonials")}
              className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-600"
            >
              View testimonials
            </button>
          </div>
          {testimonialLoading ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
              Loading testimonial highlights...
            </div>
          ) : testimonialPhotos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-6 text-sm text-slate-500">
              No testimonial photos available yet.
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-4">
              {testimonialPhotos.map((photo, index) => (
                <img
                  key={`${photo}-${index}`}
                  src={photo}
                  alt={`Testimonial ${index + 1}`}
                  className="h-32 w-full rounded-2xl object-cover"
                />
              ))}
            </div>
          )}
        </section>

        <section className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl px-6 py-5 shadow-lg text-white">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-indigo-200">Share your story</p>
              <h2 className="text-2xl font-semibold">Schools, add your testimonial</h2>
              <p className="text-sm text-indigo-100">
                Capture the impact you see in classrooms and submit a testimonial directly.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/school/testimonial/submit")}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white shadow-lg transition hover:border-white"
            >
              Submit testimonial
            </button>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-600" />
            <h2 className="text-lg font-semibold text-slate-900">Upload media</h2>
          </div>
          <form className="space-y-3" onSubmit={handleUpload}>
            <input
              value={form.url}
              onChange={(e) => setForm((prev) => ({ ...prev, url: e.target.value }))}
              placeholder="Photo or video URL"
              className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
            />
            <input
              value={form.caption}
              onChange={(e) => setForm((prev) => ({ ...prev, caption: e.target.value }))}
              placeholder="Caption"
              className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
            />
            <input
              value={form.schoolId}
              onChange={(e) => setForm((prev) => ({ ...prev, schoolId: e.target.value }))}
              placeholder="School ID"
              className="w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-md"
            >
              Upload to gallery
            </button>
          </form>
        </section>
      </div>

      {modalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative max-w-3xl w-full rounded-2xl bg-white p-4 shadow-xl">
            <button
              onClick={() => setModalItem(null)}
              className="absolute right-4 top-4 rounded-full bg-slate-100 p-2 text-slate-500"
            >
              <X className="w-4 h-4" />
            </button>
            <img src={modalItem.url} alt={modalItem.caption} className="w-full rounded-2xl object-cover" />
            <p className="mt-3 text-sm text-slate-600">{modalItem.caption}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CSRGallery;
