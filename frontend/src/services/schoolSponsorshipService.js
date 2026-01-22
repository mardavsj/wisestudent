import api from "../utils/api";

const schoolSponsorshipService = {
  getDetails: () => api.get("/api/school/sponsorship").then((res) => res.data),
  sendThankYou: (payload) =>
    api.post("/api/school/sponsorship/thank-you", payload).then((res) => res.data),
  uploadToGallery: (payload) =>
    api.post("/api/school/sponsorship/gallery", payload).then((res) => res.data),
};

export default schoolSponsorshipService;
