import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import CandidateDetailsModal from "../components/admin/CandidateDetailsModal";
import PremiumLoader from "../components/PremiumLoader";

function ExamCandidates() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [candidates, setCandidates] = useState([]);
    const [selectedResult, setSelectedResult] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);

    useEffect(() => {
        fetchCandidates();
    }, [id]);

    const fetchCandidates = async () => {
        try {
            const response = await API.get(`/admin/exam/${id}/candidates`);
            setCandidates(response.data || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load candidates");
        } finally {
            setLoading(false);
        }
    };

    const viewDetails = async (resultId) => {
        try {
            setDetailsLoading(true);
            const response = await API.get(`/results/details/${resultId}`);
            setSelectedResult(response.data);
            setShowModal(true);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load metrics profile");
        } finally {
            setDetailsLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="premium-root min-h-screen">
            {/* <div className="ambient-blob blob-a" /> */}
            {/* <div className="ambient-blob blob-b" /> */}
            <PremiumLoader
                title="Loading Candidates"
                subtitle="Fetching examination analytics..."
            />
        </div>
        );
    }

    if (detailsLoading) {
    return (
        <div className="premium-root min-h-screen">
            {/* <div className="ambient-blob blob-a" /> */}
            {/* <div className="ambient-blob blob-b" /> */}

            <PremiumLoader
                title="Loading Analytics"
                subtitle="Preparing candidate details..."
                height="100vh"
            />
        </div>
        );
    }

    return (
        <div className="premium-root min-h-screen p-6 sm:p-10">
            <div className="max-w-7xl mx-auto animate-fadeIn">
                
                {/* Hero Banner Area */}
                <div className="glass-hero mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="hero-content">
                        <span className="hero-accent">Candidate Analytics</span>
                        <h2 className="hero-title">Exam Candidates</h2>
                        <p className="hero-sub">Registration, attempts and biometric integrity diagnostics.</p>
                    </div>
                </div>

                {/* Dynamic Data-Table Card System */}
                <div className="premium-card overflow-hidden border border-white/5 bg-slate-900/40 backdrop-blur-md rounded-2xl">
                    <div className="overflow-x-auto w-full custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/[0.02]">
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-400">Sl No</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-400">Name</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-400">Email</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-400">Registered At</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-400 text-center">Attempted</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-400">Started At</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-400">Submitted At</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-400 text-center">Violations</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-400 text-center">Result</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-400 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {candidates.length === 0 ? (
                                    <tr>
                                        <td colSpan="10" className="p-8 text-center text-sm text-gray-500 italic">
                                            No candidates registered under this workspace module.
                                        </td>
                                    </tr>
                                ) : (
                                    candidates.map((candidate, index) => (
                                        <tr key={index} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="p-4 text-sm font-medium text-gray-400">{index + 1}</td>
                                            <td className="p-4 text-sm font-semibold text-white">{candidate.studentName}</td>
                                            <td className="p-4 text-sm text-gray-300">{candidate.studentEmail}</td>
                                            <td className="p-4 text-sm text-gray-400">
                                                {candidate.registeredAt ? new Date(candidate.registeredAt).toLocaleString("en-GB") : "-"}
                                            </td>
                                            <td className="p-4 text-sm text-center">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${candidate.attempted ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                                                    {candidate.attempted ? "Yes" : "No"}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-gray-400">
                                                {candidate.startedAt ? new Date(candidate.startedAt).toLocaleString("en-GB") : "-"}
                                            </td>
                                            <td className="p-4 text-sm text-gray-400">
                                                {candidate.submittedAt ? new Date(candidate.submittedAt).toLocaleString("en-GB") : "-"}
                                            </td>
                                            <td className="p-4 text-sm text-center font-bold text-amber-400">
                                                {candidate.attempted ? candidate.violationCount : "-"}
                                            </td>
                                            <td className="p-4 text-sm text-center font-semibold text-white">
                                                {candidate.attempted ? (<span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full font-bold"> {candidate.percentage}% </span> ) : ( "-" )}
                                            </td>
                                            <td className="p-4 text-sm text-center">{candidate.attempted ? <button className="premium-action-button premium-btn-primary py-1.5 px-4 rounded-xl text-xs font-bold" 
                                            onClick={() => viewDetails(candidate.resultId)}>View</button> : <span className="px-3 py-1 rounded-full bg-slate-500/10 text-slate-400 text-xs font-bold"> View </span> }
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Injection */}
            <CandidateDetailsModal
                open={showModal}
                onClose={() => setShowModal(false)}
                data={selectedResult}
            />
        </div>
    );
}

export default ExamCandidates;