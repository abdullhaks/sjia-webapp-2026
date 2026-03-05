import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { useServerWakeup } from './hooks/useServerWakeup';
import { useAuthStore } from './store/authStore';
import SuperAdminLoginPage from './pages/auth/SuperAdminLoginPage';
import StaffLoginPage from './pages/auth/StaffLoginPage';
import StudentLoginPage from './pages/auth/StudentLoginPage';
import LandingPage from './pages/public/LandingPage';
import { Spin } from 'antd';
import PWAInstallerPrompt from './components/common/PWAInstallerPrompt';

import SuperAdminLayout from './components/layouts/SuperAdminLayout';
import DashboardPage from './pages/superadmin/DashboardPage';
import StudentListPage from './pages/superadmin/StudentListPage';
import StaffListPage from './pages/superadmin/StaffListPage';
import AdmissionPage from './pages/public/AdmissionPage';
import AdmissionListPage from './pages/superadmin/AdmissionListPage';
import LeaveManagementPage from './pages/common/LeaveManagementPage';
import ExamListPage from './pages/superadmin/ExamListPage';
import ExamSchedulePage from './pages/public/ExamSchedulePage';
import ResultViewPage from './pages/public/ResultViewPage';
import ResultEntryPage from './pages/superadmin/ResultEntryPage';
import ProfilePage from './pages/common/ProfilePage';
import SettingsPage from './pages/superadmin/SettingsPage';
import StaffDashboardPage from './pages/staff/StaffDashboardPage';
import StaffLayout from './components/layouts/StaffLayout';
import StaffProfilePage from './pages/staff/StaffProfilePage';
import StaffTimetablePage from './pages/staff/StaffTimetablePage';
import StaffLeavePage from './pages/staff/StaffLeavePage';
import StaffClassesPage from './pages/staff/StaffClassesPage';
import StaffExamAppraisalsPage from './pages/staff/StaffExamAppraisalsPage';
import StudentLayout from './components/layouts/StudentLayout';
import StudentDashboardPage from './pages/student/StudentDashboardPage';
import StudentProfilePage from './pages/student/StudentProfilePage';
import StudentTimetablePage from './pages/student/StudentTimetablePage';
import StudentExamsPage from './pages/student/StudentExamsPage';
import StudentResultsPage from './pages/student/StudentResultsPage';
import StudentSyllabusPage from './pages/student/StudentSyllabusPage';
import StudentMediaPage from './pages/student/StudentMediaPage';
import CMSPage from './pages/superadmin/CMSPage';
import SyllabusManagementPage from './pages/superadmin/SyllabusManagementPage';
import TimetableManagementPage from './pages/superadmin/TimetableManagementPage';
import FinanceDashboardPage from './pages/superadmin/finance/FinanceDashboardPage';
import FeeManagementPage from './pages/superadmin/finance/FeeManagementPage';
import FeeCollectionPage from './pages/superadmin/finance/FeeCollectionPage';
import SalaryManagementPage from './pages/superadmin/finance/SalaryManagementPage';

import ProtectedRoute from './components/auth/ProtectedRoute';
import NotFoundPage from './pages/common/NotFoundPage';

// Public Route Component (Redirects to dashboard if already logged in)
// Public Route Component (Redirects to dashboard if already logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, superAdmin, staff, student } = useAuthStore();
    const user = superAdmin || staff || student;

    if (isAuthenticated && user) {
        if (user.role === 'superAdmin') return <Navigate to="/superadmin/dashboard" replace />;
        if (user.role === 'staff') return <Navigate to="/staff/dashboard" replace />;
        if (user.role === 'student') return <Navigate to="/student/dashboard" replace />;
    }

    return <>{children}</>;
};



function App() {
    useServerWakeup();
    const { isAuthenticated, checkAuth } = useAuthStore();
    const [isAuthChecking, setIsAuthChecking] = useState(!isAuthenticated);

    useEffect(() => {
        // Initial check in background if authenticated, or blocking if not
        checkAuth().finally(() => setIsAuthChecking(false));
    }, [checkAuth]);

    // Only block if checking auth AND we think we are unauthenticated.
    // Allow the server to load in the background, useServerWakeup shows toasts.
    if (isAuthChecking) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#075940] px-4">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center max-w-md mx-auto shadow-2xl">
                    <Spin size="large" />
                    <h2 className="text-white text-xl font-bold mt-6 mb-3">Checking Authentication</h2>
                    <p className="text-white/80 text-sm leading-relaxed">
                        Please wait while we verify your session securely.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <HelmetProvider>
            <PWAInstallerPrompt />
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={
                        <PublicRoute>
                            <LandingPage />
                        </PublicRoute>
                    } />
                    <Route path="/program" element={
                        <PublicRoute>
                            <LandingPage />
                        </PublicRoute>
                    } />
                    <Route path="/admissions" element={<AdmissionPage />} />
                    <Route path="/exams" element={<ExamSchedulePage />} />
                    <Route path="/results" element={<ResultViewPage />} />
                    <Route path="/superadmin-login" element={
                        <PublicRoute>
                            <SuperAdminLoginPage />
                        </PublicRoute>
                    } />
                    <Route path="/staff-login" element={
                        <PublicRoute>
                            <StaffLoginPage />
                        </PublicRoute>
                    } />
                    <Route path="/student-login" element={
                        <PublicRoute>
                            <StudentLoginPage />
                        </PublicRoute>
                    } />

                    {/* Protected Routes */}
                    {/* Super Admin Routes */}
                    <Route path="/superadmin" element={
                        <ProtectedRoute allowedRoles={['superAdmin']}>
                            <SuperAdminLayout />
                        </ProtectedRoute>
                    }>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route path="students" element={<StudentListPage />} />
                        <Route path="staff" element={<StaffListPage />} />
                        <Route path="admissions" element={<AdmissionListPage />} />
                        <Route path="leaves" element={<LeaveManagementPage />} />
                        <Route path="exams" element={<ExamListPage />} />
                        <Route path="results" element={<ResultEntryPage />} />
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="settings" element={<SettingsPage />} />
                        <Route path="cms" element={<CMSPage />} />
                        <Route path="syllabus" element={<SyllabusManagementPage />} />
                        <Route path="timetable" element={<TimetableManagementPage />} />
                        <Route path="finance" element={<FinanceDashboardPage />} />
                        <Route path="finance/fees" element={<FeeManagementPage />} />
                        <Route path="finance/collect" element={<FeeCollectionPage />} />
                        <Route path="finance/salary" element={<SalaryManagementPage />} />
                    </Route>

                    {/* Staff Routes */}
                    <Route path="/staff" element={
                        <ProtectedRoute allowedRoles={['staff']}>
                            <StaffLayout />
                        </ProtectedRoute>
                    }>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<StaffDashboardPage />} />
                        <Route path="profile" element={<StaffProfilePage />} />
                        <Route path="timetable" element={<StaffTimetablePage />} />
                        <Route path="classes" element={<StaffClassesPage />} />
                        <Route path="exams" element={<StaffExamAppraisalsPage />} />
                        <Route path="leaves" element={<StaffLeavePage />} />
                    </Route>

                    {/* Student Routes */}
                    <Route path="/student" element={
                        <ProtectedRoute allowedRoles={['student']}>
                            <StudentLayout />
                        </ProtectedRoute>
                    }>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<StudentDashboardPage />} />
                        <Route path="profile" element={<StudentProfilePage />} />
                        <Route path="timetable" element={<StudentTimetablePage />} />
                        <Route path="exams" element={<StudentExamsPage />} />
                        <Route path="results" element={<StudentResultsPage />} />
                        <Route path="syllabus" element={<StudentSyllabusPage />} />
                        <Route path="media" element={<StudentMediaPage />} />
                    </Route>

                    {/* Catch all - 404 */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </BrowserRouter>
        </HelmetProvider>
    );
}

export default App;
