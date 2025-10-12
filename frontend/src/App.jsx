import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout'

import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Landing from "./pages/Landing";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/expenses/home" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/users/signin" element={<MainLayout><SignIn /></MainLayout>} />
        <Route path="/users/signup" element={<MainLayout><SignUp /></MainLayout>} />
        <Route path="/users/forgot-password" element={<MainLayout><ForgotPassword /></MainLayout>} />
        <Route path="/users/reset-password/:token" element={<MainLayout><ResetPassword /></MainLayout>} />
        <Route path="/users/profile" element={<MainLayout><Profile /></MainLayout>} />
      </Routes>
    </Router>
  );
}

export default App;