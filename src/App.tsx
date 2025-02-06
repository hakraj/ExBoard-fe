import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Welcome from './pages/Welcome'
import Register from './pages/Register';
import Login from './pages/Login';
import ForgetPassword from './pages/ForgetPassword';
import NoPageFound from './pages/NoPageFound';
import Home from './pages/dashboard/Home';
import Dashboard from './pages/dashboard/Dashboard';
import Exam from './pages/dashboard/exam/Exam';
import ExamId from './pages/dashboard/exam/ExamId';
import { AuthProvider, useAuth } from './AuthProvider';
import ResetPassword from './pages/ResetPassword';

const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { authenticated, user } = useAuth();

  if (!authenticated) {
    return <Navigate to="/login" />
  }
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" />
  }
  return <Outlet />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route index path='/welcome' element={<Welcome />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/forgot-password' element={<ForgetPassword />} />
          <Route path='/reset-password/:id' element={<ResetPassword />} />
          <Route path='*' element={<NoPageFound />} />

          {/* PROTECTED ROUTES */}
          {/* Dashboard pages  */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'student']} />}>
            <Route path='/' element={<Home />} >
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path="/exam" element={<Exam />} />
              <Route path="/exam/:id" element={<ExamId />} />
            </Route>
            /</Route>

          {/* Admin access */}
          <Route path='/admin' element={<ProtectedRoute allowedRoles={['admin']} />}>

          </Route>


        </Routes>
      </AuthProvider>
    </BrowserRouter >
  )
}

export default App;
