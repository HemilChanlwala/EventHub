# EventHub Project Presentation Guide

## What the project does

EventHub is a React web application for discovering events, creating and managing events, registering attendees, accepting Razorpay payments, issuing tickets, checking attendees in with QR codes, and displaying role-based dashboards. Supabase is used for authentication, database data, and banner-image storage.

## How a visitor moves through the website

1. `src/main.jsx` starts React and makes the Redux store and authentication data available.
2. `src/App.jsx` defines every URL and selects the page for that URL. It also applies `ProtectedRoute` where login or a particular role is required.
3. `src/layouts/MainLayout.jsx` places the shared `Navbar`, notification `Toaster`, page content, and `Footer` around normal pages.
4. A visitor can browse events, open event details, sign in, register for an event, pay, and download a ticket.

## Pages: visible parts of the website

| File | Website feature / responsibility |
| --- | --- |
| `src/pages/Home.jsx` | Landing page: hero section, search/category links, featured events, and platform highlights. |
| `src/pages/Events.jsx` | Event catalogue with text search and category filtering. |
| `src/pages/EventDetails.jsx` | Full details of one event, plus organizer-only event controls. |
| `src/pages/RegisterFlow.jsx` | Attendee registration form, Razorpay checkout, confirmation, and ticket PDF download. |
| `src/pages/Login.jsx` | Email/password and Google login; redirects back to the originally requested page. |
| `src/pages/Register.jsx` | New-account registration with email/password or Google. |
| `src/pages/ForgotPassword.jsx` | Password-reset request screen. |
| `src/pages/About.jsx`, `src/pages/Contact.jsx` | Public informational pages. |
| `src/pages/Dashboard.jsx` | General attendee dashboard with statistics, events, charts, and certificate actions. |
| `src/pages/OrganizerDashboard.jsx` | Organizer overview: event/registration data, exports, and event actions. |
| `src/pages/AdminDashboard.jsx` | Admin management page for users and events, charts, and CSV export. |
| `src/pages/MyEvents.jsx` | Events owned by the logged-in organizer. |
| `src/pages/CreateEvent.jsx` | Create/update event form and banner upload. |
| `src/pages/EditEvent.jsx` | Current edit-event placeholder that receives the selected event ID. |
| `src/pages/Tickets.jsx` | Logged-in attendee's ticket list. |
| `src/pages/Ticket.jsx` | One ticket's detail view, certificate, PDF, and calendar download controls. |
| `src/pages/CheckIn.jsx` | QR scan/manual-code screen for attendee check-in. |
| `src/pages/Profile.jsx` | Profile editing form. |
| `src/pages/Notifications.jsx`, `src/pages/Settings.jsx` | Dashboard placeholder screens for future persistent notifications/settings. |

## Reusable visual components

| File | Responsibility |
| --- | --- |
| `src/components/Navbar.jsx` | Responsive navigation, user menu, dark/light theme control, and role-aware links. |
| `src/components/Footer.jsx` | Shared footer and quick links. |
| `src/components/Sidebar.jsx` | Dashboard navigation menu. |
| `src/components/EventCard.jsx` | Reusable event preview card used in lists and dashboards. |
| `src/components/TicketCard.jsx` | Ticket summary card with PDF download action. |
| `src/components/StatsCard.jsx` | Reusable numerical dashboard statistic card. |
| `src/components/ChartWrapper.jsx` | Chart.js setup plus reusable line/bar chart components. |
| `src/components/Toaster.jsx` | Displays short success, error, and information notifications. |

## Authentication, access control, and state

| File | Responsibility |
| --- | --- |
| `src/hooks/useAuth.js` | Main authentication logic: Supabase session monitoring, login, registration, logout, and profile shaping. |
| `src/context/AuthContext.jsx` | Supplies authentication state and functions to all React components. |
| `src/routes/ProtectedRoute.jsx` | Redirects guests to login and blocks users without a required role. |
| `src/lib/supabase.js` | Creates the configured Supabase client and controls session storage preference. |
| `src/redux/store.js` | Combines Redux reducers into the application store. |
| `src/redux/slices/eventsSlice.js` | Redux state/actions for events. |
| `src/redux/slices/userSlice.js` | Redux state/actions for the current user. |

## Data and external services

| File | Responsibility |
| --- | --- |
| `src/services/eventService.js` | Supabase event CRUD operations and event data normalization. |
| `src/services/registrationService.js` | Saves/retrieves registrations; includes local-storage fallback support. |
| `src/services/authService.js` | Direct Supabase authentication API calls. |
| `src/services/storageService.js` | Uploads event banners to Supabase Storage. |
| `src/services/paymentService.js` | Calls the backend to create and verify Razorpay payments. |
| `src/services/profileService.js` | Local profile/user data used by profile and admin features. |
| `src/services/index.js` | One import point that re-exports the active service functions. |
| `src/services/index-new.js` | Alternative combined service implementation with local-storage fallback logic. |
| `src/services/supabase.js` | Alternate direct Supabase client export. |
| `src/services/notificationService.js`, `src/services/ticketService.js` | Empty placeholders reserved for future service logic. |
| `server/index.js` | Express backend that creates Razorpay orders and verifies payment signatures. |

## Tickets, files, and user feedback

| File | Responsibility |
| --- | --- |
| `src/utils/downloadTicket.js` | Captures a ticket card and saves it as a PDF using html2canvas and jsPDF. |
| `src/utils/ticketUtils.js` | Creates ticket PDFs and `.ics` calendar invitation downloads. |
| `src/utils/generateCertificate.js` | Creates a participation certificate PDF. |
| `src/utils/exportCsv.js` | Exports dashboard data as CSV. |
| `src/utils/formatDate.js` | Formats dates consistently for display. |
| `src/utils/notify.js` | Sends notification events that `Toaster.jsx` displays. |

## Styling, assets, and configuration

| File/folder | Responsibility |
| --- | --- |
| `src/index.css` | Global Tailwind import, theme variables, and common website styles. |
| `src/styles/theme.css` | Additional colour variables and base typography. |
| `src/App.css` | Legacy reusable component styling. |
| `src/assets/` | Hero and event images used by the landing page/cards. |
| `public/` | Public favicon and SVG icon assets. |
| `vite.config.js` | Vite React build/development-server configuration and backend proxy. |
| `vitest.config.js` | Test-runner configuration. |
| `eslint.config.js` | Code-quality rules. |
| `index.html` | Browser document containing the React mount point. |
| `package.json` | Dependencies and commands: `npm run dev`, `npm run build`, `npm test`, and `npm run server`. |

## Database files

| File | Database responsibility |
| --- | --- |
| `server/migrations/create_events_table.sql` | Creates the Supabase `events` table. |
| `server/migrations/create_payments_table.sql` | Creates the payment-record table. |
| `server/migrations/create_registrations_attendance.sql` | Creates registration and attendance data structures for tickets/check-in. |

## Tests

`src/__tests__/AuthPages.test.jsx` tests authentication screens and the auth hook. `Navbar.test.jsx` tests navigation. `DashboardPages.test.jsx` tests dashboard page rendering. `eventsService.test.js` tests event service behaviour with mocked Supabase. `paymentService.test.js` tests the payment requests without contacting the real server.

## Short presentation script

“EventHub is a full-stack event-management platform. The React frontend uses reusable components for navigation, cards, tickets, charts, and notifications. `App.jsx` manages page routing, while `ProtectedRoute.jsx` protects role-based pages. Supabase provides authentication, event data, registrations, and image storage. Organizers create events and attendees can register, pay through Razorpay, download tickets, and check in through QR code scanning. The admin and organizer dashboards summarize data and can export reports as CSV.”
