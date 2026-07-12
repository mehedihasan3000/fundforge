# FundForge

A modern crowdfunding platform where creators raise money for projects, causes, and products by collecting contributions from supporters.

## Features

### For Supporters
- Browse and discover campaigns with advanced search and filtering
- Contribute credits to campaigns you believe in
- Track your contributions and payment history
- Purchase credit packages via Stripe
- Report suspicious or fraudulent campaigns
- Receive real-time notifications on contribution status

### For Creators
- Launch and manage campaigns with rich storytelling
- Set funding goals, deadlines, and rewards
- Review and approve/reject contributions
- Track supporters, earnings, and campaign performance
- Request fund withdrawals (20 credits = $1)
- Post campaign updates

### For Admins
- Oversee platform operations from a centralized dashboard
- Approve or reject campaigns before they go live
- Manage user roles and remove problematic accounts
- Process creator withdrawal requests
- Resolve reported campaign issues
- View platform-wide analytics

## Tech Stack

| Technology      | Purpose              |
| --------------- | -------------------- |
| Next.js         | Frontend framework   |
| Express.js      | Backend API server   |
| MongoDB         | Database             |
| BetterAuth      | Authentication       |
| Tailwind CSS    | Styling              |
| Gravity UI Icons| Icon library         |
| Swiper Slider   | Carousels & sliders  |
| Stripe          | Payment processing   |
| imgBB           | Image uploading      |
| Nodemailer      | Email notifications  |

## Getting Started

### Prerequisites
- Node.js
- MongoDB instance (local or Atlas)
- Stripe account
- imgBB API key

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd fundforge
   ```

2. Install backend dependencies
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies
   ```bash
   cd frontend
   npm install
   ```

4. Create environment files

   **backend/.env**
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   STRIPE_SECRET_KEY=your_stripe_secret_key
   IMGBB_API_KEY=your_imgbb_api_key
   SMTP_HOST=your_smtp_host
   SMTP_PORT=587
   SMTP_USER=your_email
   SMTP_PASS=your_email_password
   ```

   **frontend/.env.local**
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

5. Start the backend
   ```bash
   cd backend
   npm run dev
   ```

6. Start the frontend
   ```bash
   cd frontend
   npm run dev
   ```

7. Open http://localhost:3000

## Business Model

- Supporters purchase credits at **10 credits = $1**
- Creators withdraw at **20 credits = $1**
- The spread covers platform operating costs

### Credit Packages

| Credits | Price  |
| ------- | ------ |
| 100     | $10    |
| 300     | $25    |
| 800     | $60    |
| 1500    | $110   |

## Project Structure

```
backend/
  config/         - Database configuration
  controllers/    - Route handlers
  middleware/     - Authentication & RBAC
  models/         - MongoDB collection helpers
  routes/         - API route definitions
  utils/          - Email, notifications, helpers

frontend/
  src/
    app/          - Next.js App Router pages
    components/   - Reusable UI components
    context/      - React contexts
    hooks/        - Custom React hooks
    lib/          - Utilities and API client
```

## License

MIT
