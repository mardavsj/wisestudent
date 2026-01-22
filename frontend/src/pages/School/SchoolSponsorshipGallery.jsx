import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftCircle, Camera, UploadCloud, X } from "lucide-react";
import schoolSponsorshipService from "../../services/schoolSponsorshipService";
import { toast } from "react-hot-toast";

const SchoolSponsorshipGallery = () => {
  const [mediaUrl, setMediaUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [mediaType, setMediaType] = useState("photo");
  const [tags, setTags] = useState("");
  const [sdgTags, setSdgTags] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const navigate = useNavigate();

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setMediaUrl(reader.result);
      setPreview(reader.result);
      setMediaType(file.type.startsWith("video") ? "video" : "photo");
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileInput = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setMediaUrl(reader.result);
      setPreview(reader.result);
      setMediaType(file.type.startsWith("video") ? "video" : "photo");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!mediaUrl) {
      toast.error("Provide a photo or video URL.");
      return;
    }

    const payload = {
      url: mediaUrl,
      mediaType,
      caption,
      tags: tags ? tags.split(",").map((tag) => tag.trim()).filter(Boolean) : [],
      sdgTags: sdgTags ? sdgTags.split(",").map((tag) => tag.trim()).filter(Boolean) : [],
      thumbnailUrl,
    };

    try {
      setLoading(true);
      await schoolSponsorshipService.uploadToGallery(payload);
      toast.success("Gallery item submitted for review.");
      setMediaUrl("");
      setCaption("");
      setTags("");
      setSdgTags("");
      setThumbnailUrl("");
      setPreview("");
    } catch (error) {
      console.error(error);
      toast.error("Upload failed. Try a public URL or smaller file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-indigo-500 uppercase tracking-wide">Sponsorship Gallery</p>
            <h1 className="text-3xl font-black text-slate-900">Share impact moments</h1>
            <p className="text-sm text-slate-500">Upload photos/videos with captions and SDG tags.</p>
          </div>
          <button
            onClick={() => navigate("/school/sponsorship")}
            className="flex items-center gap-2 text-sm font-semibold text-indigo-600"
          >
            <ArrowLeftCircle className="w-4 h-4" />
            Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 space-y-4">
          <div
            onDrop={handleDrop}
            onDragOver={(event) => event.preventDefault()}
            className="border-2 border-dashed border-slate-300 rounded-2xl p-8 bg-slate-50 text-center space-y-3 cursor-pointer"
          >
            <UploadCloud className="w-12 h-12 mx-auto text-indigo-500" />
            <p className="text-sm text-slate-500">Drag & drop a file or click to browse</p>
            <input type="file" accept="image/*,video/*" className="sr-only" onChange={handleFileInput} />
            {!mediaUrl && <p className="text-xs text-slate-400">We convert files to data URLs for preview.</p>}
          </div>

          {preview && (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200">
              {mediaType === "video" ? (
                <video src={preview} controls className="w-full h-64 object-cover" />
              ) : (
                <img src={preview} alt="preview" className="w-full h-64 object-cover" />
              )}
              <button
                type="button"
                onClick={() => {
                  setPreview("");
                  setMediaUrl("");
                }}
                className="absolute top-3 right-3 bg-white rounded-full p-1 shadow"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="space-y-1 text-sm text-slate-600">
              Media URL
              <input
                type="url"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://images..."
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:border-indigo-500 focus:outline-none"
              />
            </label>
            <label className="space-y-1 text-sm text-slate-600">
              Thumbnail URL
              <input
                type="url"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="Optional thumbnail"
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:border-indigo-500 focus:outline-none"
              />
            </label>
          </div>

          <label className="space-y-1 text-sm text-slate-600">
            Caption
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:border-indigo-500 focus:outline-none"
              placeholder="Describe the activity"
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="space-y-1 text-sm text-slate-600">
              Tags (comma separated)
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:border-indigo-500 focus:outline-none"
              />
            </label>
            <label className="space-y-1 text-sm text-slate-600">
              SDG Tags (comma separated)
              <input
                type="text"
                value={sdgTags}
                onChange={(e) => setSdgTags(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:border-indigo-500 focus:outline-none"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <label className="space-y-1 text-slate-600">
              Media type
              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:border-indigo-500 focus:outline-none"
              >
                <option value="photo">Photo</option>
                <option value="video">Video</option>
              </select>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-5 py-3 bg-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:bg-indigo-500 transition"
          >
            {loading ? "Uploading..." : "Submit for review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SchoolSponsorshipGallery;
