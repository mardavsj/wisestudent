import Organization from "../models/Organization.js";
import SchoolStudent from "../models/School/SchoolStudent.js";
import User from "../models/User.js";

export const getAvailableSchools = async (req, res) => {
  try {
    const { search, includeInactive } = req.query;
    const query = { type: "school" };
    if (!includeInactive) {
      query.isActive = true;
    }

    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [
        { name: regex },
        { "settings.address.city": regex },
        { "settings.address.state": regex },
      ];
    }

    const schools = await Organization.find(query).lean();

    const schoolIds = schools.map((school) => school._id);
    const studentCounts = await SchoolStudent.aggregate([
      { $match: { orgId: { $in: schoolIds } } },
      { $group: { _id: "$orgId", count: { $sum: 1 } } },
    ]);

    const teacherCounts = await User.aggregate([
      { $match: { role: "school_teacher", orgId: { $in: schoolIds } } },
      { $group: { _id: "$orgId", count: { $sum: 1 } } },
    ]);

    const studentMap = studentCounts.reduce((acc, entry) => {
      acc[entry._id.toString()] = entry.count;
      return acc;
    }, {});

    const teacherMap = teacherCounts.reduce((acc, entry) => {
      acc[entry._id.toString()] = entry.count;
      return acc;
    }, {});

    const formatted = schools.map((school) => ({
      _id: school._id,
      id: school._id,
      name: school.name,
      address: school.settings?.address,
      settings: school.settings,
      city: school.settings?.address?.city || null,
      studentCount: studentMap[school._id.toString()] || 0,
      totalStudents: studentMap[school._id.toString()] || 0,
      totalTeachers: teacherMap[school._id.toString()] || 0,
      status: school.isActive ? "active" : "inactive",
      createdAt: school.createdAt,
      campuses: school.campuses || [],
    }));

    res.json({ message: "Available schools fetched", data: formatted });
  } catch (error) {
    console.error("CSR school list error:", error);
    res.status(500).json({ message: "Failed to fetch schools", error: error.message });
  }
};

export const getSchoolDetails = async (req, res) => {
  try {
    const school = await Organization.findOne({ _id: req.params.id, type: "school" })
      .populate("campuses.campusId")
      .lean();

    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    const studentCount = await SchoolStudent.countDocuments({ orgId: school._id });
    const teacherCount = await User.countDocuments({ orgId: school._id, role: "school_teacher" });

    res.json({
      message: "School details fetched",
      data: {
        ...school,
        stats: { studentCount, teacherCount },
      },
    });
  } catch (error) {
    console.error("CSR school detail error:", error);
    res.status(500).json({ message: "Failed to fetch school", error: error.message });
  }
};

export default {
  getAvailableSchools,
  getSchoolDetails,
};
