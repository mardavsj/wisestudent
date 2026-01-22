import api from "../utils/api";

const handleError = (error) => {
  throw error.response?.data || error;
};

const buildQuery = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value);
    }
  });
  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
};

const notificationService = {
  list: (params = {}) =>
    api
      .get(`/api/notifications${buildQuery(params)}`)
      .then((res) => res.data)
      .catch(handleError),
  unreadCount: () =>
    api
      .get("/api/notifications/unread-count")
      .then((res) => res.data)
      .catch(handleError),
  markAsRead: (id) =>
    api
      .patch(`/api/notifications/${id}/read`)
      .then((res) => res.data)
      .catch(handleError),
  markAllAsRead: () =>
    api
      .patch("/api/notifications/read-all")
      .then((res) => res.data)
      .catch(handleError),
  remove: (id) =>
    api
      .delete(`/api/notifications/${id}`)
      .then((res) => res.data)
      .catch(handleError),
};

export default notificationService;

export const fetchMyNotifications = (params = {}) => notificationService.list(params);
