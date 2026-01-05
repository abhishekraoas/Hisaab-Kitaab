import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout'

import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import VerifyOTP from './pages/VerifyOTP';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Landing from "./pages/Landing";
import Groups from "./pages/Groups";
import GroupDetails from "./pages/GroupDetails";
import Reports from "./pages/Reports";
import AcceptInvite from "./pages/AcceptInvite";


function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#1f2937',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            fontWeight: '500',
          },
          success: {
            iconTheme: {
              primary: '#4f46e5',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
        <Route path="/groups" element={<MainLayout><Groups /></MainLayout>} />
        <Route path="/group/:id" element={<MainLayout><GroupDetails /></MainLayout>} />
        <Route path="/reports" element={<MainLayout><Reports /></MainLayout>} />
        <Route path="/invite/:token" element={<MainLayout><AcceptInvite /></MainLayout>} />
        
        {/* Legacy routes for backward compatibility */}
        <Route path="/expenses/home" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/users/signin" element={<SignIn />} />
        <Route path="/users/signup" element={<SignUp />} />
        <Route path="/users/forgot-password" element={<ForgotPassword />} />
        <Route path="/users/reset-password/:token" element={<ResetPassword />} />
        <Route path="/users/profile" element={<MainLayout><Profile /></MainLayout>} />
      </Routes>
    </Router>
    </>
  );
}

export default App;