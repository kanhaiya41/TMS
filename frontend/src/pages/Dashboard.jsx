import { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { faDyalog } from '@fortawesome/free-brands-svg-icons'
import { faBell, faBuilding, faChartBar, faComment, faMoon, faSun, faUser } from '@fortawesome/free-regular-svg-icons'
import { faBars, faChartLine, faCodePullRequest, faCommentDots, faGear, faLock, faPersonCircleQuestion, faSignOut, faTicketAlt, faTimes, faUserCog, faUsers, faUsersCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { FaTicketAlt, FaUsers, FaUsersCog, FaBuilding, FaLock, FaChartBar, FaBars, FaTimes } from 'react-icons/fa';
import ExecutivePanel from './panels/ExecutivePanel';
import ManagerPanel from './panels/ManagerPanel';
import TeamLeaderPanel from './panels/TeamLeaderPanel';
import AdminPanel from './panels/AdminPanel';
import SuperAdminPanel from './panels/SuperAdminPanel';
import UserProfile from './UserProfile';
import NotFound from './NotFound';
import '../assets/css/components.css';
import '../assets/css/dashboard.css';
import { useDispatch, useSelector } from 'react-redux';
import { setNotificationCount, setTheme, setUser } from '../Redux/userSlice';
import axios from 'axios';
import URI from '../utills';
import toast from 'react-hot-toast';

function Dashboard() {

  const dispatch = useDispatch()

  const { user, theme, notificationCount } = useSelector(store => store.user);

  const [sidebarExpanded, setSidebarExpanded] = useState(window.innerWidth >= 1024);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState('Dashboard');
  // const [notificationCount, setNotificationCount] = useState(0);

  const fetchNotification = async () => {
    try {
      let payload = {
        userId: user?._id,
        designation: user?.designation
      };

      if (user?.designation === 'admin') {
        payload.branches = user?.branches;
      }

      if (user?.designation !== 'superadmin') {
        payload.branch = user?.branch;
      }

      if (user?.designation === 'Team Leader' || user?.designation === 'Executive') {
        payload.department = user?.department;
      }

      console.log(payload);
      console.log(user);
      // else if(user?.designation)

      const res = await axios.post(`${URI}/notification/getnotification`, payload, {
        headers: {
          'Content-Type': ' application/json'
        }
      }).then((r) => {
        const obj = r?.data?.userObject;
        const updatedNotificaton =
          (obj?.department || 0) +
          (obj?.users || 0) +
          (obj?.tickets || 0) +
          (obj?.passreq || 0) +
          (obj?.userreq || 0) +
          (obj?.profile || 0);
        dispatch(setNotificationCount(updatedNotificaton));
      })
    } catch (error) {
      console.log('while fetching notificaton', error);
      toast.error('Error!');
    }
  }

  useEffect(() => {
    fetchNotification();
  }, [notificationCount]);

  const location = useLocation();
  const navigate = useNavigate();

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarExpanded(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Set page title based on current route
  useEffect(() => {
    const path = location.pathname.split('/')[2] || 'dashboard';
    setPageTitle(getPageTitle(path));
  }, [location]);

  // Redirect based on user role to appropriate default panel
  useEffect(() => {
    if (location.pathname === '/dashboard') {
      switch (user?.designation) {
        case 'Executive':
          navigate('/dashboard/tickets');
          break;
        case 'Manager':
          navigate('/dashboard/department');
          break;
        case 'Team Leader':
          navigate('/dashboard/executives');
          break;
        case 'admin':
          navigate('/dashboard/departments');
          break;
        case 'superadmin':
          navigate('/dashboard/branches');
          break;
        default:
          navigate('/dashboard/overview');
      }
    }
  }, [user.designation, navigate, location.pathname]);

  const getPageTitle = (path) => {
    switch (path) {
      case 'tickets':
        return 'Tickets';
      case 'department':
        return 'Department Overview';
      case 'executives':
        return 'Manage Executives';
      case 'departments':
        return 'Departments';
      case 'branches':
        return 'Branch Management';
      case 'profile':
        return 'User Profile';
      default:
        return 'Dashboard';
    }
  };

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const closeProfileDropdown = () => {
    setProfileDropdownOpen(false);
  };

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${URI}/auth/logout`, {
        headers: {
          'Content-Type': 'aplication/json'
        }
      }).then(res => {
        dispatch(setUser(null));
        navigate('/');
        toast.success(res?.data?.message);
      }).catch(err => {
        // Handle error and show toast
        if (err.response && err.response.data && err.response.data.message) {
          toast.error(err.response.data.message); // For 400, 401, etc.
        } else {
          toast.error("Something went wrong");
        }
      });
    } catch (error) {
      console.log('While logout', error);
    }

  };

  const resolveNotification = async (text) => {
    try {
      const payload = {
        user: user?._id
      }
      if (text === 'Profile') {
        payload.section = 'profile';
      }
      else if (text === 'My Tickets') {
        payload.section = 'tickets';
      }
      else if (text === 'Tickets') {
        payload.section = 'tickets';
      }
      else if (text === 'All Tickets') {
        payload.section = 'tickets';
      }
      else if (text === 'Department') {
        payload.section = 'department';
      }
      else if (text === 'Departments') {
        payload.section = 'department';
      }
      else if (text === 'Executives') {
        payload.section = 'users';
      }
      else if (text === 'Admins') {
        payload.section = 'users';
      }
      else if (text === 'Team Leaders & Managers') {
        payload.section = 'users';
      }
      else if (text === 'Password Requests') {
        payload.section = 'passreq';
      }
      else if (text === 'User Requests') {
        payload.section = 'userreq';
      }

      const res = await axios.post(`${URI}/notification/resolvenotification`, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        const obj = res?.data?.notificationObject;
        const updatedNotificaton =
          (obj?.department || 0) +
          (obj?.users || 0) +
          (obj?.tickets || 0) +
          (obj?.passreq || 0) +
          (obj?.userreq || 0) +
          (obj?.profile || 0);
        dispatch(setNotificationCount(updatedNotificaton));
      }).catch(err => {
        // Handle error and show toast
        if (err.response && err.response.data && err.response.data.message) {
          toast.error(err.response.data.message); // For 400, 401, etc.
        } else {
          toast.error("Something went wrong");
        }
      });

    } catch (error) {
      console.log('While resolve notification', error);
    }
  }

  // Only show relevant navigation items based on user designation
  const getNavItems = () => {
    const items = [];

    // Common items
    items.push({
      to: '/dashboard/profile',
      icon: <FontAwesomeIcon icon={faUsersCog} />,
      text: 'Profile',
    });

    // Role-specific items
    switch (user?.designation) {
      case 'Executive':
        items.unshift({
          to: '/dashboard/tickets',
          icon: <FontAwesomeIcon icon={faTicketAlt} />,
          text: 'My Tickets',
        });
        break;

      case 'Manager':
        items.unshift(
          {
            to: '/dashboard/department',
            icon: <FontAwesomeIcon icon={faChartBar} />,
            text: 'Department',
          },
          {
            to: '/dashboard/executives',
            icon: <FontAwesomeIcon icon={faUser} />,
            text: 'Executives',
          },
          {
            to: '/dashboard/tickets',
            icon: <FontAwesomeIcon icon={faTicketAlt} />,
            text: 'Tickets',
          },
          {
            to: '/dashboard/password-requests',
            icon: <FontAwesomeIcon icon={faLock} />,
            text: 'Password Requests',
          },
          {
            to: '/dashboard/user-requests',
            icon: <FontAwesomeIcon icon={faPersonCircleQuestion} />,
            text: 'User Requests',
          }
        );
        break;

      case 'Team Leader':
        items.unshift(
          {
            to: '/dashboard/executives',
            icon: <FontAwesomeIcon icon={faUser} />,
            text: 'Executives',
          },
          {
            to: '/dashboard/tickets',
            icon: <FontAwesomeIcon icon={faTicketAlt} />,
            text: 'Tickets',
          },
          {
            to: '/dashboard/password-requests',
            icon: <FontAwesomeIcon icon={faLock} />,
            text: 'Password Requests',
          },
          {
            to: '/dashboard/user-requests',
            icon: <FontAwesomeIcon icon={faPersonCircleQuestion} />,
            text: 'User Requests',
          }
        );
        break;

      case 'admin':
        items.unshift(
          {
            to: '/dashboard/departments',
            icon: <FontAwesomeIcon icon={faBuilding} />,
            text: 'Departments',
          },
          {
            to: '/dashboard/leadership',
            icon: <FontAwesomeIcon icon={faUserCog} />,
            text: 'Team Leaders & Managers',
          },
          {
            to: '/dashboard/tickets',
            icon: <FontAwesomeIcon icon={faTicketAlt} />,
            text: 'All Tickets',
          },
          {
            to: '/dashboard/password-requests',
            icon: <FontAwesomeIcon icon={faLock} />,
            text: 'Password Requests',
          },
          {
            to: '/dashboard/user-requests',
            icon: <FontAwesomeIcon icon={faPersonCircleQuestion} />,
            text: 'User Requests',
          }
        );
        break;

      case 'superadmin':
        items.unshift(
          {
            to: '/dashboard/branches',
            icon: <FontAwesomeIcon icon={faBuilding} />,
            text: 'Branches',
          },
          {
            to: '/dashboard/admins',
            icon: <FontAwesomeIcon icon={faUserCog} />,
            text: 'Admins',
          },
          {
            to: '/dashboard/tickets',
            icon: <FontAwesomeIcon icon={faTicketAlt} />,
            text: 'All Tickets',
          },
          {
            to: '/dashboard/password-requests',
            icon: <FontAwesomeIcon icon={faLock} />,
            text: 'Password Requests',
          },
          {
            to: '/dashboard/overview',
            icon: <FontAwesomeIcon icon={faChartBar} />,
            text: 'System Overview',
          }
        );
        break;

      default:
        break;
    }

    return items;
  };

  const onToggleTheme = () => {
    let updatedTheme = theme === 'light' ? 'dark' : 'light';
    dispatch(setTheme(updatedTheme));

  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarExpanded ? 'expanded' : ''}`}>
        <div className="sidebar-header">
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {sidebarExpanded ? <FontAwesomeIcon icon={faTimes} /> : <FontAwesomeIcon icon={faBars} />}
          </button>
          <div className="sidebar-logo">
            <span className="sidebar-logo-icon">🎫</span>
            <span className="sidebar-logo-text">TMS</span>
          </div>
        </div>

        <div className="sidebar-content">
          <nav className="nav-menu">
            {getNavItems()?.map((item) => (
              <li className="nav-item" key={item?.to} onClick={() => resolveNotification(item?.text)}>
                <NavLink
                  to={item?.to}
                  className={({ isActive }) =>
                    isActive ? 'nav-link active' : 'nav-link'
                  }
                >
                  <span className="nav-icon">{item?.icon}</span>
                  <span className="nav-text">{item?.text}</span>
                </NavLink>
              </li>
            ))}
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="user-info">
            <img className="user-avatar"
              src={user?.profile ? user?.profile : '/img/admin.png'} alt='PF'
            />
            <div className="user-details">
              <div className="user-name">{user?.username}</div>
              <div className="user-designation">{user?.designation?.charAt(0).toUpperCase() + user?.designation?.slice(1)}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`main-content ${sidebarExpanded ? 'sidebar-expanded' : ''}`}>
        <div className="top-nav">
          <div className="top-nav-left">
            <button className="sidebar-toggle"
              // hidden-sm mr-3"
              onClick={toggleSidebar}>
              {sidebarExpanded ? <FontAwesomeIcon icon={faTimes} /> : <FontAwesomeIcon icon={faBars} />}
            </button>
            <h2 className="page-title">{pageTitle}</h2>
          </div>

          <div className="top-nav-right">
            {
              notificationCount > 0 &&
              <button
              className="notification-btn"
              aria-label="Notifications"
            >
              <FontAwesomeIcon icon={faBell} />
              {notificationCount > 0 && (
                <span className="notification-badge">{notificationCount}</span>
              )}
            </button>
            }
            {/* modes day and night  */}
            <button
              className="theme-toggle-btn"
              onClick={onToggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <FontAwesomeIcon icon={faMoon} /> : <FontAwesomeIcon icon={faSun} />}
            </button>
            <div className="profile-dropdown">
              <button
                className="profile-btn"
                onClick={toggleProfileDropdown}
                aria-expanded={profileDropdownOpen}
              >
                <img src={user?.profile ? user?.profile : '/img/admin.png'} alt='profile' className="user-avatar" />
                <span className="hidden-sm">{user?.username}</span>
              </button>
              {profileDropdownOpen && (
                <div className="dropdown-menu">
                  <a href="/dashboard/profile" className="dropdown-item">
                    <FontAwesomeIcon icon={faUser} />
                    Profile
                  </a>

                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item text-error">
                    <i className="fa-regular fa-sign-out"></i>
                    <FontAwesomeIcon icon={faSignOut} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="page-content">
          <Routes>
            {/* Executive Routes */}
            <Route path="/tickets/*" element={
              ['Team Leader', 'Manager', 'admin', 'superadmin', 'Executive'].includes(user?.designation) ?
                (user?.designation === 'Team Leader' ? <TeamLeaderPanel user={user} view="tickets" /> :
                  user?.designation === 'Manager' ? <ManagerPanel user={user} view="tickets" /> :
                    user?.designation === 'admin' ? <AdminPanel user={user} view="tickets" /> :
                      user?.designation === 'Executive' ? <ExecutivePanel user={user} view='tickets' /> :
                        <SuperAdminPanel user={user} view="tickets" />) :
                <NotFound />
            } />
            {/* Manager Routes */}
            <Route path="/department/*" element={<ManagerPanel user={user} />} />
            <Route path="/executives/*" element={
              user?.designation === 'Manager' ? <ManagerPanel user={user} view="team" /> :
                user?.designation === 'Team Leader' ? <TeamLeaderPanel user={user} view="executives" /> :
                  <NotFound />
            } />

            {/* Team Leader Routes */}
            <Route path="/password-requests/*" element={
              ['Team Leader', 'Manager', 'admin', 'superadmin'].includes(user?.designation) ?
                (user?.designation === 'Team Leader' ? <TeamLeaderPanel user={user} view="password-requests" /> :
                  user?.designation === 'Manager' ? <ManagerPanel user={user} view="password-requests" /> :
                    user?.designation === 'admin' ? <AdminPanel user={user} view="password-requests" /> :
                      <SuperAdminPanel user={user} view="password-requests" />) :
                <NotFound />
            } />

            {/* Admin Routes */}
            <Route path="/departments/*" element={
              user?.designation === 'admin' ? <AdminPanel user={user} view="departments" /> : <NotFound />
            } />
            <Route path="/leadership/*" element={
              user?.designation === 'admin' ? <AdminPanel user={user} view="leadership" /> : <NotFound />
            } />
            <Route path="/user-requests/*" element={
              user?.designation === 'admin' ? <AdminPanel user={user} view="user-requests" /> :
                user?.designation === 'Team Leader' ? <TeamLeaderPanel user={user} view="user-requests" /> :
                  user?.designation === 'Manager' ? <ManagerPanel user={user} view="user-requests" /> :
                    <NotFound />
            } />

            {/* Super Admin Routes */}
            <Route path="/branches/*" element={
              user?.designation === 'superadmin' ? <SuperAdminPanel user={user} view="branches" /> : <NotFound />
            } />
            <Route path="/admins/*" element={
              user?.designation === 'superadmin' ? <SuperAdminPanel user={user} view="admins" /> : <NotFound />
            } />
            <Route path="/overview/*" element={
              user?.designation === 'superadmin' ? <SuperAdminPanel user={user} view="overview" /> : <NotFound />
            } />


            {/* Common Routes */}
            <Route path="/profile" element={<UserProfile user={user} />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;

