# 🚀 Setup Guide - Hisaab Kitaab

## ✅ Completed Features (Phase 1 - Authentication System)

### Backend Implementation
- ✅ Session-based authentication with Express Session & MongoDB store
- ✅ OTP verification via email using Nodemailer
- ✅ Secure password reset with email link
- ✅ Profile management (view, update, delete)
- ✅ Income and budget tracking fields
- ✅ Protected routes with authentication middleware

### Frontend Implementation
- ✅ Modern UI with Tailwind CSS (Indigo/Purple gradient theme)
- ✅ SignUp with OTP verification flow
- ✅ SignIn with session management
- ✅ Email OTP verification page
- ✅ Forgot Password page
- ✅ Reset Password page
- ✅ Profile management with edit and delete account

---

## 🔧 Setup Instructions

### 1. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Environment Variables
Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database - MongoDB Atlas or Local
URL_DB=mongodb://localhost:27017/hisaab-kitaab
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/hisaab-kitaab

# Session Secret (Change in production!)
SESSION_SECRET=your-secret-session-key-change-this

# Gmail Configuration for OTP
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# Frontend URL
FRONTEND_URL=http://localhost:5173

# JWT Secret (for backward compatibility)
JWT_SECRET=your-jwt-secret-key
```

#### Setup Gmail for Nodemailer
1. Go to Google Account Settings
2. Enable 2-Factor Authentication
3. Go to Security → App Passwords
4. Generate an App Password for "Mail"
5. Use this password in `EMAIL_PASSWORD` in .env

#### Start Backend Server
```bash
cd backend
npm run dev
```

Server will run on: `http://localhost:5000`

---

### 2. Frontend Setup

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Update API Base URL (if needed)
File: `frontend/src/utils/api.js`
```javascript
const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});
```

#### Start Frontend
```bash
cd frontend
npm run dev
```

Frontend will run on: `http://localhost:5173`

---

## 🎯 Testing the Authentication System

### 1. Sign Up Flow
1. Go to http://localhost:5173/signup
2. Fill in: Name, Email, Mobile, Password
3. Click "Sign Up"
4. Check your email for 6-digit OTP
5. Enter OTP on verification page
6. Account is verified!

### 2. Sign In Flow
1. Go to http://localhost:5173/signin
2. Enter Email & Password
3. If not verified, you'll be redirected to OTP page
4. If verified, you'll be logged in

### 3. Forgot Password Flow
1. Go to http://localhost:5173/forgot-password
2. Enter your email
3. Check email for reset link
4. Click link (opens reset-password page)
5. Enter new password
6. Login with new password

### 4. Profile Management
1. Login and go to http://localhost:5173/profile
2. View your profile details
3. Click "Edit Profile" to update:
   - Name
   - Mobile Number
   - Monthly Income
   - Monthly Budget
4. Click "Delete Account" to permanently delete

---

## 📡 API Endpoints

### Authentication
- `POST /api/users/signup` - Register new user (sends OTP)
- `POST /api/users/verify-otp` - Verify email with OTP
- `POST /api/users/resend-otp` - Resend OTP
- `POST /api/users/signin` - Login (session-based)
- `POST /api/users/logout` - Logout (destroy session)
- `POST /api/users/forgot-password` - Send password reset email
- `POST /api/users/reset-password` - Reset password with token

### Profile (Protected)
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update profile
- `DELETE /api/users/profile` - Delete account

---

## 🎨 UI Design Highlights

### Color Scheme (Expenso-inspired)
- Primary: Indigo (600, 700)
- Background: Gradient (Indigo-50 to Purple-50)
- Accents: Green (success), Red (error/delete)

### Components Style
- Rounded corners: `rounded-2xl`
- Shadows: `shadow-xl`
- Borders: `border border-gray-100`
- Focus states: `ring-2 ring-indigo-500`

---

## 🔐 Security Features

1. **Password Hashing**: bcryptjs with salt rounds = 10
2. **Session Management**: Secure HTTP-only cookies
3. **OTP Expiry**: 10 minutes
4. **Reset Token Expiry**: 1 hour
5. **CSRF Protection**: SameSite cookie policy
6. **Email Verification**: Required before login

---

## 📝 Next Steps (Remaining Features)

### Phase 2: Personal Expense Tracking
- [ ] Add/Edit/Delete personal expenses
- [ ] Category-wise expense filtering
- [ ] Date range filtering
- [ ] Expense summary dashboard

### Phase 3: Budget Management
- [ ] Set monthly budget limits
- [ ] Real-time spending alerts (80%, 100%)
- [ ] Budget vs actual spending comparison

### Phase 4: Group Expenses
- [ ] Create groups (Trip, Flat, Office, etc.)
- [ ] Add/remove group members
- [ ] Add shared expenses
- [ ] Split expenses (equal, custom, percentage)
- [ ] Calculate settlements (who owes whom)

### Phase 5: Reports & Analytics
- [ ] Monthly/yearly reports
- [ ] Category-wise pie charts
- [ ] Spending trends (line/bar charts)
- [ ] Export reports (CSV/PDF)

---

## 🐛 Troubleshooting

### Backend Not Starting
- Check MongoDB connection string in .env
- Ensure MongoDB is running (local) or accessible (Atlas)
- Check if PORT 5000 is available

### Email OTP Not Sending
- Verify EMAIL_USER and EMAIL_PASSWORD in .env
- Use App Password, not regular Gmail password
- Check Gmail 2FA is enabled

### Session Not Persisting
- Ensure `withCredentials: true` in frontend API config
- Check CORS settings in backend allow credentials
- Verify FRONTEND_URL in backend .env matches actual URL

### Profile Page Shows 401 Unauthorized
- Clear browser cookies
- Login again
- Check session middleware is applied in server.js

---

## 👨‍💻 Tech Stack

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- express-session + connect-mongo
- bcryptjs
- nodemailer
- crypto (for reset tokens)

**Frontend:**
- React 18
- React Router v6
- Axios
- Tailwind CSS
- Vite

---

## 📧 Support

For issues or questions:
1. Check console logs (backend & frontend)
2. Verify .env configuration
3. Test API endpoints with Postman/Thunder Client

---

**Status**: ✅ Authentication System Complete | 🚧 Expense Management In Progress
