# SJIA Project Progress Tracker

## Completed Tasks

### 🚨 Phase 1: Authentication & Routing Stability (Completed)
- [x] **1.1 Persist Authentication State Across Refreshes**
  - Updated `authStore.ts` with `zustand/middleware/persist` using `localStorage` to securely store user state and prevent layout flash.
  - Modified `App.tsx` so the router correctly reads the existing `isAuthenticated` state synchronously, bypassing the loading spinner if tokens evaluate to valid client-side.
- [x] **1.2 JWT Error Handling & Refresh Logic**
  - Verified `authAxios.ts` interceptors to break any potential loop and safely clear the store on a 401 fail.
  - Enhanced backend `jwt.config.ts` to type-parse token expirations appropriately, preventing string-vs-numeric errors from breaking the token generator.

### 👑 Phase 2: Super Admin Module Enhancements (Completed)
- [x] **2.1 Staff & Student Default Credentials**
  - Upgraded both `StudentForm.tsx` and `StaffForm.tsx` modals with a dedicated `Password Generation Option` and a `Send Credentials via Email` toggle.
  - Plumbed these parameters into the backend DTOs (`create-student.dto.ts`, `create-staff.dto.ts`).
  - Rewrote the `create` methodologies in `staff.service.ts` and `student.service.ts` to logically generate an 8-character random secure password if requested, and asynchronously dispatch those raw credentials via Nodemailer utilizing the global `NotificationService`.
- [x] **2.2 Exam & Result Robustness**
  - Tracked down `ResultEntryPage.tsx` `TypeError: Cannot read properties of undefined (reading 'map')`. Identified that Zustand's API interceptor was occasionally assigning `undefined` payloads natively. Altered the frontend stores (`examStore.ts`, `resultStore.ts`, `studentStore.ts`) to intercept responses via `Array.isArray()` and forcefully fallback to `[]` natively before committing to state. 
  - Restructured `ResultEntryPage` to meticulously boundary-check arrays prior to any option mappings or filtering.
  - Ensured only `Completed` exams display on the `StudentResultsPage.tsx` and `ResultViewPage.tsx` by wrapping the data array filter logic against the `examId.status` relation.
- [x] **2.3 System-Wide Form Validation & Catching Dupes**
  - Architected a brand new global `MongoExceptionFilter` on the NestJS backend to catch raw `MongoDB E11000` (duplicate key) crashes before they hit the generic 500 handler.
  - Configured that filter to parse the raw regex string, identify the specific conflicting field (`email`, `phone`, etc.), and dispatch a neat HTTP `409 Conflict` structured error.
  - Modified frontend stores (`StudentStore`, `StaffStore`) and their corresponding `ListPages` to seamlessly re-throw Axios errors down to the `Form.tsx` components.
  - Upgraded both `StudentForm.tsx` and `StaffForm.tsx` `onFinish` handlers to function asynchronously, catching the unified 409 error array and applying it dynamically via Ant Design's `setFields()` API. If a user tries to create an overlapping email, the precise input box will now turn red with the localized error!

### 🧑‍🏫 Phase 3: Staff Dashboard & Responsibilities (Completed)
- [x] **3.1 Interactive Timetabling**
  - Upgraded both the backend `TimetableModule` and `TimetableService` with a sub-architectural `SwapRequest` schema to handle the negotiation logic natively.
  - Plumbed 3 new REST endpoints (`requestSwap`, `getMySwapRequests`, `respondToSwapRequest`) allowing Staff to initiate peer-to-peer period proxies.
  - When approved, `TimetableService` now inherently intercepts the master `gridData`, identifies the exact slot map, permanently rewrites the `teacher` assignment, and commits to the database dynamically. 
  - Overhauled `StaffTimetablePage.tsx` interface featuring split Tabs connecting directly to the `useTimetableStore` states ensuring real-time pending proxy management natively.
- [x] **3.2 Exam Appraisals (Marks Entry)**
  - Modified `StaffExamAppraisalsPage.tsx` interface to securely sandbox score entry dynamically.
  - It now asynchronously leverages `useTimetableStore.fetchMySchedule()` to reconstruct a live `taughtClasses` and `taughtSubjectsByClass` matrix uniquely tied to the authenticated staff member.
  - Locked down dropdowns so Staff can only ever select Exams, Students, and Input Marks for their designated subjects/classes, preventing unwarranted tampering across different grades.

- [x] **3.3 Attendance Loggers**
  - Restructured `StaffClassesPage.tsx` to include an interactive sidebar sliding `Drawer` for fast daily attendance tracking per Subject/Class combination.
  - Implemented an `Upsert` backed `bulkMarkAttendance` controller within the `AttendanceService` to drastically improve performance (only commits one DB atomic operation versus looping).
  - Defaults all students to "Present" actively for instantaneous, minimal-click submission workflow for teachers.

### 🎓 Phase 4: Student User Experience (Completed)
- [x] **4.1 Motivational Profile UI**
  - Revamped `StudentProfilePage` from a basic profile view into an aesthetically dynamic dashboard natively hooked up to `useAttendanceStore` and `useResultStore`.
  - The UI now actively calculates their average result score (>90%) to award an "Academic Star" badge, and evaluates attendance natively (>95%) to inject a "Perfect Explorer" badge, making achievements organic and interactive using `framer-motion` presentation.
  
- [x] **4.2 Real-time Results & Syllabus Viewers**
  - Designed and implemented a robust, heavily stylized, printable Result Card template inside `StudentResultsPage.tsx`, leveraging Tailwind CSS `print:` utility classes to manipulate the DOM specifically for A4 sizing when printing.
  - Hydrated the `User` typings in `authStore.ts` with explicit properties like `studentId` and `class` which accurately populate the print layout credentials.
  - Modified the backend MongoDB `Syllabus` Entity to include an extensible array of objects called `structure`, allowing dynamic ingestion of `Terms -> Chapters -> Topics` breakdowns.
  - Revamped `StudentSyllabusPage.tsx` using `framer-motion` `<AnimatePresence>` to create dynamically expanding accordion arrays that map the aforementioned hierarchical syllabus structures with engaging UI visual completion checkpoints (`FaCheckCircle`, `FaRegCircle`).

### 🛠 Phase 5: Core Capabilities (Backend & Notifications) (Completed)
- [x] **5.1 Local File Garbage Collection**
  - Updated `student.controller.ts` and `staff.controller.ts` endpoints (`updateMyProfile` and `update` by admin) to check if an old `photoUrl` exists before applying a new uploaded profile image.
  - Implemented logic utilizing the instantiated `S3Service.deleteFile(url)` method which natively uses `fs.unlinkSync` to clear out the stagnant file in the server's `uploads/` directory, preventing disk bloating over time.
  - Verified `users.service.ts` (SuperAdmin profiles) and `content-management.service.ts` (Gallery/Leadership images) appropriately garbage collect their old media artifacts natively during CRUD updates.

- [x] **5.2 Notification Engine Refinement**
  - Unified the MongoDB `Notification` schema with `recipient`, `title`, `message`, `type`, `isRead`, `url`, and `timestamps` fields — acting as the single source of truth for all in-app notifications.
  - Extended `NotificationService` with full user-facing query methods: `getNotificationsForUser()` (paginated, newest first, limit 100), `getUnreadCount()`, `markAsRead()`, `markAllAsRead()`, and `deleteNotification()` — all scoped by the authenticated user's ObjectId.
  - Added a `broadcastNotification()` method utilizing Mongoose `insertMany()` for mass audience notifications — efficiently inserts notification documents for all target recipients in a single atomic DB operation.
  - Created `NotificationController` (`/api/notifications/*`) with 5 REST endpoints: `GET /my`, `GET /my/unread-count`, `PATCH /:id/read`, `PATCH /mark-all-read`, `DELETE /:id` — all protected by `JwtAuthGuard`.
  - Registered the controller in the global `SharedModule` so it's available application-wide.
  - Integrated notifications into the `NoticeService`: when a new notice is created, the system asynchronously fetches all active Students and/or Staff (based on the notice's `audience` field) and broadcasts a DB notification to each recipient. Updated `NoticeModule` to import `Student` and `Staff` schemas for recipient resolution.
  - Existing leave approval (`LeaveService.updateStatus()`) and result publication (`ResultService.notifyIfPublished()`) notification flows remain intact — they continue using the `sendDualNotification()` pipeline (DB insert + push + email fallback).
  - Created frontend `notification.api.ts` service layer with typed methods for all 5 notification endpoints.
  - Created frontend `notificationStore.ts` Zustand store with optimistic UI updates for mark-read and delete operations, plus a `fetchUnreadCount()` method for badge display.

### 🚀 Phase 6: PWA & Production Delivery (Completed)

- [x] **6.1 Service Worker & PWA Caching**
  - Finalized `vite-plugin-pwa` configuration in `vite.config.ts` with comprehensive pre-caching and runtime caching strategies:
    - **Pre-cache**: All major application shell assets (`js`, `css`, `html`, `ico`, `png`, `svg`, `woff`, `woff2`, `ttf`, `webp`, `avif`).
    - **Google Fonts (CacheFirst)**: Font stylesheets cached for 1 year (up to 10 entries), font files cached for 1 year (up to 10 entries). Eliminates redundant network overhead for typography.
    - **Uploaded Media (CacheFirst)**: Backend `/uploads/*` images cached for 30 days (up to 100 entries). Profile photos, gallery images load instantly from cache.
    - **API Requests (NetworkFirst)**: All `/api/*` requests attempt network first with a 10-second timeout, falling back to cached responses. Dashboard data stays available offline. Cached for 5 minutes (up to 50 entries).
    - **Navigation Fallback**: All navigation requests fall back to `/index.html` when offline, with `/api/` routes excluded from the fallback denylist.
  - Enhanced PWA manifest with production values: `theme_color` matching the app's primary purple (`#9B59B6`), `background_color` set to dark theme (`#1a1a2e`), `start_url: '/'`, `orientation: 'portrait-primary'`, and `categories: ['education']`.
  - Included additional static assets in pre-cache: `robots.txt` and `sitemap.xml`.

- [x] **6.2 Security & Data Integrity**
  - Installed and configured `helmet` middleware in `main.ts` enforcing strict security headers:
    - **Content Security Policy (CSP)**: Restricts `default-src` to `'self'`, allows inline scripts/styles for compatibility, whitelists Google Fonts domains for `font-src` and `style-src`, permits all image sources and connections.
    - **Cross-Origin Resource Policy**: Set to `cross-origin` to allow the frontend (on a different port/domain) to access uploaded images from the backend's static `/uploads/` endpoint.
    - Additional protections automatically applied by Helmet: `X-Content-Type-Options: nosniff`, `X-Frame-Options`, `Strict-Transport-Security (HSTS)`, `X-XSS-Protection`, `Referrer-Policy`.
  - Installed and configured `winston` + `nest-winston` + `winston-daily-rotate-file` for production-grade structured logging:
    - Created `config/logger.config.ts` factory function building a NestJS-compatible Winston logger instance.
    - **Console Transport**: Colored, timestamped, NestJS-styled output for developer readability.
    - **App Log Transport**: All `info`+ level logs written to `logs/app-YYYY-MM-DD.log`, rotated daily, zipped, 20MB max size, 14-day retention.
    - **Error Log Transport**: All `error` level logs written to `logs/error-YYYY-MM-DD.log`, rotated daily, zipped, 20MB max size, 30-day retention.
    - Injected the Winston logger into `NestFactory.create()` — all NestJS `Logger.log()`, `Logger.error()`, `Logger.warn()` calls across every module, controller, and service now automatically route through Winston file streams.
    - Replaced all `console.log()` boot messages in `main.ts` with `logger.log()` calls.
    - `logs/` directory already covered by `.gitignore`.

### 🔧 Phase 7: Production Readiness Hardening (Completed)

- [x] **7.1 TypeScript Compilation — Zero Errors**
  - Fixed `LoginPage.tsx` — corrected broken imports (`loginSchema` → `superAdminLoginSchema`) and field names (`email` → `identifier`) to align with the actual `authSchemas.ts` exports and `LoginCredentials` interface.
  - Fixed `StaffLeavePage.tsx` — changed `user._id` to `user.id` to match the `User` interface definition in `authStore.ts`.
  - Fixed `StaffClassesPage.tsx` — removed unused `Divider` import from Ant Design.
  - Fixed `StudentMediaPage.tsx` — rewrote entirely to use the correct `GalleryItem` type properties (`imageUrl`, `category`) instead of non-existent `type`/`url`/`thumbnailUrl` fields.
  - Fixed `StudentDashboardPage.tsx` — corrected Recharts `Tooltip` formatter type signature for Recharts v3 (`number | undefined` → `number`).
  - Fixed `App.tsx` — removed unused `isServerLoading` destructuring from `useServerWakeup()`.
  - **Result: `npx tsc --noEmit` passes with 0 errors.**

- [x] **7.2 Notification UI Fully Wired**
  - Created `NotificationDropdown.tsx` — a reusable component featuring:
    - Live unread badge count with 30-second background polling via `fetchUnreadCount()`.
    - Click-to-open dropdown panel displaying all notifications with time-ago formatting.
    - Mark-as-read (per notification), mark-all-read, and delete actions with optimistic UI updates.
    - Color-coded type indicators (URGENT=red, SUCCESS=green, WARNING=amber, INFO=blue).
    - Outside-click-to-close behavior and smooth enter/exit animations.
  - Integrated `NotificationDropdown` into all 3 dashboard layouts:
    - **SuperAdminLayout** — replaced the static `<FaBell>` icon in the topbar.
    - **StaffLayout** — replaced the static `<FaBell>` icon in the topbar.
    - **StudentLayout** — replaced the static `<FaBell>` icon in the topbar.

- [x] **7.3 Missing Routes & Pages**
  - Added `StudentMediaPage` route (`/student/media`) to `App.tsx` routing tree.
  - Added "Media Center" sidebar link with `FaImage` icon to `StudentLayout.tsx` navigation.
  - Created `NotFoundPage.tsx` — a premium 404 page with dark gradient, animated icon, and a "Go Home" CTA.
  - Replaced the catch-all `<LandingPage />` fallback with the proper `<NotFoundPage />` to handle unknown URLs.

- [x] **7.4 Production Build Optimization**
  - Added Rollup `manualChunks` code-splitting in `vite.config.ts` to separate vendor libraries into isolated chunks:
    - `vendor-react` (~164KB) — React, ReactDOM, React Router
    - `vendor-antd` (~1.1MB) — Ant Design + Icons
    - `vendor-charts` (~367KB) — Recharts + D3 dependencies
    - `vendor-motion` (~115KB) — Framer Motion
    - `index` (~669KB) — Application code
  - Configured `maximumFileSizeToCacheInBytes: 4MB` for PWA workbox to precache all chunks.
  - **Result: `npx vite build` succeeds with exit code 0** — 6002 modules compiled, PWA SW generated with 11 precache entries.

- [x] **7.5 Environment Configuration**
  - Updated `.env.example` with comprehensive documentation of ALL required environment variables, including previously missing: `EMAIL_USER`, `EMAIL_PASS`, `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`.

---
**Current Progress:** ✅ **ALL 7 PHASES COMPLETE** — The SJIA project is production-ready with zero TypeScript errors, successful production builds, live notification UI across all roles, proper 404 handling, optimized code splitting, and comprehensive environment configuration.