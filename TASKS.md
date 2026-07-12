# FundForge - Project Roadmap

## Phase 1: Project Setup ✅

- [x] Initialize Next.js frontend with App Router
- [x] Initialize Express.js backend
- [x] Configure MongoDB connection (native driver, no Mongoose)
- [x] Install dependencies (Tailwind CSS, Gravity UI Icons, Swiper, Stripe, Nodemailer, BetterAuth)
- [x] Set up folder structure (backend/, frontend/)
- [x] Create BasicLayout and DashboardLayout components
- [x] Create Navbar (public and logged-in variants)
- [x] Create Footer (logo + social media icons)

## Phase 2: Authentication ✅

- [x] Set up BetterAuth (credentials + Google OAuth)
- [x] Registration page (name, email, photoUrl, password, role dropdown)
- [x] Registration validation (email format, password strength, existing email)
- [x] Login page (email/password + Google Sign-In)
- [x] Input validation for login
- [x] Redirect to dashboard after login/registration
- [x] Create RBAC middleware (supporter, creator, admin)
- [x] Session/token management

## Phase 3: Home Page ✅

- [x] Hero section with Swiper slider (3 banners)
- [x] Top 6 funded campaigns section (cover image, title, total raised)
- [x] Testimonial section with Swiper (static data)
- [x] 3+ custom sections (How It Works, Explore by Category, Platform Impact in Numbers)
- [x] Animations throughout the homepage

## Phase 4: Creator Dashboard

- [ ] Creator Dashboard Layout
- [ ] Creator Home — stats (total campaigns, active campaigns, total raised)
- [ ] Contributions to Review — pending table with Approve/Reject
- [ ] Approve contribution → add to campaign raised, update status
- [ ] Reject contribution → refund credits to supporter, update status
- [ ] Add New Campaign form (imgBB upload)
- [ ] Save campaign with status "pending"
- [ ] My Campaigns — table sorted by deadline, Update/Delete buttons
- [ ] Update campaign (title, story, rewardInfo)
- [ ] Delete campaign (refund supporters + remove)
- [ ] Withdrawals — show earnings, withdrawal form with auto-calc
- [ ] Withdrawals — Stripe payment system dropdown
- [ ] Withdrawal minimum 200 credits check
- [ ] Payment History — table for creator

## Phase 5: Supporter Dashboard

- [ ] Supporter Dashboard Layout
- [ ] Supporter Home — stats (total contributions, pending, approved amount)
- [ ] Approved Contributions — table
- [ ] Explore Campaigns — card grid (approved, not expired)
- [ ] Campaign Details — full info + contribution form
- [ ] Save contribution with status "pending"
- [ ] My Contributions — table with highlighted status
- [ ] Pagination on My Contributions page
- [ ] Purchase Credits — Stripe card packages
- [ ] Post-payment: save payment info + increase credits
- [ ] Payment History — table for supporter

## Phase 6: Admin Dashboard

- [ ] Admin Dashboard Layout
- [ ] Admin Home — stats (total supporters, creators, credits, payments)
- [ ] Manage Users — table with Remove and Update Role
- [ ] Manage Campaigns — table with Delete Campaign
- [ ] Campaign Approvals — approve/reject pending campaigns
- [ ] Withdrawal Requests — approve pending withdrawals
- [ ] Approve withdrawal → decrease creator's raised credits
- [ ] Reports — view reported campaigns, suspend/delete

## Phase 7: Notifications & Email

- [ ] Notification model and API
- [ ] Notify supporter on contribution approval/rejection
- [ ] Notify creator on new contribution
- [ ] Notify creator on campaign approval/rejection
- [ ] Notify creator on withdrawal approval
- [ ] Notification popup UI (floating, click-away dismiss)
- [ ] Set up Nodemailer
- [ ] Email on campaign approval/rejection
- [ ] Email on contribution confirmation
- [ ] Email on withdrawal processing

## Phase 8: Search, Filter & Report

- [ ] Search/filter UI (category, deadline, fundingGoal, status)
- [ ] MongoDB aggregation pipeline for server-side filtering
- [ ] Report system — supporter can report campaigns
- [ ] Admin reports page — view and manage reported campaigns

## Phase 9: Polish & Deployment

- [ ] Responsive design pass
- [ ] Error handling and loading states
- [ ] Performance optimization
- [ ] Final testing
- [ ] Deploy
