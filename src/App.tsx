import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Welcome from './pages/Welcome'
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import ForgetPassword from './pages/auth/ForgetPassword';
import NoPageFound from './pages/NoPageFound';
import Home from './pages/dashboard/Home';
import Dashboard from './pages/dashboard/Dashboard';
import Exam from './pages/dashboard/exam/Exam';
import ExamId from './pages/dashboard/exam/ExamId';
import { AuthProvider, useAuth } from './AuthProvider';
import ResetPassword from './pages/auth/ResetPassword';
import StartExam from './pages/student-exam/StartExam';
import StudentExam from './pages/student-exam/StudentExam';
import StudentExamId from './pages/student-exam/StudentExamId';
import ExamCompleted from './pages/student-exam/ExamCompleted';
import Users from './pages/dashboard/users/Users';
import Results from './pages/dashboard/results/Results';


const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { authenticated, user } = useAuth();

  if (!authenticated) {
    return <Navigate to="/login" />
  }
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard/home" />
  }
  return <Outlet />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route index path='/' element={<Welcome />} />
          <Route path='register' element={<Register />} />
          <Route path='login' element={<Login />} />
          <Route path='forgot-password' element={<ForgetPassword />} />
          <Route path='reset-password/:id' element={<ResetPassword />} />
          <Route path='*' element={<NoPageFound />} />

          {/* PROTECTED ROUTES */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'student']} />}>
            {/* Dashboard pages  */}
            <Route path='dashboard' element={<Home />} >
              <Route path="exam" element={<Exam />} />
              <Route path="results" element={<Results />} />
            </Route>

            {/* Exam Interface */}
            <Route path='student-exam/start/:exam_id' element={<StartExam />} />
            <Route path='student-exam' element={<StudentExam />} >
              <Route path="ongoing/:exam_id" element={<StudentExamId />} />
            </Route>
            <Route path='student-exam/complete' element={<ExamCompleted />} />
          </Route>

          {/* Admin access */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path='dashboard' element={<Home />} >
              <Route path='home' element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="exam/:exam_id" element={<ExamId />} />
            </Route>
          </Route>


        </Routes>
      </AuthProvider>
    </BrowserRouter >
  )
}

export default App;
