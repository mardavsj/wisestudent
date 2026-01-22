import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeartHandshake, ArrowLeftCircle } from "lucide-react";
import schoolSponsorshipService from "../../services/schoolSponsorshipService";
import { toast } from "react-hot-toast";

const SchoolSponsorshipThankYou = () => {
  const [message, setMessage] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!message.trim()) {
      toast.error("Please write a thank you message.");
      return;
    }

    try {
      setLoading(true);
      await schoolSponsorshipService.sendThankYou({ message: message.trim(), videoUrl });
      toast.success("Thank you sent to the CSR sponsor.");
      setMessage("");
      setVideoUrl("");
    } catch (error) {
      console.error(error);
      toast.error("Unable to send thank you right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-rose-500 uppercase tracking-wide">Sponsorship Thank You</p>
            <h1 className="text-3xl font-black text-slate-900">Send gratitude</h1>
            <p className="text-sm text-slate-500">Share a note or video for your CSR partner.</p>
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
          <label className="space-y-1 text-sm text-slate-600">
            Thank you message
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Share how the sponsorship made a difference."
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:border-rose-500 focus:outline-none"
            />
          </label>
          <label className="space-y-1 text-sm text-slate-600">
            Optional video link
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/..."
              className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:border-rose-500 focus:outline-none"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-rose-600 text-white font-semibold rounded-2xl shadow-lg hover:bg-rose-500 transition"
          >
            <HeartHandshake className="w-5 h-5" />
            {loading ? "Sending..." : "Send thank you"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SchoolSponsorshipThankYou;
