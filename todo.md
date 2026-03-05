# SJIA Project Production-Level Implementation Plan

This document is a comprehensive, prioritized list of tasks to convert the current SJIA project into a stable, robust, and production-ready application. It addresses known bugs (like authentication redirection issues) and missing features across all role profiles.

## 🚨 Phase 1: Authentication & Routing Stability (High Priority)

### 1.1 Persist Authentication State Across Refreshes
**Problem:** Hard refresh causes the app's `authStore` initial state (`isAuthenticated: false`) to render the public `LandingPage` momentarily, logging the user out visually if a transient API delay occurs. 
*   **Action:** Update `FRONTEND/src/store/authStore.ts`. Implement a local persistence strategy (e.g., `zustand/middleware/persist` or checking a fast `localStorage` flag like `isLoggedIn_sj_ia`) to hold the UI layout stable while `checkAuth` verifies the token in the background.
*   **Action:** Modify `ProtectedRoute.tsx` and `App.tsx` router wrapper to gracefully handle the "loading" vs "unauthenticated" states safely, avoiding flash-redirects.

### 1.2 JWT Error Handling & Refresh Logic
*   **Action:** Ensure the Axios response interceptor (`authAxios.ts`) correctly intercepts 401 errors, attempts a `/auth/refresh` exactly once, and if failed, dispatches an event to `authStore` to wipe state and redirect to `/login` without looping.
*   **Action:** Fix backend JWT `expiresIn` typings if not fully resolved from previous edits (e.g., ensuring strictly number/string combinations match NestJS JwtModule requirements).

## 👑 Phase 2: Super Admin Module Enhancements

### 2.1 Staff & Student Default Credentials
*   **Action:** In `SuperAdmin`'s "Add Student" and "Add Staff" modals, explicitly provide an option to auto-generate or set a "Default Password" directly upon user creation, bypassing the need for manual setup by the end-user initially. Include an email dispatch flow with these credentials using Nodemailer.

### 2.2 Exam & Result Robustness
*   **Action:** Fix `ResultEntryPage` `map` type warnings entirely. Ensure arrays fallback to `[]` natively in the Zustand store prior to mapping. Identify any remaining "Cannot read properties of undefined" errors across tables.
*   **Action:** Add status toggles to exams (`Progressing` vs `Completed`). Ensure only `Completed` exams show up on the public Results Portal and Student Result Page.

### 2.3 System-Wide Form Validation & Catching Dupes
*   **Action:** Add robust `Yup` or `Antd Form rules` to all Super Admin inputs. Implement backend error catchers so that unique fields (like email/phone) triggering Mongoose duplication errors (`E11000`) are visually displayed under the specific input, instead of a generic "Server Error" toast banner.

## 🧑‍🏫 Phase 3: Staff Dashboard & Responsibilities

### 3.1 Interactive Timetabling
*   **Action:** Finalize the visual grid-based Timetable view for staff (`StaffTimetablePage.tsx`).
*   **Action:** Implement "Period Exchange" workflows. Staff A requests Staff B to take a period -> Sends DB notification -> If Staff B accepts, dynamically swap the database timetable record for that specific date.

### 3.2 Exam Appraisals (Marks Entry)
*   **Action:** Allow Staff to enter marks only for subjects they teach during an exam's `Progressing` phase. Map out a scoped `StaffExamAppraisalsPage` that pulls their specific assigned subject/class matrix dynamically preventing unauthorized edits.

### 3.3 Attendance Loggers
*   **Action:** Finalize Daily Attendance marking forms for Staff. Provide a fast UI toggle list for an entire class roster to mark "Present/Absent/Late" on a single page efficiently, feeding into the `AttendanceStore`.

## 🎓 Phase 4: Student User Experience (UX)

### 4.1 Motivational Profile UI
*   **Action:** Implement a dynamic visual layout in `StudentProfilePage` that showcases badges/tags based on their CMS roles (e.g., "School Captain", "Science Club Lead", "Topper").

### 4.2 Real-time Results & Syllabus Viewers
*   **Action:** Create heavily stylized, printable Result Cards within the Student dashboard for completed exams.
*   **Action:** Ensure the Syllabus viewer correctly pulls the assigned syllabus from the backend and renders it hierarchically (Terms -> Chapters -> Topics) so students can easily track progress.

## 🛠 Phase 5: Core Capabilities (Backend & Notifications)

### 5.1 Local File Garbage Collection
*   **Action:** Create a centralized Multer upload helper. Upon updating a profile photo or CMS hero image, write logic using `fs.unlinkSync` to delete the previous file from the `uploads/` directory to prevent disk bloating and zombie files over time.

### 5.2 Notification Engine Refinement
*   **Action:** Unify the standard notifications schema on MongoDB. When a leave is approved or an exam result is published, insert a unified notification document into the DB, and concurrently trigger fallback Nodemailer (Email).

## 🚀 Phase 6: PWA & Production Delivery

### 6.1 Service Worker & PWA Caching
*   **Action:** Finalize `vite-plugin-pwa` configuration in `vite.config.ts`. Pre-cache major chunks, static SVGs, and fonts to eliminate redundant network overhead natively structure the application to work smoothly on mobile offline.

### 6.2 Security & Data Integrity
*   **Action:** Use `helmet` in NestJS to enforce strict Content Security Policies (CSP) protecting from XSS.
*   **Action:** Implement proper Winston logging into file rotational streams instead of standard `console.log` to track failures elegantly in production.
