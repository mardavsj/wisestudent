import React from "react";
import { useEffect, useState } from "react";
import { fetchStudentProgress } from "../../services/adminService";

const StudentProgressModal = ({ studentId, onClose }) => {
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProgress = async () => {
            try {
                const res = await fetchStudentProgress(studentId);
                setProgress(res?.data ?? res);
            } catch (err) {
                console.error("Failed to fetch student progress:", err);
            } finally {
                setLoading(false);
            }
        };
        if (studentId) loadProgress();
    }, [studentId]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-2xl overflow-y-auto max-h-[90vh]">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                    📊 Student Progress
                </h2>

                {loading ? (
                    <p className="text-gray-600 dark:text-gray-300">Loading progress...</p>
                ) : progress ? (
                    <div className="space-y-4 text-gray-800 dark:text-gray-200">
                        <div className="grid grid-cols-2 gap-4">
                            <p><strong>Total XP:</strong> {progress.xp}</p>
                            <p><strong>HealCoins:</strong> {progress.healCoins}</p>
                            <p><strong>Badges:</strong> {progress.badges?.join(", ") || "None"}</p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-2">🎯 Completed Missions</h3>
                            {progress.completedMissions?.length > 0 ? (
                                <ul className="list-disc pl-6 space-y-1">
                                    {progress.completedMissions.map((m, idx) => (
                                        <li key={idx}>
                                            {m?.missionId?.title || "Untitled"}{" "}
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                (Completed on {new Date(m.completedAt).toLocaleDateString()})
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No missions completed yet.</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-600 dark:text-gray-300">No progress data found.</p>
                )}

                <div className="mt-6 text-right">
                    <button
                        onClick={onClose}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                    >
                        ✖ Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentProgressModal;
