import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome'
import Register from './pages/Register';
import Login from './pages/Login';
import NoPageFound from './pages/NoPageFound';
import Home from './pages/dashboard/Home';
import Dashboard from './pages/dashboard/Dashboard';
import Exam from './pages/dashboard/exam/Exam';
import ExamId from './pages/dashboard/exam/ExamId';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path='/welcome' element={<Welcome />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='*' element={<NoPageFound />} />

        {/* Dashboard pages */}

        <Route path='/' element={<Home />} >
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path="/exam" element={<Exam />} />
          <Route path="/exam/:id" element={<ExamId />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
