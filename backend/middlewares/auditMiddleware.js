import { logAction } from "../services/auditService.js";

export const auditMiddleware = ({ action, resourceType, getResourceId }) => {
  if (!action) {
    throw new Error("auditMiddleware requires an action name");
  }

  return (req, res, next) => {
    const capture = async () => {
      try {
        const resourceId =
          (typeof getResourceId === "function" && getResourceId(req)) || req.params?.id;
        await logAction({
          userId: req.user?._id,
          role: req.user?.role,
          action,
          resourceType,
          resourceId,
          metadata: {
            path: req.path,
            method: req.method,
            body: req.body,
            query: req.query,
          },
        });
      } catch (error) {
        console.error("Audit log failed:", error.message);
      }
    };

    res.on("finish", capture);
    next();
  };
};
