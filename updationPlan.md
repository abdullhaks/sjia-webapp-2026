# SJIA Restoration & Update Plan

This document outlines the comprehensive plan to address current deficiencies, complete missing functionalities, and elevate the code/design quality of the Sheikh Jeelani Islamic Academy (SJIA) System.

## 🚨 Critical Issues Identified
- **Incomplete Functionality**: "Add Student/Staff" buttons exist but buttons/forms are likely missing or not connected to backend.
- **Missing Pages/Dashboards**: Staff and Student dashboards are placeholders ("Coming soon...").
- **Dummy Data**: Listings (Student/Staff) use hardcoded placeholder data.
- **Styling**: Horizontal scrolling issues, login page design quality concerns.
- **Missing Modules**: Syllabus, Timetable, and Content Management (CMS) are completely missing.
- **Routing**: Student/Staff login flows might be merged unfavorably or missing dedicated views.

---

## 📅 Phased Execution Plan

### Phase 1: Critical Fixes & Foundation Cleanup (Day 1-2)
**Goal:** Stabilize the application, fix layout bugs, and prepare the codebase for real data.

1.  **Style & Layout Fixes**
    -   [ ] **Fix Horizontal Overflow**: Inspect `index.css` and main layouts to remove unintentional `100vw` or negative margins causing scrollbars.
    -   [ ] **Global Style Audit**: Ensure consistent font usage and color tokens from Tailwind theme.
    -   [ ] **Login Page Redesign**: Re-implement `LoginPage.tsx` to match the high-quality "Premium" aesthetic requested. ensure no visual glitches.

2.  **Mock Data Removal & API Integration Setup**
    -   [ ] **Student List**: Remove hardcoded `students` array in `StudentListPage.tsx`. Connect to `useStudentStore` (to be created/updated) and Backend API.
    -   [ ] **Staff List**: Remove dummy data in `StaffListPage.tsx`. Connect to API.
    -   [ ] **Empty States**: Create a reusable `<EmptyState />` component to show when no data is available (instead of dummy rows).

3.  **"Add New" Functionality Implementation**
    -   [ ] **Student Modal/Form**: Create a comprehensive "Add Student" modal with validation (Zod) matching Backend DTO.
    -   [ ] **Staff Modal/Form**: Create "Add Staff" modal/form.

### Phase 2: Core Missing Functionalities (Day 3-4)
**Goal:** Implement the missing business logic modules requested.

1.  **Content Management System (CMS) Layer**
    -   [ ] **Backend**: Create `content-management` module in NestJS.
        -   Endpoints for: Uploading Images (S3 `sjia` folder), Managing Leadership Team, Updating Main Page Text.
    -   [ ] **Frontend**: Create `CMSPage` in Super Admin.
        -   UI for Image Uploads (Gallery/Site Assets).
        -   Forms for updating text content dynamically.

2.  **Syllabus Management**
    -   [ ] **Backend**: Create `syllabus` module (Schema: Subject, Class, FileUrl, Description).
    -   [ ] **Frontend**: Create `SyllabusPage` for Admin (Upload) and Student/Staff (View/Download).

3.  **Timetable Management**
    -   [ ] **Backend**: Create `timetable` module.
    -   [ ] **Frontend**: Create `TimetablePage` with a calendar/grid view. Support PDF upload or Interactive Grid creation.

### Phase 3: Dashboard Expansion (Day 5-6)
**Goal:** Replace "Coming Soon" styling with actual functional dashboards.

1.  **Student Portal**
    -   [ ] **Dashboard Home**: Show Attendance Summary, Recent Notices, upcoming exams.
    -   [ ] **Details View**: Profile page with editable fields (requiring approval).
    -   [ ] **Login Strategy**: Ensure Student login redirects correctly and loads student-specific data.

2.  **Staff Portal**
    -   [ ] **Dashboard Home**: Show today's schedule, pending leave requests (if any apporvals needed), quick attendance link.
    -   [ ] **Class Management**: View assigned students.

### Phase 4: UI/UX Refinement & Polish (Day 7)
**Goal:** "Wow" factors and Quality of Life improvements.

1.  **Details Modal**
    -   [ ] **Universal Detail View**: Implement a "View Details" generic modal for Listings (Students, Staff, Admissions) to show full profile data without navigating away.
    -   [ ] **Image Handling**: Replace all dummy images with optimized placeholders or user-uploaded S3 images.

2.  **Advanced Styling**
    -   [ ] **Glassmorphism Review**: Enhance existing glass cards for better contrast and readability.
    -   [ ] **Animations**: Add frame-motion entry animations to all new pages.

---

## 📋 Immediate Action Items (Next Steps)

1.  **User Approval**: Review this plan.
2.  **Start Phase 1**:
    -   Fix Horizontal Scroll.
    -   Redesign Login Page.
    -   Connect Student List to API.
