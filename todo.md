# SJIA Application Restoration & Improvement Plan

This document serves as the master roadmap to address functionality gaps, UI/UX issues, and code quality concerns.

## 🔴 Priority 1: Critical Fixes & Cleanup (Immediate Action)

### 1.1 UI/UX Overhaul
- [x] **Login Page (`LoginPage.tsx`)**:
    - [x] Remove "Floating Orbs" and `pulse-ring` animations.
    - [x] Fix color changing effects or gradients that feel "unnecessary".
    - [x] Ensure clean, professional static background or subtle gradient.
- [x] **SuperAdmin Layout (`SuperAdminLayout.tsx`)**:
    - [x] Inspect `md:ml-[280px]` gap interaction on different screen sizes.
    - [x] Verify Sidebar transition doesn't cause content layout shift or "gap" issues.
- [x] **Global Styling**:
    - [x] Fix `100vw` horizontal scrolling issues (check `index.css` and main containers).
    - [x] Standardize margin/padding across Dashboard and List pages.

### 1.2 Dummy Data Elimination
- [x] **Dashboard (`DashboardPage.tsx`)**:
    - [x] Review "Report Generation" and "Quick Action" buttons - either hide them or implement functioning modals (even if simple).
    - [x] Ensure `stats` array strictly reflects API data.
- [x] **Student/Staff Lists**:
    - [x] Verify `onError` image handlers are the ONLY place using placeholder URLs.

### 1.3 Validation & Error Handling
- [x] **Backend DTOs**:
    - [x] Audit `update-student.dto.ts` and `create-staff.dto.ts` to ensure `class-validator` decorators are as strict as `create-student.dto.ts`.
- [x] **Frontend Forms**:
    - [x] Ensure Zod schemas in `validations/` match Backend DTO constraints exactly (e.g., regex for phone numbers).

## 🟠 Priority 2: Missing Functionality & Integration

### 2.1 Module Verification (Frontend <-> Backend)
- [x] **Examination Module**:
    - [x] Verify `ExamListPage.tsx` fetches from `exam.service.ts`.
    - [x] Ensure "Add Exam" connects to `POST /exams`.
- [x] **Leave Management**:
    - [x] Verify Staff can apply for leave.
    - [x] Verify SuperAdmin can approve/reject (`PATCH /leaves/:id/status`).
- [x] **cms/Syllabus/Timetable**:
    - [x] Confirmed these modules exist in backend and Frontend Pages (`SyllabusManagementPage.tsx`, `TimetableManagementPage.tsx`, `CMSPage.tsx`) are fully wired up to their respective API endpoints.

### 2.2 Security & Auth
- [x] **Refresh Token**:
    - [x] Implement Refresh Token strategy in `auth` module if not present (User indicated this was missing/desired).
- [x] **Role Guards**:
    - [x] Verify `RolesGuard` looks at the correct token claims.

## 🟡 Priority 3: Code Cleanup & Optimization

### 3.1 Unused Entities
- [x] **File Audit**:
    - [x] Identify and remove unused icons/assets in `FRONTEND/src/assets`. (Checked: assets/images is empty)
    - [x] Remove any "Coming Soon" page components that have been superseded by real pages. (Checked: None found)
- [x] **Code Organization**:
    - [ ] Consolidate repetitive UI components (e.g., Buttons, Cards) into `components/common` if not already done. (Attempted to remove `Button.tsx` but it was in use; restored it).

---

## 📅 Execution Roadmap

### Phase 1: Stability (Day 1)
1.  Strip Login Page animations.
2.  Fix SuperAdmin Layout gap.
3.  Audit all DTOs for strict validation.

### Phase 2: Integrity (Day 2)
1.  Walkthrough of `Attendance`, `Leave`, `Exam` modules.
2.  Connect any disconnected forms.
3.  Replace remaining dummy text/alerts with functional (even if basic) logic.

### Phase 3: Polish (Day 3)
1.  Final UI alignment check.
2.  Performance check (remove unused imports).
