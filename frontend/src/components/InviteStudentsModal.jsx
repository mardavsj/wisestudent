import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Link2, Copy, Check, QrCode, Mail, Download, Search, Upload, UserPlus, FileText, AlertCircle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import api from "../utils/api";
import { toast } from "react-hot-toast";

const InviteStudentsModal = ({ isOpen, onClose, classId, className, onSuccess }) => {
  const [activeTab, setActiveTab] = useState("existing"); // existing, invite, bulk
  const [inviteLink, setInviteLink] = useState("");
  const [registrationLink, setRegistrationLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailList, setEmailList] = useState("");
  
  // Add Existing Student
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  
  // Bulk Upload
  const [csvFile, setCsvFile] = useState(null);
  const [csvPreview, setCsvPreview] = useState([]);
  const [csvErrors, setCsvErrors] = useState([]);
  const [uploadResults, setUploadResults] = useState(null);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Generate invite links when modal opens
  useEffect(() => {
    if (isOpen && classId) {
      generateInviteLinks();
    }
  }, [isOpen, classId]);

  const generateInviteLinks = async () => {
    setLoading(true);
    try {
      // Generate regular invite link
      const inviteResponse = await api.post("/api/school/teacher/generate-invite", {
        classId,
        className
      });
      setInviteLink(inviteResponse.data.inviteLink);

      // Generate pre-filled registration link
      const regResponse = await api.post("/api/school/teacher/generate-registration-link", {
        classId,
        className
      });
      setRegistrationLink(regResponse.data.registrationLink);
    } catch (error) {
      console.error("Error generating invite links:", error);
      toast.error("Failed to generate invite links");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = (link, type = "invite") => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success(`${type === "invite" ? "Invite" : "Registration"} link copied!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendEmails = async () => {
    const emails = emailList.split(",").map(e => e.trim()).filter(e => e);
    
    if (emails.length === 0) {
      toast.error("Please enter at least one email address");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/school/teacher/send-invites", {
        emails,
        inviteLink: registrationLink,
        className
      });
      toast.success(`Invites sent to ${emails.length} email(s)!`);
      setEmailList("");
    } catch (error) {
      console.error("Error sending invites:", error);
      toast.error("Failed to send invites");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadQR = (link, filename) => {
    const svg = document.getElementById(`qr-code-${filename}`);
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      
      const downloadLink = document.createElement("a");
      downloadLink.download = `${filename}-${className}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
      
      toast.success("QR code downloaded!");
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  // Search existing students
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a registration number or phone");
      return;
    }

    setSearchLoading(true);
    try {
      const response = await api.get("/api/school/teacher/search-students", {
        params: { query: searchQuery }
      });
      const students = response.data.students || [];
      const mappedResults = students.map((student) => ({
        ...student,
        className: className || student.classes?.[0]?.name || student.metadata?.schoolEnrollment?.className || 'Unassigned',
      }));
      setSearchResults(mappedResults);
      if (students.length === 0) {
        toast("No students found", { icon: "ℹ️" });
      }
    } catch (error) {
      console.error("Error searching students:", error);
      toast.error("Failed to search students");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleToggleStudent = (student) => {
    setSelectedStudents(prev => {
      const exists = prev.find(s => s._id === student._id);
      if (exists) {
        return prev.filter(s => s._id !== student._id);
      }
      return [...prev, student];
    });
  };

  const handleAssignStudents = async () => {
    if (selectedStudents.length === 0) {
      toast.error("Please select at least one student");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/school/teacher/assign-students", {
        classId,
        className,
        studentIds: selectedStudents.map(s => s._id)
      });
      toast.success(`${selectedStudents.length} student(s) assigned to ${className}!`);
      setSelectedStudents([]);
      setSearchQuery("");
      setSearchResults([]);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error assigning students:", error);
      toast.error("Failed to assign students");
    } finally {
      setLoading(false);
    }
  };

  // CSV Upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      toast.error("Please upload a CSV file");
      return;
    }

    setCsvFile(file);
    parseCSV(file);
  };

  const parseCSV = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split("\n").filter(line => line.trim());
      
      if (lines.length === 0) {
        toast.error("CSV file is empty");
        return;
      }

      // Parse header
      const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
      const requiredHeaders = ["reg_no", "first_name", "last_name", "dob", "phone", "email", "grade", "section"];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        toast.error(`Missing required columns: ${missingHeaders.join(", ")}`);
        setCsvErrors([{ row: 0, error: `Missing columns: ${missingHeaders.join(", ")}` }]);
        return;
      }

      // Parse rows
      const preview = [];
      const errors = [];
      
      for (let i = 1; i < Math.min(lines.length, 11); i++) { // Preview first 10 rows
        const values = lines[i].split(",").map(v => v.trim());
        const row = {};
        
        headers.forEach((header, index) => {
          row[header] = values[index] || "";
        });

        // Validate row
        const rowErrors = [];
        if (!row.reg_no) rowErrors.push("Missing registration number");
        if (!row.first_name) rowErrors.push("Missing first name");
        if (!row.last_name) rowErrors.push("Missing last name");
        if (!row.email || !row.email.includes("@")) rowErrors.push("Invalid email");
        if (!row.phone || row.phone.length < 10) rowErrors.push("Invalid phone");
        
        if (rowErrors.length > 0) {
          errors.push({ row: i, errors: rowErrors, data: row });
        }

        preview.push({ ...row, rowNumber: i, hasErrors: rowErrors.length > 0 });
      }

      setCsvPreview(preview);
      setCsvErrors(errors);
      
      if (errors.length > 0) {
        toast.warning(`Found ${errors.length} row(s) with errors`);
      } else {
        toast.success("CSV validated successfully!");
      }
    };
    
    reader.readAsText(file);
  };

  const handleBulkUpload = async () => {
    if (!csvFile) {
      toast.error("Please select a CSV file");
      return;
    }

    if (csvErrors.length > 0) {
      toast.error("Please fix CSV errors before uploading");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("csvFile", csvFile);
    formData.append("classId", classId);
    formData.append("className", className);

    try {
      const response = await api.post("/api/school/teacher/bulk-upload-students", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      setUploadResults(response.data);
      toast.success(`Successfully imported ${response.data.successCount} students!`);
      
      if (response.data.errorCount > 0) {
        toast.warning(`${response.data.errorCount} students failed to import`);
      }
    } catch (error) {
      console.error("Error uploading CSV:", error);
      toast.error("Failed to upload students");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmailList("");
    setCopied(false);
    setSearchQuery("");
    setSearchResults([]);
    setSelectedStudents([]);
    setCsvFile(null);
    setCsvPreview([]);
    setCsvErrors([]);
    setUploadResults(null);
    setActiveTab("existing");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl bg-white rounded-xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col border border-slate-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 backdrop-blur rounded-lg">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Add Students</h2>
                  <p className="text-white/80 text-sm">
                    {className ? `Add students to ${className}` : "Add students to your class"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-200 bg-slate-50 px-6">
            <button
              onClick={() => setActiveTab("existing")}
              className={`px-6 py-3 font-medium transition-all relative ${
                activeTab === "existing"
                  ? "text-indigo-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Add Existing
              </div>
              {activeTab === "existing" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                />
              )}
            </button>
            
            <button
              onClick={() => setActiveTab("invite")}
              className={`px-6 py-3 font-medium transition-all relative ${
                activeTab === "invite"
                  ? "text-indigo-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Invite New
              </div>
              {activeTab === "invite" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                />
              )}
            </button>
            
            <button
              onClick={() => setActiveTab("bulk")}
              className={`px-6 py-3 font-medium transition-all relative ${
                activeTab === "bulk"
                  ? "text-indigo-600"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Bulk Upload
              </div>
              {activeTab === "bulk" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                />
              )}
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Add Existing Student Tab */}
            {activeTab === "existing" && (
              <div className="space-y-6">
                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                  <div className="flex items-start gap-3">
                    <Search className="w-5 h-5 text-indigo-600 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">Search Existing Students</h3>
                      <p className="text-sm text-slate-600">
                        Search by registration number or phone number to find students already in the system.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Search Input */}
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter registration number or phone..."
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSearch}
                    disabled={searchLoading}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {searchLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        Search
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-gray-900">Search Results ({searchResults.length})</h4>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {searchResults.map((student) => (
                        <motion.div
                          key={student._id}
                          whileHover={{ scale: 1.01 }}
                          onClick={() => handleToggleStudent(student)}
                          className={`p-4 rounded-lg border cursor-pointer transition-all ${
                            selectedStudents.find(s => s._id === student._id)
                              ? "bg-indigo-50 border-indigo-500"
                              : "bg-white border-slate-200 hover:border-indigo-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                                {student.name?.charAt(0) || "S"}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900">{student.name}</p>
                                <p className="text-sm text-gray-600">
                                  {student.registrationNumber || student.email}
                                </p>
                                <p className="text-xs text-gray-500">{student.phone}</p>
                              </div>
                            </div>
                            {selectedStudents.find(s => s._id === student._id) && (
                              <Check className="w-6 h-6 text-indigo-600" />
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Assign Button */}
                {selectedStudents.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAssignStudents}
                    disabled={loading}
                    className="w-full px-6 py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50"
                  >
                    {loading ? "Assigning..." : `Assign ${selectedStudents.length} Student(s) to ${className}`}
                  </motion.button>
                )}
              </div>
            )}

            {/* Invite New Student Tab */}
            {activeTab === "invite" && (
              <div className="space-y-6">
                {/* Pre-filled Registration Link */}
                <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="bg-white p-4 rounded-xl shadow-lg">
                        {registrationLink ? (
                          <QRCodeSVG
                            id="qr-code-registration"
                            value={registrationLink}
                            size={160}
                            level="H"
                            includeMargin={true}
                          />
                        ) : (
                          <div className="w-40 h-40 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent" />
                          </div>
                        )}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDownloadQR(registrationLink, "registration-qr")}
                        disabled={!registrationLink}
                        className="mt-3 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <Download className="w-4 h-4" />
                        Download QR
                      </motion.button>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <UserPlus className="w-5 h-5 text-indigo-600" />
                        <h3 className="text-lg font-bold text-slate-900">Pre-filled Registration Link</h3>
                      </div>
                      <p className="text-sm text-slate-600 mb-4">
                        New students can scan this QR code or use the link below. Upon registration, 
                        they will be automatically assigned to <strong>{className}</strong>.
                      </p>
                      
                      <div className="bg-white rounded-lg p-3 border border-indigo-200 mb-4">
                        <p className="text-xs text-slate-500 mb-1">How it works:</p>
                        <ol className="text-sm text-slate-700 space-y-1 list-decimal list-inside">
                          <li>Student scans QR or clicks link</li>
                          <li>Registration form opens with class pre-selected</li>
                          <li>Student completes registration</li>
                          <li>System auto-assigns to {className}</li>
                        </ol>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={registrationLink}
                          readOnly
                          className="flex-1 px-4 py-3 bg-white border border-indigo-200 rounded-lg font-mono text-sm"
                        />
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleCopyLink(registrationLink, "registration")}
                          disabled={!registrationLink}
                          className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                            copied
                              ? "bg-green-600 text-white"
                              : "bg-indigo-600 text-white hover:bg-indigo-700"
                          }`}
                        >
                          {copied ? (
                            <>
                              <Check className="w-5 h-5" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-5 h-5" />
                              Copy
                            </>
                          )}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email Invites */}
                <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Mail className="w-5 h-5 text-indigo-600" />
                    <h3 className="text-lg font-bold text-slate-900">Send Email Invites</h3>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">
                    Enter student/parent email addresses (comma-separated) to send personalized registration invitations.
                  </p>
                  
                  <textarea
                    value={emailList}
                    onChange={(e) => setEmailList(e.target.value)}
                    placeholder="student1@example.com, parent1@example.com, student2@example.com"
                    rows={3}
                    className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all resize-none mb-3"
                  />
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSendEmails}
                    disabled={loading || !emailList.trim()}
                    className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Mail className="w-5 h-5" />
                    {loading ? "Sending..." : "Send Email Invites"}
                  </motion.button>
                </div>
              </div>
            )}

            {/* Bulk Upload Tab */}
            {activeTab === "bulk" && (
              <div className="space-y-6">
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">CSV Format Requirements</h3>
                      <p className="text-sm text-slate-600 mb-2">
                        Required columns: <strong>reg_no, first_name, last_name, dob, phone, email, grade, section</strong>
                      </p>
                      <button
                        onClick={() => {
                          const csvContent = "reg_no,first_name,last_name,dob,phone,email,grade,section\n1001,John,Doe,2005-01-15,1234567890,john@example.com,9,A\n1002,Jane,Smith,2005-03-20,0987654321,jane@example.com,9,A";
                          const blob = new Blob([csvContent], { type: "text/csv" });
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = "student_template.csv";
                          a.click();
                        }}
                        className="text-indigo-600 hover:text-indigo-700 font-medium text-sm underline"
                      >
                        Download Sample CSV
                      </button>
                    </div>
                  </div>
                </div>

                {/* File Upload */}
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-all">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                    id="csv-upload"
                  />
                  <label htmlFor="csv-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-base font-semibold text-slate-700 mb-1">
                      {csvFile ? csvFile.name : "Click to upload CSV"}
                    </p>
                    <p className="text-sm text-slate-500">
                      or drag and drop your file here
                    </p>
                  </label>
                </div>

                {/* CSV Preview */}
                {csvPreview.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-gray-900">Preview (First 10 rows)</h4>
                      {csvErrors.length > 0 && (
                        <div className="flex items-center gap-2 text-red-600">
                          <AlertCircle className="w-5 h-5" />
                          <span className="font-semibold">{csvErrors.length} row(s) with errors</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-100">
                          <tr>
                            <th className="px-3 py-2 text-left font-semibold">#</th>
                            <th className="px-3 py-2 text-left font-semibold">Reg No</th>
                            <th className="px-3 py-2 text-left font-semibold">Name</th>
                            <th className="px-3 py-2 text-left font-semibold">Email</th>
                            <th className="px-3 py-2 text-left font-semibold">Phone</th>
                            <th className="px-3 py-2 text-left font-semibold">Grade</th>
                            <th className="px-3 py-2 text-left font-semibold">Section</th>
                            <th className="px-3 py-2 text-left font-semibold">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {csvPreview.map((row, idx) => (
                            <tr key={idx} className={row.hasErrors ? "bg-red-50" : "bg-white"}>
                              <td className="px-3 py-2 border-t">{row.rowNumber}</td>
                              <td className="px-3 py-2 border-t">{row.reg_no}</td>
                              <td className="px-3 py-2 border-t">{row.first_name} {row.last_name}</td>
                              <td className="px-3 py-2 border-t">{row.email}</td>
                              <td className="px-3 py-2 border-t">{row.phone}</td>
                              <td className="px-3 py-2 border-t">{row.grade}</td>
                              <td className="px-3 py-2 border-t">{row.section}</td>
                              <td className="px-3 py-2 border-t">
                                {row.hasErrors ? (
                                  <span className="text-red-600 font-semibold">Error</span>
                                ) : (
                                  <span className="text-green-600 font-semibold">Valid</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Error Details */}
                    {csvErrors.length > 0 && (
                      <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
                        <h5 className="font-bold text-red-900 mb-2">Errors Found:</h5>
                        <div className="space-y-1">
                          {csvErrors.map((error, idx) => (
                            <p key={idx} className="text-sm text-red-700">
                              <strong>Row {error.row}:</strong> {error.errors.join(", ")}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Upload Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBulkUpload}
                      disabled={loading || csvErrors.length > 0}
                      className="w-full px-6 py-4 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent inline-block mr-2" />
                          Importing Students...
                        </>
                      ) : (
                        `Import ${csvPreview.filter(r => !r.hasErrors).length} Students to ${className}`
                      )}
                    </motion.button>
                  </div>
                )}

                {/* Upload Results */}
                {uploadResults && (
                  <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                    <div className="flex items-center gap-3 mb-4">
                      <Check className="w-8 h-8 text-green-600" />
                      <div>
                        <h4 className="font-bold text-green-900 text-lg">Import Complete!</h4>
                        <p className="text-sm text-green-700">
                          Successfully imported {uploadResults.successCount} students
                        </p>
                      </div>
                    </div>
                    
                    {uploadResults.errorCount > 0 && (
                      <div className="bg-white rounded-lg p-4 border border-red-200">
                        <p className="font-semibold text-red-900 mb-2">
                          {uploadResults.errorCount} students failed to import:
                        </p>
                        <div className="space-y-1 max-h-40 overflow-y-auto">
                          {uploadResults.errors.map((err, idx) => (
                            <p key={idx} className="text-sm text-red-700">
                              Row {err.row}: {err.error}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleClose}
              className="w-full px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-all"
            >
              Close
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default InviteStudentsModal;
