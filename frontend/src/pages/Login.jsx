import { useState } from 'react';
import '../assets/css/login.css';
import mockUsers from '../data/mockUsers';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import URI from '../utills';
import toast from 'react-hot-toast';
import { setUser } from '../Redux/userSlice';

function Login() {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [designation, setDesignation] = useState('');

  const forgetPassword = async () => {
    try {
      if (!email) {
        alert('Please fill the Email field!');
      }
      else {
        const res = await axios.get(`${URI}/auth/findemail/${email}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(async (r) => {
          const result = window.confirm('Send Request for Update your Password!')
          if (result) {
            const reqRes = await axios.post(`${URI}/auth/reqforupdatepassword`, res?.data?.user, {
              headers: {
                'Content-Type': 'application/json'
              }
            })
              .then(res => {
                toast.success(res?.data?.message);
                setEmail('');
              }).catch(err => {
                // Handle error and show toast
                if (err.response && err.response.data && err.response.data.message) {
                  toast.error(err.response.data.message); // For 400, 401, etc.
                } else {
                  toast.error("Something went wrong");
                }
              });

          } else {
            toast.error("Request Canceled by User");
          }
        }).catch(err => {
          // Handle error and show toast
          if (err.response && err.response.data && err.response.data.message) {
            toast.error(err.response.data.message); // For 400, 401, etc.
          } else {
            toast.error("Something went wrong");
          }
        });

      }
    } catch (error) {
      console.log("while sending forget password request", error);
    }
  }

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${URI}/auth/login`, { email: email, password: password, designation: designation }, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        dispatch(setUser(res?.data?.user));
        toast.success(res.data.message);
      }).catch(err => {
        // Handle error and show toast
        if (err.response && err.response.data && err.response.data.message) {
          toast.error(err.response.data.message); // For 400, 401, etc.
        } else {
          toast.error("Something went wrong");
        }
      });
    } catch (error) {
      console.log("while login", error);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card animate-fade">
        <div className="login-header">
          <h1>Ticketing System</h1>
          <p className="text-muted">Sign in to your account</p>
        </div>

        <form onSubmit={login} className="login-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
          // disabled={loading}
          >
            {/* {loading ? 'Signing in...' : 'Sign In'} */}
            Sign In
          </button>
          <label className="form-check-label" style={{ color: 'blue' }} htmlFor="remember" onClick={forgetPassword}>
            forget password
          </label>
        </form>

        {/* <div className="login-demo mt-4">
          <p className="text-sm text-center">Demo Accounts:</p>
          <div className="demo-accounts">
            <button 
              onClick={() => {
                setEmail('executive@example.com');
                setPassword('password');
              }}
              className="btn btn-sm btn-outline"
            >
              Executive
            </button>
            <button 
              onClick={() => {
                setEmail('manager@example.com');
                setPassword('password');
              }}
              className="btn btn-sm btn-outline"
            >
              Manager
            </button>
            <button 
              onClick={() => {
                setEmail('teamleader@example.com');
                setPassword('password');
              }}
              className="btn btn-sm btn-outline"
            >
              Team Leader
            </button>
            <button 
              onClick={() => {
                setEmail('admin@example.com');
                setPassword('password');
              }}
              className="btn btn-sm btn-outline"
            >
              Admin
            </button>
            <button 
              onClick={() => {
                setEmail('superadmin@example.com');
                setPassword('password');
              }}
              className="btn btn-sm btn-outline"
            >
              Super Admin
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default Login;