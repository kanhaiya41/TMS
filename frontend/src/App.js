import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import './assets/css/App.css';
import { useSelector } from 'react-redux';
import axios from 'axios';
import URI from './utills';
import Signup from './pages/Signup';
import SessionEndWarning from './components/SessionEndWarning';
import toast from 'react-hot-toast';

function App() {
  const [loading, setLoading] = useState(true);

  const { user, theme } = useSelector(store => store.user);
  const [superAdmin, setSuperAdmin] = useState(false);
  const [sessionWarning, setSessionWarning] = useState(false);

  const verifySuperAdmin = async () => {
    try {
      const res = await axios.get(`${URI}/auth/verifysuperadmin`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (res.data.notAuthorized) {
        setSessionWarning(true);
      }

      setSuperAdmin(res.data.success);
    } catch (err) {
      if (err.response && err.response.data) {
        if (err.response.data.notAuthorized) {
          setSessionWarning(true);
        } else {
          toast.error(err.response.data.message || "Something went wrong");
        }
      } else {
        toast.error("Something went wrong");
      }
    }
  }


  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    verifySuperAdmin();
  }, []);

  return (
    <>

      <Router>
        {sessionWarning && <SessionEndWarning setSessionWarning={setSessionWarning} />}
        <Routes>
          <Route path="/" element={
            user ? <Navigate to="/dashboard" /> : superAdmin ? <Login /> : <Signup verifySuperAdmin={verifySuperAdmin} />
          } />
          <Route path="/dashboard/*" element={
            user ? <Dashboard /> : <Navigate to="/" />
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;