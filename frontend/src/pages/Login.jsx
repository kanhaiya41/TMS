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
  const [npassword, setNpassword] = useState('');
  const [designation, setDesignation] = useState('');
  const [passwordModel, setPasswordModel] = useState('');
  const [code, setCode] = useState('');
  const [sendedCode, setSendedCode] = useState('');
  const [cpassword, setCPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const GenerateRandomOTP = (lenth) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const characterlenth = characters.length;
    let result = '';
    for (let i = 0; i < lenth; i++) {
      result += characters.charAt(Math.floor(Math.random() * characterlenth));
    }
    return result;
  }

  const forgetPassword = async () => {
    try {
      if (!email) {
        toast.error('Please fill the Email field!');
      }
      // if (!designation) {
      //   toast.error('Please Select the designation!');
      // }
      else {
        const res = await axios.get(`${URI}/auth/findemail/${email}`, {
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(async (r) => {
          if (!r?.data?.user?.designation?.includes('admin')) {
            const result = window.confirm('Send Request for Update your Password!')
            if (result) {
              const reqRes = await axios.post(`${URI}/auth/reqforupdatepassword`, r?.data?.user, {
                headers: {
                  'Content-Type': 'application/json'
                }
              })
                .then(async res => {
                  const notificationRes = await axios.post(`${URI}/notification/pushnotification`, { user: r?.data?.user?._id, branch: r?.data?.user?.branch, section: 'passreq', designation: r?.data?.user?.designation, department: r?.data?.user?.department },
                    {
                      headers: {
                        'Content-Type': 'application/json'
                      }
                    }
                  )

                  toast.success(res?.data?.message);
                  setEmail('');
                  setDesignation("");
                }).catch(err => {
                  // Handle error and show toast
                  if (err.response && err.response.data && err.response.data.message) {
                    toast.error(err.response.data.message); // For 400, 401, etc.
                  } else {
                    toast.error("Something went wrong got up");
                  }
                });

            } else {
              toast.error("Request Canceled by User");
            }
          }

          //work there
          else {
            const Code = GenerateRandomOTP(6);
            if (Code) {
              // setLoading(true);
              const res = await axios.post(`${URI}/auth/mailforupdatepass`, { email: r?.data?.user?.email, code: Code }, {
                headers: {
                  'Content-Type': 'application/json'
                }
              }).then(re => {
                toast.success(re?.data?.message);
                setSendedCode(Code);
                setPasswordModel(true);
              }).catch(err => {
                // Handle error and show toast
                if (err.response && err.response.data && err.response.data.message) {
                  toast.error(err.response.data.message); // For 400, 401, etc.
                } else {
                  toast.error("Something went wrong");
                }
              });
            }

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

  const updatePassword = async (e) => {
    e.preventDefault();
    try {
      if (code !== sendedCode) {
        toast.error('Code does not Match!');
      }
      else if (npassword !== cpassword) {
        toast.error('Confirm Password does not Match!')
      }
      else {
        const res = await axios.post(`${URI}/auth/updateforgetpass`, { email: email, password: npassword }, {
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(r => {

          setEmail('');
          setPassword('');
          setNpassword('');
          setCPassword('');
          setCode('');
          setDesignation('');
          setSendedCode('');
          setPasswordModel(false);
          toast.success(r?.data?.message);
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
      console.log('while update password', error);
    }
  }

  const login = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(`${URI}/auth/login`, { email: email, password: password }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
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
    finally {
      setLoading(false);
    }
  }

  return (
    <>
      {
        passwordModel ?
          <div className="login-container">
            <div className="login-card animate-fade">
              <div className="login-header">
                <h1>Ticketing System</h1>
                <p className="text-muted">Update your Password</p>
              </div>

              <form onSubmit={updatePassword} className="login-form">
                <div className="form-group">
                  <label htmlFor="code" className="form-label">Code</label>
                  <input
                    type="text"
                    id="code"
                    className="form-control"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Verification Code"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="npassword" className="form-label">New Password</label>
                  <input
                    type="password"
                    id="npassword"
                    className="form-control"
                    value={npassword}
                    onChange={(e) => setNpassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    id="cpassword"
                    className="form-control"
                    value={cpassword}
                    onChange={(e) => setCPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                // disabled={loading}
                >
                  {/* {loading ? 'Signing in...' : 'Sign In'} */}
                  Update Password
                </button>
                {
                  passwordModel && <label className="form-check-label" style={{ color: 'blue', float: 'left' }} htmlFor="remember" onClick={() => setPasswordModel(false)}>
                    Back
                  </label>
                }
                {/* <label className="form-check-label" style={{ color: 'blue' }} htmlFor="remember" onClick={forgetPassword}>
                  forget password
                </label> */}
              </form>
            </div>
          </div>
          :
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

                {/* <div className="form-group">
                  <label htmlFor="designation" className="form-label">Role</label>
                  <select onChange={(e) => setDesignation(e.target.value)} className="form-control" name="designation" id="designation">
                    <option value="" disabled selected>--Select Your Role--</option>
                    <option value="superadmin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Team Leader">Team Leader</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div> */}
                {
                  loading ? <button className="btn btn-primary btn-block">
                    <img src="/img/loader.png" className='Loader' alt="loader" />
                  </button>
                    :
                    <button
                      type="submit"
                      className="btn btn-primary btn-block"
                    >
                      Sign In
                    </button>
                }
                <label className="form-check-label" style={{ color: 'blue' }} htmlFor="remember" onClick={forgetPassword}>
                  forget password
                </label>
              </form>
            </div>
          </div>
      }
    </>


  );
}

export default Login;