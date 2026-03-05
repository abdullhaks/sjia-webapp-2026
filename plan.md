# SJIA Project Implementation Plan (100% Production-Level)

This document outlines the detailed roadmap for converting the existing partially-completed SJIA project into a fully functional, production-ready application. It targets the **NestJS Backend** and the **React + Vite + Tailwind Frontend**.

---

## 🚀 Phase 1: Progressive Web App (PWA) Integration

### Objective: 
Transform the current React Vite app into a robust, installable PWA with offline capabilities, caching, and a mobile-first user experience.

*   **1.1 Install and configure `vite-plugin-pwa`.** Update `vite.config.ts` to include the PWA manifest, service worker strategies, and caching rules (images, fonts, API endpoints).
*   **1.2 Implement the "Add to Home Screen" (A2HS) Prompt.**
    *   Intercept the `beforeinstallprompt` event.
    *   Create a visually pleasing, custom "Install Web App" popup that renders only after a user successfully logs in.
*   **1.3 PWA Caching Strategy.** Optimize caching. Since storage is local, aggressive caching of static CMS media (images/videos) is necessary to reduce repetitive data usage.
*   **1.4 Push Notifications (Web Push API).**
    *   Integrate service worker listeners for push events.
    *   Setup the backend with `web-push` to encrypt and send notifications to subscribed clients for (leave approvals, period exchanges, new results).

---

## 🕌 Phase 2: Public Landing Page & CMS

### Objective: 
Deliver a heavenly, modern, bilingual (Arabic & English) landing page dynamically driven by the CMS module.

*   **2.1 UI/UX Overhaul:** Implement a stunning hero section using TailwindCSS features. Add subtle animations (using `framer-motion`) and elegant typography incorporating Arabic fonts (e.g., *Amiri* or *Cairo*) for Islamic greetings.
*   **2.2 CMS Rendering Component:** Create components to dynamically fetch and display:
    *   College logo, Management leaders, Student leaders.
    *   Top scorers (auto-injected from Exam module).
    *   Memories (Gallery) and YouTube/Instagram links.
*   **2.3 Admission Application Form:** 
    *   Component toggled by the Super Admin's state API.
    *   Form fields: Student name, DOB, Parent Name, Joining Standard, Phone, Email.
    *   **Backend integration:** Capture data, validate via `class-validator`, save, and immediately trigger `Nodemailer` to send a warm Islamic greeting ("Assalamu Alaikum, thank you for applying...").
*   **2.4 Exam Results Portal:** 
    *   Secure form accepting student credentials (Email/Phone/Name).
    *   Displays full result card only if the Super Admin status for the exam is marking "Completed" and within the non-expired date.
    *   Displays dynamic college and class topper leaderboards.

---

## 🛠️ Phase 3: Core Infrastructure - Local File Handling & Notifications (Backend)

### Objective:
Implement zero-dependency (No AWS S3) local media management and dual-notification system.

*   **3.1 Custom File Upload Service (`Multer`):**
    *   Organize `uploads/` dir into `/cms`, `/profiles`, `/documents`.
    *   *Auto-Deletion Logic:* Write logic within the CMS/Profile services to delete the old linked image from the filesystem via `fs.unlink` before assigning the new file (identified by unique names/UUID). 
*   **3.2 Dual Notification Engine:**
    *   Wrap NodeMailer and WebPush into a unified `NotificationService`.
    *   Email serves as the fallback mechanism if the PWA push token is not registered.
*   **3.3 Typographic Standardization (Bilingual):** Ensure right-to-left (RTL) support is mapped appropriately on the frontend where Arabic texts are used in greetings/headers.

---

## 🛡️ Phase 4: Roles, Authentication, & Shared Features

### Objective:
Solidify the robust RBAC (Role-Based Access Control) using JWT.

*   **4.1 JWT Authentication:** Refine access & refresh token implementation in the Auth Module.
*   **4.2 Profile Management Shared Component:**
    *   Allow users to view details, update credentials (password, email, phone) post login.
    *   Upload/Update profile photo integrating the custom auto-deleting file service.
*   **4.3 Forgot Password Mechanism:** OTP or magic-link via Email using Nodemailer.

---

## 👑 Phase 5: Super Admin Dashboard

### Objective: 
Full-featured administrative control over the entire institution.

*   **5.1 Staff & Student Modules:** Full CRUD API + UI. Blocking/Unblocking accounts. Managing credentials.
*   **5.2 Class & Syllabus Management:** Form flows to assign class teachers/leaders and subject coverage.
*   **5.3 Salary Management:** Tracking in-hand payments, history arrays, and pending dues per staff.
*   **5.4 Timetable Generation Engine:**
    *   Define working days, periods, duration.
    *   Algorithm to allocate subjects to periods across a week avoiding staff intersection conflicts.
*   **5.5 Exam Engine:** 
    *   Create exams, select subjects per class, define pass marks/total bounds.
    *   Toggle mechanisms: "Progressing" (staff can enter marks), "Completed" (locks marks, opens public results portal, calculates toppers).
*   **5.6 Leave Management Interface:** Accept/Reject requests (triggers PWA/Email notify).
*   **5.7 Admission Manager:** Validate, schedule interviews (emails interviewer & applicant), or Decline (sends rejection email).
*   **5.8 CMS Interface:** Form arrays to upload image backgrounds, manage leaders, toggling admission visibility.
*   **5.9 Student Council Matrix:** Listing roles (President, Secretary, etc.) and assigning them, which cascades dynamically as titles to the Student Dashboard profile.

---

## 🧑‍🏫 Phase 6: Staff Dashboard

### Objective: 
Simplifying daily teaching tasks, attendance, and exam handling.

*   **6.1 Overview Panel:** Current/next period, day's assigned classes metric cards.
*   **6.2 Timetable View & Swap Request:**
    *   Interactive UI grid to view personal/others' timetables.
    *   "Period Exchange Request" flow (Dispatches real-time PWA notification/email to the requested teacher; modifies timetable temporarily on accept).
*   **6.3 Exam Appraisals:** Input numeric marks into locked-down grids during the "Progressing" window.
*   **6.4 HR Actions:** Leave application requesting and personal salary-history views.

---

## 🎓 Phase 7: Student Dashboard

### Objective: 
Engaging the student experience via gamified profiles and accessibility.

*   **7.1 Motivational Profile:** 
    *   Dynamic Badging Engine: Display active roles (e.g., Council President, Class Topper).
    *   Display syllabus and class assignments cleanly.
*   **7.2 Notifications & Results Viewing:** Detailed exam result cards.
*   **7.3 Media Center:** Integrated view for Memories, Links, Videos inherited directly from the CMS.
*   **7.4 Attendance Log Trackers:** Graphical charts displaying attendance frequency per month using frontend chart libraries.

---

## 📦 Phase 8: Production Deployment Prep

*   Build optimizations via Vite.
*   NestJS environment configs mapped.
*   Static asset mappings for `uploads/` exposed statically via Express within NestJS.
*   PM2 wrapper documentation and final production SSL configuration for PWA push support requirements.
