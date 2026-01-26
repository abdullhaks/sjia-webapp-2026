# SHEIKH JEELANI ISLAMIC ACADEMY - Full Stack Development Master Prompt

## Project Context
You are tasked with building a comprehensive Islamic college management system for Sheikh Jeelani Islamic Academy, Mankery, Irimbiliyam, Malappuram, Kerala. This is a premier institution established in 2002 that combines Islamic education with modern professional studies.

## Your Role
Act as a **highly skilled software engineer and UI/UX designer** with expertise in:
- Modern full-stack development (React, NestJS, TypeScript)
- Scalable architecture design
- Islamic educational institution management systems
- Advanced UI/UX patterns and accessibility
- SEO/AEO optimization
- Security best practices

## Critical Instructions

### Documentation Protocol
Before ANY development work:
1. **READ** `PLAN.md` to understand the overall architecture and phase structure
2. **READ** `PROGRESS.md` to see what has been completed
3. **UPDATE** `PROGRESS.md` after completing each task with:
   - What was implemented
   - Files created/modified
   - Any decisions made
   - Challenges faced and solutions
   - Next steps

### Development Approach
- Start with **PLANNING PHASE** - create detailed `PLAN.md` first
- Follow **incremental development** - one phase at a time
- Ensure **continuity** - always check existing progress before adding features
- Maintain **consistency** - follow established patterns and conventions
- Document **decisions** - explain architectural choices

---

## Project Requirements

### Institution Details
```
Name: SHEIKH JEELANI ISLAMIC ACADEMY
Address: Mankery, Irimbiliyam, Malappuram, Kerala
Established: 2002
Focus: Islamic studies integrated with professional education
Programs: 8th Standard to PG (under Kerala Open University)
```

### Core Values & Mission
- Academic excellence with Islamic ethical foundation
- Holistic personality development
- Professional skills with moral integrity
- Preparation for careers and higher education
- Value-driven environment promoting discipline and leadership

---

## Technical Architecture

### Frontend Stack
**Framework & Libraries:**
- React 18+ (Latest version)
- TypeScript
- Tailwind CSS v4.1
- Framer Motion (smooth, modern animations)
- Ant Design (components, alerts, notifications)
- React Bits Components (https://reactbits.dev/)
- Zustand (state management)
- React Router v6 (routing)
- Axios (HTTP client)
- Zod (validation)
- React Hook Form (form handling)

**Architecture Requirements:**
```
frontend/
├── src/
│   ├── components/
│   │   ├── common/          # Reusable UI components
│   │   ├── layouts/         # Layout wrappers
│   │   └── features/        # Feature-specific components
│   ├── pages/
│   │   ├── public/          # Landing, about, programs, etc.
│   │   ├── auth/            # Login pages for all roles
│   │   ├── superadmin/      # Super admin dashboard & features
│   │   ├── staff/           # Staff dashboard & features
│   │   └── student/         # Student portal
│   ├── services/
│   │   ├── api/
│   │   │   ├── superadmin.api.ts
│   │   │   ├── staff.api.ts
│   │   │   ├── student.api.ts
│   │   │   └── public.api.ts
│   │   └── axios/
│   │       ├── interceptors.ts
│   │       └── instances.ts    # Separate instances per role
│   ├── store/               # Zustand stores
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utilities, helpers
│   ├── validations/         # Zod schemas
│   ├── types/               # TypeScript types/interfaces
│   ├── routes/              # Route configuration
│   │   ├── PublicRoutes.tsx
│   │   ├── PrivateRoutes.tsx
│   │   └── RoleBasedRoutes.tsx
│   └── styles/              # Global styles, theme
```

**Key Frontend Features:**
1. **Centralized Axios Interceptor**
   - Create base interceptor with token refresh logic
   - Separate axios instances for: superadmin, staff, student, public
   - Automatic token attachment and refresh
   - Error handling and retry logic

2. **Authentication & Authorization**
   - JWT with 4-second access token, 1-week refresh token
   - Protected routes based on roles
   - Persistent auth state with Zustand
   - Auto logout on token expiry
   - Remember me functionality

3. **Validation**
   - Zod schemas for all forms
   - Field-level validation with error messages
   - Custom validation rules (phone, email, NIC, etc.)
   - Async validation for unique checks

4. **Error Handling**
   - Ant Design alerts for API errors
   - Field-level error display
   - Toast notifications for success/info
   - Global error boundary

5. **Performance Optimization**
   - Debounced search (300ms) for staff/student lists
   - Lazy loading for routes
   - Image optimization
   - Code splitting
   - Memoization where needed

6. **SEO & AEO**
   - React Helmet for meta tags
   - Semantic HTML structure
   - Alt text for images
   - Structured data (JSON-LD)
   - Sitemap generation
   - Open Graph tags
   - Twitter cards
   - Canonical URLs

### Backend Stack
**Framework & Tools:**
- NestJS (latest)
- TypeScript
- MongoDB with Mongoose
- JWT (authentication)
- Nodemailer (email service)
- AWS S3 SDK (media storage)
- Zod (validation)
- Bcrypt (password hashing)

**Architecture Requirements (Clean Architecture):**
```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.repository.ts
│   │   │   ├── dto/
│   │   │   ├── guards/
│   │   │   └── strategies/
│   │   ├── superadmin/
│   │   │   ├── superadmin.controller.ts
│   │   │   ├── superadmin.service.ts
│   │   │   ├── superadmin.repository.ts
│   │   │   └── dto/
│   │   ├── staff/
│   │   ├── student/
│   │   ├── admission/
│   │   ├── exam/
│   │   ├── timetable/
│   │   ├── leave/
│   │   ├── result/
│   │   ├── studymaterial/
│   │   ├── gallery/
│   │   └── contact/
│   ├── common/
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── pipes/
│   │   └── validators/
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   ├── email.config.ts
│   │   └── s3.config.ts
│   ├── database/
│   │   ├── schemas/
│   │   └── migrations/
│   ├── services/
│   │   ├── email/
│   │   │   ├── email.service.ts
│   │   │   └── templates/
│   │   │       ├── welcome.template.ts
│   │   │       ├── admission.template.ts
│   │   │       ├── result.template.ts
│   │   │       └── leave.template.ts
│   │   ├── s3/
│   │   │   └── s3.service.ts
│   │   └── notification/
│   ├── types/
│   └── utils/
```

**Key Backend Features:**
1. **Clean Architecture**
   - Controller: Handle HTTP requests/responses
   - Service: Business logic
   - Repository: Database operations
   - Dependency injection throughout

2. **Authentication & Security**
   - JWT strategy with refresh tokens
   - Access token: 4 seconds expiry
   - Refresh token: 1 week expiry
   - Password hashing with bcrypt (10 rounds)
   - Role-based guards
   - Rate limiting
   - CORS configuration
   - Helmet for security headers

3. **Validation & DTOs**
   - Zod schemas for all inputs
   - DTO classes with transformers
   - Response DTOs (exclude sensitive data)
   - Custom validation pipes
   - Proper HTTP status codes

4. **Email Service**
   - Nodemailer with branded templates
   - Email templates with college logo and styling
   - Templates for: welcome, admission, results, leave approval, etc.
   - HTML email with inline CSS
   - Fallback text version

5. **File Management (AWS S3)**
   - Signed URLs for secure access
   - Organized folder structure
   - Image optimization before upload
   - File type validation
   - Size limits
   - Automatic cleanup

6. **Database Design**
   - Normalized collections
   - Proper indexing
   - Relationships with refs
   - Soft deletes where applicable
   - Audit fields (createdAt, updatedAt)
   - Virtual fields for computed data

---

## Feature Requirements

### 1. PUBLIC LANDING SECTION

#### Hero Section
- Greeting message
- Quranic verse (Arabic with translation)
- College name and establishment year
- Quick action buttons: "Apply Now", "Explore Programs", "Virtual Tour"
- Background: Elegant pattern/image
- Smooth scroll indicators

#### About Section
- College overview and history (since 2002)
- Vision and mission statements
- Core values
- Unique selling points
- Leadership team showcase
- Statistical highlights (students, programs, success rate)

#### Programs Section
- Cards for each program level:
  - 8th Standard preparation
  - SSLC program
  - Plus Two
  - Degree programs (under Kerala Open University)
  - PG programs
- Interactive cards with hover effects
- Program highlights and duration
- Eligibility criteria
- "Learn More" buttons

#### Campus Section
**Activities Tab:**
- Arts & Cultural programs
- Sports events
- Competitions
- Association gatherings
- Academic seminars
- Community service
- Each with images and descriptions

**Gallery Tab:**
- Modern, interactive grid layout
- Lightbox for image viewing
- Categories: Events, Campus, Students, Achievements
- Video gallery support
- Lazy loading images

#### Testimonials
- Carousel/slider layout
- Student/Alumni photos
- Name, batch, current position
- Testimonial text
- Star ratings
- "Success Stories" button

#### Admission Area
- Conditional rendering (admin controlled)
- Multi-step admission form:
  1. Personal details
  2. Educational background
  3. Course selection
  4. Document upload
  5. Interview preference
- Form validation with Zod
- Auto-email on submission
- Application tracking number
- Status page for applicants

#### Academic Excellence
- Showcase section for:
  - Top performers
  - Award winners
  - Research achievements
  - Publications
  - Competition winners
- Timeline view or card grid
- Filterable by year/category

#### Student Council Section
- Current council structure
- Leader profiles with photos
- Responsibilities and contact
- Past councils archive
- Physical & digital activities
- Social media links
- Event updates

#### Contact Section
- Contact form with validation
- Auto-reply email setup
- College address with map embed
- Phone numbers
- Email addresses
- Social media icons (WhatsApp, Instagram, Facebook, YouTube, etc.)
- Business hours
- FAQ accordion

### 2. SUPER ADMIN PANEL

#### Dashboard
- Overview statistics:
  - Total students (by program)
  - Total staff
  - Active admissions
  - Pending leaves
  - Upcoming exams
- Recent activities feed
- Quick actions panel
- Charts and graphs (attendance, performance)

#### Student Management
- List view with search and filters
- Debounced search (300ms)
- Pagination
- Bulk actions
- Individual student profile
- Edit/Update capabilities
- Academic history
- Attendance records
- Fee status
- Behavior/Discipline records

#### Staff Management
- List view with filters
- Add/Edit/Archive staff
- Role assignment
- Subject allocation
- Class allocation
- Salary management
- Leave balance
- Performance tracking

#### Admission Management
- View all applications
- Filter by status (pending/approved/rejected)
- Interview scheduling
- Bulk status update
- Notification system
- Document verification
- Enable/Disable public admission form

#### Leave Management
- Approve/Reject leaves (staff & students)
- Leave calendar view
- Leave balance tracking
- Leave types configuration
- Notification on approval/rejection

#### Exam Management
- Create exam schedules
- Exam type (internal/external)
- Date and time slots
- Hall allocation
- Invigilator assignment
- Notification to students/staff

#### Result Management
- Upload results (bulk/individual)
- Result approval workflow
- Grade calculation settings
- Result publication
- Merit list generation
- Transcripts generation

#### Study Materials
- Upload materials by subject/class
- Organize in folders
- File type support (PDF, PPT, Video links)
- Version control
- Access control

#### Student Council
- Manage council positions
- Assign students to positions
- Update activities and events
- Photo gallery for council events
- Publish to public website

#### Timetable Management
- Create/Edit timetables
- Class-wise schedules
- Staff-wise schedules
- Period allocation
- Conflict detection
- Template creation

#### Settings
- System configuration
- Email templates
- Notification settings
- Academic year management
- Holiday calendar
- Backup and restore

### 3. STAFF PANEL

#### Dashboard
- Personal schedule (today's classes)
- Upcoming classes
- Pending tasks
- Leave balance
- Recent announcements

#### Profile Management
- View/Edit personal details
- Update profile photo (AWS S3)
- Change password
- Contact information
- Qualifications

#### Schedule & Timetable
- View assigned timetable
- Today's periods highlighted
- Request period interchange
- View substitute requests
- Mark attendance for periods

#### Class Management
- View assigned classes
- Student list per class
- Mark attendance
- Class notes
- Assignments

#### Exam & Results
- View exam schedules
- Enter marks/grades
- Update results
- View result reports
- Performance analysis

#### Leave Application
- Apply for leave
- Leave history
- Leave balance
- Approval status tracking

#### Study Materials
- Upload materials for classes
- Organize by subject
- Share links
- Version management

#### Communication
- Internal messaging
- Announcements view
- Notice board

### 4. STUDENT PORTAL

#### Dashboard
- Current courses
- Today's schedule
- Recent grades
- Attendance percentage
- Pending assignments
- Announcements

#### Profile
- Personal information
- Update profile photo
- Change password
- Contact details
- Emergency contacts

#### Academic Records
- Enrolled courses
- Current semester details
- Credit summary
- GPA/CGPA

#### Attendance
- Subject-wise attendance
- Monthly view
- Attendance percentage
- Leave applications

#### Exam & Results
- Exam schedules
- Hall tickets download
- Results view (semester-wise)
- Grade reports
- Performance graphs
- Rank/Position

#### Study Materials
- Subject-wise materials
- Download/view files
- Recent uploads
- Search functionality

#### Fee Management
- Fee structure
- Payment history
- Pending fees
- Receipt download
- Online payment integration (optional)

#### Timetable
- View class schedule
- Weekly view
- Download timetable
- Exam schedule

#### Leave Application
- Apply for leave
- Upload supporting documents
- Track status
- Leave history

#### Feedback & Complaints
- Submit feedback
- Raise complaints
- Track resolution
- Anonymous option

---

## Design Requirements

### Color Scheme
**Primary Palette:**
- Primary: Orchid Violet (#FAFAFA, #FFFFFF )
- Secondary: Snowy White ( #9B59B6, #8E44AD variations)
- Accent: Gold (#F39C12) for Islamic elements
- Semantic colors:
  - Success: #27AE60
  - Warning: #F39C12
  - Error: #E74C3C
  - Info: #3498DB

**Dark Mode Palette:**
- Background: #1A1A2E
- Surface: #16213E
- Text: #E8E8E8
- Accents: Lighter violet shades

### Design Principles
1. **Glassmorphism**
   - Frosted glass effect on cards
   - Subtle transparency (rgba)
   - Backdrop blur
   - Soft shadows

2. **Typography**
   - Arabic font for Quranic verses (Amiri, Scheherazade)
   - Modern sans-serif for UI (Inter, Poppins)
   - Clear hierarchy
   - Readable line spacing

3. **Animations (Framer Motion)**
   - Page transitions
   - Card hover effects
   - Smooth scroll
   - Loading states
   - Modal animations
   - List item stagger

4. **Responsiveness**
   - Mobile-first approach
   - Breakpoints: 640, 768, 1024, 1280, 1536px
   - Touch-friendly buttons (min 44x44px)
   - Adaptive layouts

5. **Accessibility**
   - WCAG 2.1 AA compliance
   - Keyboard navigation
   - Screen reader support
   - Focus indicators
   - Alt text for images
   - Proper ARIA labels

---

## Implementation Phases

### Phase 1: Project Setup & Foundation
- Initialize frontend (React + Vite/CRA)
- Initialize backend (NestJS)
- Setup MongoDB connection
- Configure AWS S3
- Setup environment variables
- Create folder structures
- Setup ESLint, Prettier
- Configure TypeScript
- Install all dependencies

### Phase 2: Authentication System
- JWT implementation (backend)
- Login pages for all roles
- Registration for Super Admin
- Protected routes
- Role-based guards
- Token refresh mechanism
- Axios interceptors
- Auth state management (Zustand)

### Phase 3: Public Website
- Landing page components
- Hero section
- About section
- Programs section
- Campus & Gallery
- Testimonials
- Contact form
- SEO optimization
- Responsive design

### Phase 4: Super Admin - Core
- Dashboard layout
- Student CRUD
- Staff CRUD
- Basic search & filters
- Profile management

### Phase 5: Super Admin - Advanced
- Admission system
- Leave management
- Exam management
- Result management
- Timetable creation
- Study materials
- Student council management

### Phase 6: Staff Panel
- Dashboard
- Profile management
- Schedule view
- Attendance marking
- Result entry
- Leave application
- Study materials upload

### Phase 7: Student Portal
- Dashboard
- Profile management
- Academic records
- Attendance view
- Results view
- Study materials access
- Fee status
- Leave application

### Phase 8: Advanced Features
- Email notification system
- File upload to S3     // foldername : sjia
- Real-time notifications
- Analytics & reports
- Export functionality
- Advanced search
- Calendar integration

### Phase 9: Testing & Optimization
- Unit tests
- Integration tests
- E2E tests
- Performance optimization
- Security audit
- Accessibility testing
- Browser compatibility

### Phase 10: Deployment
- Production build
- Environment configuration
- Database migration
- Server setup
- SSL certificate
- Domain configuration
- Monitoring setup
- Backup strategy

---

## Development Checklist

### Before Starting Any Phase:
- [ ] Read PLAN.md completely
- [ ] Read PROGRESS.md to see completed work
- [ ] Understand the current state
- [ ] Identify dependencies

### During Development:
- [ ] Follow established patterns
- [ ] Write clean, documented code
- [ ] Use TypeScript strictly
- [ ] Validate all inputs
- [ ] Handle all errors
- [ ] Test functionality
- [ ] Ensure responsiveness
- [ ] Check accessibility

### After Completing Tasks:
- [ ] Update PROGRESS.md with details
- [ ] Document any new patterns
- [ ] Note challenges and solutions
- [ ] List next steps
- [ ] Commit with clear messages

---

## File Structure for Documentation

### PLAN.md
```markdown
# SJIA Development Plan

## Overview
[Project summary]

## Phase Details
### Phase 1: [Name]
**Objectives:**
- Goal 1
- Goal 2

**Tasks:**
- [ ] Task 1
- [ ] Task 2

**Deliverables:**
- Item 1
- Item 2

**Technical Decisions:**
- Decision 1 and rationale

[Repeat for all phases]

## Database Schema Design
[Detailed schema for each collection]

## API Endpoints
[List all endpoints with methods]

## Component Structure
[Component hierarchy]
```

### PROGRESS.md
```markdown
# SJIA Development Progress

## [Date] - Phase X: [Name]
**Developer Notes:**
[Context, decisions made]

**Completed:**
- ✅ Task 1 - [Details]
- ✅ Task 2 - [Details]

**Files Modified/Created:**
- `path/to/file.ts` - [What changed]

**Challenges & Solutions:**
- Challenge: [Description]
  Solution: [How resolved]

**Next Steps:**
- [ ] Upcoming task 1
- [ ] Upcoming task 2

**Code Snippets:**
```typescript
// Important implementations
```

[Continue chronologically]
```

---

## Quality Standards

### Code Quality
- Follow SOLID principles
- DRY (Don't Repeat Yourself)
- Clear naming conventions
- Comprehensive comments
- Type safety (no `any` types)
- Error boundaries
- Consistent formatting

### Security
- Input validation (frontend & backend)
- SQL injection prevention (use Mongoose properly)
- XSS prevention
- CSRF protection
- Rate limiting
- Secure headers
- Environment variables for secrets
- Password hashing
- JWT best practices

### Performance
- Lazy loading
- Code splitting
- Image optimization
- Caching strategies
- Database indexing
- Query optimization
- Debouncing/Throttling
- Bundle size optimization

---

## Success Criteria

### Functionality
- All features working as specified
- No critical bugs
- Proper error handling
- Smooth user experience

### Design
- Consistent UI across pages
- Responsive on all devices
- Accessible to all users
- Beautiful and modern aesthetics

### Performance
- Page load < 3 seconds
- Smooth animations (60fps)
- API responses < 500ms
- Optimized images

### Security
- No vulnerabilities
- Secure authentication
- Protected routes
- Validated inputs

### Code Quality
- Well-organized structure
- Comprehensive documentation
- Reusable components
- Maintainable codebase

---

## Environment Variables Template

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:3000
VITE_S3_BASE_URL=https://your-bucket.s3.region.amazonaws.com
```

### Backend (.env)
```
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sjia

# JWT
JWT_SECRET=your-secret-key
JWT_ACCESS_EXPIRY=4s
JWT_REFRESH_EXPIRY=7d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=SJIA <noreply@sjia.edu>

# AWS S3
AWS_REGION=your-region
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_S3_BUCKET=sjia-media

# App
PORT=3000
NODE_ENV=development
```

---

## Final Notes

This is a comprehensive, production-ready educational platform. Every decision should be made with:
- **Scalability** in mind
- **User experience** as priority
- **Security** as non-negotiable
- **Maintainability** for future developers
- **Islamic values** respectfully integrated

Start with the planning phase, create detailed PLAN.md, and then proceed incrementally, documenting everything in PROGRESS.md.

**Remember:** Quality over speed. Build it right the first time.