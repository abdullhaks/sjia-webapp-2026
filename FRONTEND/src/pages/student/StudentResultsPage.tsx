import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axiosInstance from '../../services/axios/authAxios';
import { FaTrophy, FaPrint, FaGraduationCap } from 'react-icons/fa';
import { useAuthStore } from '../../store/authStore';

const StudentResultsPage: React.FC = () => {
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [printResultId, setPrintResultId] = useState<string | null>(null);
    const { student } = useAuthStore();

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axiosInstance.get('/results/my-results');
                const completedResults = (response.data || []).filter((r: any) => r.examId?.status === 'Completed');
                setResults(completedResults);
            } catch (err) {
                console.error('Failed to fetch results', err);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, []);

    const handlePrint = (id: string) => {
        setPrintResultId(id);
        setTimeout(() => {
            window.print();
            setPrintResultId(null);
        }, 500);
    };

    if (loading) return <div className="p-8 text-center">Loading results...</div>;

    return (
        <div className={`space-y-6 ${printResultId ? 'print:m-0 print:p-0' : ''}`}>
            <div className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-200 ${printResultId ? 'print:hidden' : ''}`}>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">My Results</h1>
                <p className="text-gray-500">Academic performance history</p>
            </div>

            {results.length > 0 ? (
                <div className={`grid grid-cols-1 gap-6 ${printResultId ? 'print:block print:gap-0' : ''}`}>
                    {results.map((result, index) => {
                        const isPassed = result.status === 'Passed' || result.percentage >= 40;
                        const isPrinting = printResultId === result._id;

                        if (printResultId && !isPrinting) return null;

                        return (
                            <motion.div
                                key={result._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden ${isPrinting ? 'print:fixed print:inset-0 print:z-50 print:bg-white print:p-12 print:border-none print:shadow-none print:w-full print:h-full print:block' : ''}`}
                            >
                                {/* Print Only Header */}
                                {isPrinting && (
                                    <div className="hidden print:flex flex-col items-center justify-center mb-10 pb-8 border-b-2 border-gray-200">
                                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg">
                                            <FaGraduationCap size={32} />
                                        </div>
                                        <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">St. John's International Academy</h1>
                                        <p className="text-xl text-gray-500 mt-2 font-medium tracking-widest uppercase">Official Academic Transcript</p>

                                        <div className="mt-8 w-full flex justify-between px-8 text-left">
                                            <div>
                                                <p className="text-sm text-gray-400 uppercase font-bold tracking-wider mb-1">Student Details</p>
                                                <p className="text-2xl font-bold text-gray-800">{student?.firstName} {student?.lastName}</p>
                                                <p className="text-lg text-gray-600 mt-1"><span className="font-semibold">ID:</span> {student?.studentId || 'N/A'}</p>
                                                <p className="text-lg text-gray-600"><span className="font-semibold">Class:</span> {student?.class || 'N/A'}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-400 uppercase font-bold tracking-wider mb-1">Examination Details</p>
                                                <p className="text-xl font-bold text-gray-800">{result.examId?.title || 'Term Exam'}</p>
                                                <p className="text-lg text-gray-600 mt-1"><span className="font-semibold">Status:</span> {isPassed ? 'Passed' : 'Failed'}</p>
                                                <p className="text-lg text-gray-600"><span className="font-semibold">Date:</span> {new Date(result.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className={`p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 ${isPrinting ? 'print:hidden' : ''}`}>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">{result.examId?.title || 'Term Exam'}</h3>
                                        <p className="text-sm text-gray-500">Published on {new Date(result.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => handlePrint(result._id)}
                                            className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:shadow-sm"
                                        >
                                            <FaPrint className="inline-block mr-2" /> Print Card
                                        </button>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 uppercase font-semibold">Total Score</p>
                                            <p className="text-2xl font-bold text-blue-600">{result.totalObtainedMarks} / {result.totalMaxMarks}</p>
                                        </div>
                                        <div className={`px-4 py-2 rounded-xl flex flex-col items-center justify-center font-bold text-white ${isPassed ? 'bg-emerald-500' : 'bg-red-500'}`}>
                                            <span className="text-lg">{result.percentage}%</span>
                                            <span className="text-xs uppercase">{isPassed ? 'Pass' : 'Fail'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Marks Body */}
                                <div className={`p-6 bg-gray-50/50 ${isPrinting ? 'print:bg-white print:p-8 print:mt-4' : ''}`}>
                                    {isPrinting && (
                                        <h3 className="hidden print:block text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Subject Performance</h3>
                                    )}
                                    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${isPrinting ? 'print:grid-cols-2 print:gap-6' : ''}`}>
                                        {result.marks && result.marks.map((mark: any, idx: number) => (
                                            <div key={idx} className={`bg-white p-4 rounded-xl border border-gray-200 flex justify-between items-center shadow-sm ${isPrinting ? 'print:border-2 print:shadow-none print:rounded-2xl print:p-6' : ''}`}>
                                                <span className={`font-medium text-gray-700 ${isPrinting ? 'print:text-xl print:font-bold' : ''}`}>{mark.subjectName}</span>
                                                <span className={`font-bold text-gray-900 border-l pl-4 border-gray-100 ${isPrinting ? 'print:text-2xl print:text-blue-700 print:border-l-2 print:border-gray-200' : ''}`}>
                                                    {mark.obtainedMarks} <span className={`text-xs text-gray-400 ${isPrinting ? 'print:text-sm print:text-gray-500' : ''}`}>/ {mark.maxMarks}</span>
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Print Only Footer */}
                                {isPrinting && (
                                    <div className="hidden print:flex mt-16 pt-8 border-t-2 border-gray-200 justify-between items-end px-8">
                                        <div className="text-center">
                                            <div className="w-48 border-b-2 border-gray-800 mb-2"></div>
                                            <p className="text-lg font-bold text-gray-800 uppercase tracking-widest">Class Teacher</p>
                                        </div>
                                        <div className="text-center">
                                            <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 mb-4 mx-auto ${isPassed ? 'border-emerald-500 text-emerald-500' : 'border-red-500 text-red-500'}`}>
                                                <div>
                                                    <p className="text-3xl font-black">{result.percentage}%</p>
                                                    <p className="text-sm font-bold uppercase tracking-widest mt-1">{isPassed ? 'Passed' : 'Failed'}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="w-48 border-b-2 border-gray-800 mb-2"></div>
                                            <p className="text-lg font-bold text-gray-800 uppercase tracking-widest">Principal</p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                <div className={`text-center py-12 bg-white rounded-2xl border border-gray-200 border-dashed ${printResultId ? 'print:hidden' : ''}`}>
                    <FaTrophy className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No results found</h3>
                    <p className="text-gray-500">You haven't taken any exams yet.</p>
                </div>
            )}
        </div>
    );
};

export default StudentResultsPage;
