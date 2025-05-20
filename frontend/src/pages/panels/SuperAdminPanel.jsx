import { useState, useEffect } from 'react';
import { } from '@fortawesome/free-brands-svg-icons'
import { faBuilding, faCommentDots, faUser } from '@fortawesome/free-regular-svg-icons'
import { faChartLine, faLock, faTicketAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { FaBuilding, FaUsers, FaTicketAlt, FaLock, FaChartBar } from 'react-icons/fa';
import mockUsers from '../../data/mockUsers';
import mockTickets from '../../data/mockTickets';
import mockPasswordRequests from '../../data/mockPasswordRequests';
import mockDepartments from '../../data/mockDepartments';
import mockBranches from '../../data/mockBranches';
import BranchForm from '../../components/BranchForm';
import UserForm from '../../components/UserForm';
import axios from 'axios';
import URI from '../../utills';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import SessionEndWarning from '../../components/SessionEndWarning';

function SuperAdminPanel({ user, view = 'overview' }) {

  //states
  const [branches, setBranches] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [passwordRequests, setPasswordRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showBranchForm, setShowBranchForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [comment, setComment] = useState('');
  const [departments, setDepartments] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionWarning, setSessionWarning] = useState(false);

  const navigate = useNavigate();

  // Statistics
  const [stats, setStats] = useState({
    totalBranches: 0,
    totalDepartments: 0,
    totalUsers: 0,
    totalTickets: 0,
    openTickets: 0,
    resolvedTickets: 0,
    pendingPasswordRequests: 0
  });

  useEffect(() => {
    const stats = {
      totalBranches: branches?.length,
      totalDepartments: departments.length,
      totalUsers: allUsers?.length,
      totalTickets: tickets?.length,
      openTickets: tickets.filter(t => t.status === 'open').length,
      resolvedTickets: tickets.filter(t => t.status === 'resolved').length,
      pendingPasswordRequests: passwordRequests?.length
    };
    setStats(stats);
  }, [allUsers, tickets, passwordRequests, departments, branches]);

  //fetching APIs
  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(`${URI}/superadmin/getadmins`, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        setAllUsers(res?.data?.allBranchesData);
      }).catch(err => {
        // Handle error and show toast
        if (err.response && err.response.data && err.response.data.message) {
          toast.error(err.response.data.message); // For 400, 401, etc.
        } else {
          toast.error("Something went wrong");
        }
      });
    } catch (error) {
      console.log("while fetching all Users data", error);
    }
  }
  const [ticketSettings, setTicketSettings] = useState({});

  const fetchTicketSettings = async () => {
    try {
      const branch = user?.branches[0];
      const res = await axios.get(`${URI}/admin/getticketsettings/${branch}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(r => {
        setTicketSettings(r?.data?.ticketSettings);
      }).catch(err => {
        // Handle error and show toast
        if (err.response && err.response.data && err.response.data.message) {
          toast.error(err.response.data.message); // For 400, 401, etc.
        } else {
          toast.error("Something went wrong");
        }
      });
    } catch (error) {
      console.log('while fetching Ticket Settings', error);
    }
  }

  useEffect(() => {
    fetchTicketSettings();
  }, [])

  const fetchAllTickets = async () => {
    try {
      const res = await axios.get(`${URI}/executive/getalltickets`, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }).then(res => {
        setTickets(res?.data?.data);
      }).catch(err => {
        // Handle error and show toast
        if (err.response && err.response.data) {
          if (err.response.data.notAuthorized) {
            setSessionWarning(true);
          } else {
            toast.error(err.response.data.message || "Something went wrong");
          }
        } else {
          toast.error("Something went wrong");
        }
      });

    } catch (error) {
      console.log('while feting tickets', error);
    }
  }

  const fetchBranches = async () => {
    try {
      const res = await axios.get(`${URI}/superadmin/branches`, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        setBranches(res?.data?.branches);
      }).catch(err => {
        // Handle error and show toast
        if (err.response && err.response.data && err.response.data.message) {
          toast.error(err.response.data.message); // For 400, 401, etc.
        } else {
          toast.error("Something went wrong");
        }
      });
    } catch (error) {
      console.log('while geting branches for super admin', error);
    }
  }

  //fetch department
  const fetchDepartment = async () => {
    try {
      const res = await axios.get(`${URI}/admin/department`, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        const matchedExecutives = res?.data?.departmentes;
        setDepartments(matchedExecutives);
      }).catch(err => {
        // Handle error and show toast
        if (err.response && err.response.data && err.response.data.message) {
          toast.error(err.response.data.message); // For 400, 401, etc.
        } else {
          toast.error("Something went wrong");
        }
      });
    } catch (error) {
      console.log('while geting branches for super admin', error);
    }
  }

  useEffect(() => {
    fetchAllTickets();
    fetchAllUsers();
    fetchBranches();
    fetchDepartment();
    // Load all data
    // setBranches(mockBranches);

    // Get admins
    const adminUsers = allUsers?.filter(u => u.designation === 'admin');
    setAdmins(adminUsers);

    // Get all tickets
    // setTickets(mockTickets);

    // Get password requests from admins
    const adminIds = adminUsers.map(admin => admin.id);


  }, []);

  //normall actions
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
    setIsCommentOpen(false);
  };

  const [myDept, setMyDept] = useState({});

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setMyDept(ticket?.department?.find((dept) => dept?.name === user?.department || ticket?.issuedby === user?.username));
    setIsModalOpen(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  const formatTime = (timeString) => {
    const time = new Date(timeString);
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatTat = (tat, createdAt) => {
    const now = Date.now(); // current time in ms
    const [valueStr, unitRaw] = tat?.toLowerCase()?.split(" ");
    const value = parseInt(valueStr);
    const unit = unitRaw.trim();

    let tatInMs = 0;

    if (unit?.startsWith("day")) {
      tatInMs = value * 24 * 60 * 60 * 1000; // days to ms
    } else if (unit?.startsWith("week")) {
      tatInMs = value * 7 * 24 * 60 * 60 * 1000; // weeks to ms
    } else if (unit?.startsWith("hour")) {
      tatInMs = value * 60 * 60 * 1000; // hours to ms
    } else if (unit?.startsWith("minute")) {
      tatInMs = value * 60 * 1000; // minutes to ms
    } else {
      return "Invalid TAT format";
    }

    const elapsed = now - new Date(createdAt).getTime(); // ms since created

    if (elapsed > tatInMs) {
      return "TAT Over";
    } else {
      const remaining = tatInMs - elapsed;
      const mins = Math.floor((remaining / 1000 / 60) % 60);
      const hrs = Math.floor((remaining / (1000 * 60 * 60)) % 24);
      const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
      return `Remaining: ${days > 0 ? `${days}d ` : ''
        }${hrs > 0 ? `${hrs}h ` : ''
        }${mins > 0 ? `${mins}m` : ''
        }`.trim();
    }
  };

  const tatBG = (tat, createdAt) => {
    const now = Date.now(); // current time in ms
    const [valueStr, unitRaw] = tat?.toLowerCase()?.split(" ");
    const value = parseInt(valueStr);
    const unit = unitRaw.trim();

    let tatInMs = 0;

    if (unit?.startsWith("day")) {
      tatInMs = value * 24 * 60 * 60 * 1000; // days to ms
    } else if (unit?.startsWith("week")) {
      tatInMs = value * 7 * 24 * 60 * 60 * 1000; // weeks to ms
    } else if (unit?.startsWith("hour")) {
      tatInMs = value * 60 * 60 * 1000; // hours to ms
    } else if (unit?.startsWith("minute")) {
      tatInMs = value * 60 * 1000; // minutes to ms
    } else {
      return "Invalid TAT format";
    }

    const elapsed = now - new Date(createdAt).getTime();
    const percentElapsed = (elapsed / tatInMs) * 100;

    if (percentElapsed >= 100) return "red";
    if (percentElapsed >= 90) return "orange";
    if (percentElapsed >= 50) return "#aec81d";
    return "green";
  }

  const handleEditBranch = (branchId) => {
    const branchToEdit = branches.find(branch => branch.id === branchId);
    setSelectedBranch(branchToEdit);
    setShowBranchForm(true);
  };

  const confirmDeleteBranch = (branchId) => {
    const branchToDelete = branches.find(branch => branch._id === branchId);
    setItemToDelete(branchToDelete);
    setDeleteType('branch');
    setIsDeleteModalOpen(true);
  };

  const handleEditAdmin = (adminId) => {
    const adminToEdit = allUsers.find(admin => admin._id === adminId);
    setSelectedUser(adminToEdit);
    setShowUserForm(true);
  };

  //filters
  // Filter branches based on search term
  const filteredBranches = branches.filter(branch =>
    branch.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    branch.location?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  // Filter admins based on search term
  const filteredAdmins = allUsers?.filter(admin =>
    admin.username?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    admin.email?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  // Filter tickets based on search term and status
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch =
      ticket?.branch?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      ticket?.subject?.toLowerCase().includes(searchTerm?.toLowerCase())

    const matchesStatus = filterStatus === 'all' || ticket?.status === filterStatus;

    return matchesSearch && matchesStatus;
  });


  //not worked
  const handleDeleteAdmin = () => {
    const updatedAdmins = admins.filter(admin => admin.id !== itemToDelete.id);
    // setAdmins(updatedAdmins);
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
    alert('Admin deleted successfully!');
  };

  const handleUpdateTicketStatus = async (ticketId, status) => {
    try {
      setLoading({
        status: true,
        id: ticketId
      });
      const res = await axios.post(`${URI}/executive/updateticketstatus`, { ticketId, status }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }).then(res => {
        fetchAllTickets();
        toast.success(res?.data?.message);
      }).catch(err => {
        // Handle error and show toast
        if (err.response && err.response.data) {
          if (err.response.data.notAuthorized) {
            setSessionWarning(true);
          } else {
            toast.error(err.response.data.message || "Something went wrong");
          }
        } else {
          toast.error("Something went wrong");
        }
      });
    } catch (error) {
      console.log('error while ticket updation', error);
    }
    finally {
      setLoading({
        status: false,
        id: ticketId
      });
    }
  };


  //action APIs
  //add comment on ticket
  const addCommentOnTicket = async () => {
    try {
      const ticketId = selectedTicket?._id;
      const commenter = `${user?.username}(${user?.department && user?.department ? ' - ' : ''}  ${user?.designation})`;
      if (comment) {
        const res = await axios.post(`${URI}/executive/addcommentonticket`, { ticketId, comment, commenter }, {
          headers: {
            'Content-Type': 'application/json'
          },
        withCredentials: true
        }).then(res => {
          fetchAllTickets();
          handleCloseModal();
          setComment('');
          toast.success(res?.data?.message);
        }).catch(err => {
          // Handle error and show toast
          if (err.response && err.response.data) {
            if (err.response.data.notAuthorized) {
              setSessionWarning(true);
            } else {
              toast.error(err.response.data.message || "Something went wrong");
            }
          } else {
            toast.error("Something went wrong");
          }
        });
      }
      else {
        toast.error('Please fill the Comment Box!');
      }
    } catch (error) {
      console.log('error while adding comment', error);
    }
  }

  const handleDeleteBranch = async () => {
    try {
      const res = await axios.delete(`${URI}/superadmin/deletebranch/${itemToDelete?._id}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }).then(res => {
        fetchBranches();
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
        toast.success(res?.data?.message);
      }).catch(err => {
        // Handle error and show toast
        if (err.response && err.response.data) {
          if (err.response.data.notAuthorized) {
            setSessionWarning(true);
          } else {
            toast.error(err.response.data.message || "Something went wrong");
          }
        } else {
          toast.error("Something went wrong");
        }
      });
    } catch (error) {
      console.log("while delete user", error);
    }
  };

  const confirmDeleteAdmin = async (adminId) => {
    try {
      const res = await axios.delete(`${URI}/superadmin/deleteadmin/${adminId}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }).then(res => {
        fetchAllUsers();
        toast.success(res?.data?.message);
      }).catch(err => {
        // Handle error and show toast
        if (err.response && err.response.data) {
          if (err.response.data.notAuthorized) {
            setSessionWarning(true);
          } else {
            toast.error(err.response.data.message || "Something went wrong");
          }
        } else {
          toast.error("Something went wrong");
        }
      });
    } catch (error) {
      console.log("while delete user", error);
    }
  };

  //components for render
  // Render different content based on the view
  const renderContent = () => {
    switch (view) {
      case 'overview':
        return renderOverviewView();
      case 'branches':
        return renderBranchesView();
      case 'admins':
        return renderAdminsView();
      // case 'password-requests':
      //   return renderPasswordRequestsView();
      case 'tickets':
        return renderTicketsView();
      default:
        return renderOverviewView();
    }
  };

  const renderOverviewView = () => (
    <>
      <div className="mb-4">
        <h2 className="text-xl font-bold">System Overview</h2>
        <p className="text-muted">Complete overview of the ticketing system</p>
      </div>

      <div className="dashboard-grid">

        <div className="stat-card" onClick={() => navigate('/dashboard/branches')}>
          <div className="stat-card-header">
            <h3 className="stat-card-title">Branches</h3>
            <div className="stat-card-icon blue">
              <FontAwesomeIcon icon={faBuilding} />
              {/* <FaBuilding /> */}
            </div>
          </div>
          <div className="stat-card-value">{stats?.totalBranches}</div>
        </div>

        {/* <div className="stat-card" navigate=''>
          <div className="stat-card-header">
            <h3 className="stat-card-title">Departments</h3>
            <div className="stat-card-icon blue">
              <FontAwesomeIcon icon={faBuilding} />
            </div>
          </div>
          <div className="stat-card-value">{stats?.totalDepartments}</div>
        </div> */}

        <div className="stat-card" onClick={() => navigate('/dashboard/admins')}>
          <div className="stat-card-header">
            <h3 className="stat-card-title">Total Users</h3>
            <div className="stat-card-icon blue">
              <FontAwesomeIcon icon={faUser} />
              {/* <FaUsers /> */}
            </div>
          </div>
          <div className="stat-card-value">{stats?.totalUsers}</div>
        </div>

        <div className="stat-card" onClick={() => navigate('/dashboard/tickets')}>
          <div className="stat-card-header">
            <h3 className="stat-card-title">Total Tickets</h3>
            <div className="stat-card-icon orange">
              <FontAwesomeIcon icon={faTicketAlt} />
              {/* <FaTicketAlt /> */}
            </div>
          </div>
          <div className="stat-card-value">{stats?.totalTickets}</div>
        </div>
      </div>

      <div className="grid grid-2 gap-4 mt-4">
        <div className="card" onClick={() => navigate('/dashboard/tickets')}>
          <div className="card-header">
            <h3>Ticket Status</h3>
          </div>
          <div className="card-body">
            <div className="mb-4">
              <h4 className="text-md font-medium mb-2">Open Tickets</h4>
              <div className="h-4 bg-gray-200 rounded-full">
                <div
                  className="h-4 bg-warning rounded-full"
                  style={{ width: `${(stats?.openTickets / stats?.totalTickets) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-sm">{stats?.openTickets} tickets</span>
                <span className="text-sm">{Math.round((stats?.openTickets / stats?.totalTickets) * 100)}%</span>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-md font-medium mb-2">In Progress</h4>
              <div className="h-4 bg-gray-200 rounded-full">
                <div
                  className="h-4 bg-primary rounded-full"
                  style={{ width: `${((stats?.totalTickets - stats?.openTickets - stats?.resolvedTickets) / stats?.totalTickets) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-sm">{stats?.totalTickets - stats?.openTickets - stats?.resolvedTickets} tickets</span>
                <span className="text-sm">{Math.round(((stats?.totalTickets - stats?.openTickets - stats?.resolvedTickets) / stats?.totalTickets) * 100)}%</span>
              </div>
            </div>

            <div>
              <h4 className="text-md font-medium mb-2">Resolved</h4>
              <div className="h-4 bg-gray-200 rounded-full">
                <div
                  className="h-4 bg-success rounded-full"
                  style={{ width: `${(stats?.resolvedTickets / stats?.totalTickets) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-sm">{stats?.resolvedTickets} tickets</span>
                <span className="text-sm">{Math.round((stats?.resolvedTickets / stats?.totalTickets) * 100)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card" onClick={() => navigate('/dashboard/branches')}>
          <div className="card-header">
            <h3>Branch Summary</h3>
          </div>

          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Branch</th>
                    <th>Location</th>
                    <th>Admin</th>
                    {/* <th>Departments</th>
                  <th>Tickets</th> */}
                  </tr>
                </thead>
                <tbody>

                  {branches?.slice(0, 3).map(branch => {
                    const branchAdmin = allUsers?.find(a => a?.username === branch?.admin);
                    const branchDepartments = mockDepartments.filter(d => d.branchId === branch.id);
                    const branchTickets = tickets.filter(t =>
                      branchDepartments.some(d => d.name === t.department)
                    );

                    return (
                      <tr key={branch.id}>
                        <td className="font-medium">{branch.name}</td>
                        <td>{branch.location}</td>
                        <td>
                          {branchAdmin ? (
                            <div className="flex items-center gap-2" style={{ display: 'flex', justifyContent: 'center' }}>
                              <img className="user-avatar" src={branchAdmin?.profile ? branchAdmin?.profile : '/img/admin.png'} alt="" />
                              <span>{branchAdmin.name}</span>
                            </div>
                          ) : <span className="text-muted">Not assigned</span>}
                        </td>
                        {/* <td>{branch?.departments ? branch?.departments : 0}</td>
                      <td>{branch?.tickets ? branch?.tickets : 0}</td> */}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>

      {/* <div className="card mt-4">
        <div className="card-header">
          <h3>Branch Summary</h3>
        </div>
        
      </div> */}
    </>
  );

  const renderBranchesView = () => (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">Branches</h2>
          <p className="text-muted">Manage organization branches</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowBranchForm(true)}
        >
          Add New Branch
        </button>
      </div>

      {showBranchForm ? (
        <div className="card mb-4 animate-slide-up">
          <div className="card-header">
            <h3>{selectedBranch ? 'Edit Branch' : 'Create New Branch'}</h3>
          </div>
          <div className="card-body">
            <BranchForm
              initialData={selectedBranch}
              admins={admins}
              fetchBranches={fetchBranches}
              // onSubmit={selectedBranch ? handleUpdateBranch : handleCreateBranch}
              onCancel={() => {
                setSelectedBranch(null);
                setShowBranchForm(false);
              }}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="card mb-4">
            <div className="card-body">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search branches by name or location"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body p-0">
              {filteredBranches.length > 0 ? (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Location</th>
                        <th>Admin</th>
                        <th>Departments</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBranches.map(branch => {
                        const branchAdmin = allUsers?.find(a => a?.username === branch?.admin);
                        const branchDepartments = departments.filter(d => d?.branch === branch?.name);

                        return (
                          <tr key={branch.id}>
                            <td className="font-medium">{branch?.name}</td>
                            <td>{branch.location}</td>
                            <td>
                              {branchAdmin ? (
                                <div className="flex items-center gap-2">
                                  <img className="user-avatar" src={branchAdmin?.profile ? branchAdmin?.profile : '/img/admin.png'} alt="PF" />
                                  <span>{branchAdmin.name}</span>
                                </div>
                              ) : <span className="text-muted">Not assigned</span>}
                            </td>
                            <td>{branchDepartments?.length}</td>
                            <td>{formatDate(branch?.createdAt)}</td>
                            <td>
                              <div className="flex gap-2">
                                <button
                                  className="btn btn-sm btn-outline"
                                  onClick={() => handleEditBranch(branch.id)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-sm btn-error"
                                  onClick={() => confirmDeleteBranch(branch._id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-muted">No branches found. Add a new branch to get started!</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );

  const renderAdminsView = () => (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">Admins</h2>
          <p className="text-muted">Manage organization admins</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowUserForm(true)}
        >
          Add New Admin
        </button>
      </div>

      {showUserForm ? (
        <div className="card mb-4 animate-slide-up">
          <div className="card-header">
            <h3>{selectedUser ? 'Edit Admin' : 'Create New Admin'}</h3>
          </div>
          <div className="card-body">
            <UserForm
              initialData={selectedUser}
              admins={admins}
              fetchAllUsers={fetchAllUsers}
              designation='admin'
              // onSubmit={selectedUser ? handleUpdateAdmin : handleCreateAdmin}
              onCancel={() => {
                setSelectedUser(null);
                setShowUserForm(false);
              }}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="card mb-4">
            <div className="card-body">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search admins by name or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body p-0">
              {filteredAdmins.length > 0 ? (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        {/* <th>Branch</th> */}
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAdmins?.map(admin => {
                        return (
                          <>
                            {
                              admin?.designation === 'admin' &&
                              <tr key={admin.id}>
                                <td>
                                  <div className="flex items-center gap-2">
                                    <img src={admin?.profile ? admin?.profile : '/img/admin.png'} className="user-avatar" alt="PF" />
                                    <span>{admin?.name}</span>
                                  </div>
                                </td>
                                <td>{admin.email}</td>
                                {/* <td>{admin?.branches}</td> */}
                                {/* <td>{adminBranch ? adminBranch.name : 'Not assigned'}</td> */}
                                <td>{formatDate(admin.createdAt)}</td>
                                <td>
                                  <div className="flex gap-2">
                                    <button
                                      className="btn btn-sm btn-outline"
                                      onClick={() => handleEditAdmin(admin._id)}
                                    >
                                      Edit
                                    </button>
                                    <button
                                      className="btn btn-sm btn-error"
                                      onClick={() => confirmDeleteAdmin(admin._id)}
                                    >
                                      Delete
                                    </button>
                                    {/* <button
                                      className="btn btn-sm btn-error"
                                    >
                                      View
                                    </button> */}
                                  </div>
                                </td>
                              </tr>
                            }
                          </>

                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-muted">No admins found. Add a new admin to get started!</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );

  const renderTicketsView = () => (
    <>
      <div className="mb-4">
        <h2 className="text-xl font-bold">All System Tickets</h2>
        <p className="text-muted">View and manage tickets across all branches</p>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="grid grid-2 gap-3">
            <div className="form-group">
              <label htmlFor="status-filter" className="form-label">Filter by Status</label>
              <select
                id="status-filter"
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="search" className="form-label">Search Tickets</label>
              <input
                type="text"
                id="search"
                className="form-control"
                placeholder="Search by title, description or department"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body p-0">
          {filteredTickets?.length > 0 ? (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    {/* <th>ID</th> */}
                    <th>Title</th>
                    {/* <th>Department</th> */}
                    <th>Branch</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>T.A.T.</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets?.map((ticket, index) => {
                    return (
                      ticket?.status === 'in-progress' &&
                      <tr key={index + 1}>
                        {/* <td>#{index + 1}</td> */}
                        <td>{ticket?.subject}</td>
                        {/* <td>{ticket?.department}</td> */}
                        <td>{ticket?.branch}</td>
                        <td>
                          <span className={`badge ${ticket?.status === 'open' ? 'badge-warning' :
                            ticket?.status === 'in-progress' ? 'badge-primary' :
                              'badge-success'
                            }`}>
                            {ticket?.status === 'in-progress' ? 'In Progress' :
                              ticket?.status?.charAt(0).toUpperCase() + ticket?.status?.slice(1)}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${ticket?.priority ===
                            'high' ? 'badge-error' :
                            ticket?.priority === 'medium' ? 'badge-warning' :
                              'badge-primary'
                            }`}
                            style={{ background: ticketSettings?.priorities?.find(p => p?.name === ticket?.priority)?.color }}
                          >
                            {ticket?.priority?.charAt(0).toUpperCase() + ticket?.priority?.slice(1)}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${ticket?.status === 'open' ? 'badge-warning' :
                            ticket?.status === 'in-progress' ? 'badge-primary' :
                              'badge-success'
                            }`} style={{ background: ticket?.tat && tatBG(ticket?.tat, ticket?.createdAt) }}>
                            {ticket?.tat}
                          </span>
                        </td>
                        <td>
                          <div className="flex gap-2" style={{ justifyContent: 'center' }}>
                            {
                              loading?.id === ticket?._id && loading?.status ? <button className={`btn btn-${ticket?.status === 'open' ? 'primary' : 'success'}`}>
                                <img src="/img/loader.png" className='Loader' alt="loader" />
                              </button>
                                :
                                <>
                                  {ticket?.status !== 'resolved' && (
                                    <>
                                      {ticket?.status === 'open' && (
                                        <button
                                          className="btn btn-sm btn-primary"
                                          onClick={() => handleUpdateTicketStatus(ticket?._id, 'in-progress')}
                                        >
                                          Start
                                        </button>
                                      )}
                                      {ticket?.status === 'in-progress' && (
                                        <button
                                          className="btn btn-sm btn-success"
                                          onClick={() => handleUpdateTicketStatus(ticket?._id, 'resolved')}
                                        >
                                          Resolve
                                        </button>
                                      )}
                                    </>
                                  )}
                                </>
                            }
                            <button className="btn btn-sm btn-outline" onClick={() => handleViewTicket(ticket)} >View</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredTickets?.map((ticket, index) => {
                    return (
                      ticket?.status === 'open' &&
                      <tr key={index + 1}>
                        {/* <td>#{index + 1}</td> */}
                        <td>{ticket?.subject}</td>
                        {/* <td>{ticket?.department}</td> */}
                        <td>{ticket?.branch}</td>
                        <td>
                          <span className={`badge ${ticket?.status === 'open' ? 'badge-warning' :
                            ticket?.status === 'in-progress' ? 'badge-primary' :
                              'badge-success'
                            }`}>
                            {ticket?.status === 'in-progress' ? 'In Progress' :
                              ticket?.status?.charAt(0).toUpperCase() + ticket?.status?.slice(1)}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${ticket?.priority ===
                            'high' ? 'badge-error' :
                            ticket?.priority === 'medium' ? 'badge-warning' :
                              'badge-primary'
                            }`}>
                            {ticket?.priority?.charAt(0).toUpperCase() + ticket?.priority?.slice(1)}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${ticket?.status === 'open' ? 'badge-warning' :
                            ticket?.status === 'in-progress' ? 'badge-primary' :
                              'badge-success'
                            }`} style={{ background: ticket?.tat && tatBG(ticket?.tat, ticket?.createdAt) }}>
                            {ticket?.tat}
                          </span>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            {
                              loading?.id === ticket?._id && loading?.status ? <button className={`btn btn-${ticket?.status === 'open' ? 'primary' : 'success'}`}>
                                <img src="/img/loader.png" className='Loader' alt="loader" />
                              </button>
                                :
                                <>
                                  {ticket?.status !== 'resolved' && (
                                    <>
                                      {ticket?.status === 'open' && (
                                        <button
                                          className="btn btn-sm btn-primary"
                                          onClick={() => handleUpdateTicketStatus(ticket?._id, 'in-progress')}
                                        >
                                          Start
                                        </button>
                                      )}
                                      {ticket?.status === 'in-progress' && (
                                        <button
                                          className="btn btn-sm btn-success"
                                          onClick={() => handleUpdateTicketStatus(ticket?._id, 'resolved')}
                                        >
                                          Resolve
                                        </button>
                                      )}
                                    </>
                                  )}
                                </>
                            }
                            <button className="btn btn-sm btn-outline" onClick={() => handleViewTicket(ticket)} >View</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredTickets?.map((ticket, index) => {
                    return (
                      ticket?.status === 'resolved' &&
                      <tr key={index + 1}>
                        {/* <td>#{index + 1}</td> */}
                        <td>{ticket?.subject}</td>
                        {/* <td>{ticket?.department}</td> */}
                        <td>{ticket?.branch}</td>
                        <td>
                          <span className={`badge ${ticket?.status === 'open' ? 'badge-warning' :
                            ticket?.status === 'in-progress' ? 'badge-primary' :
                              'badge-success'
                            }`}>
                            {ticket?.status === 'in-progress' ? 'In Progress' :
                              ticket?.status?.charAt(0).toUpperCase() + ticket?.status?.slice(1)}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${ticket?.priority ===
                            'high' ? 'badge-error' :
                            ticket?.priority === 'medium' ? 'badge-warning' :
                              'badge-primary'
                            }`}>
                            {ticket?.priority?.charAt(0).toUpperCase() + ticket?.priority?.slice(1)}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${ticket?.status === 'open' ? 'badge-warning' :
                            ticket?.status === 'in-progress' ? 'badge-primary' :
                              'badge-success'
                            }`} style={{ background: ticket?.tat && tatBG(ticket?.tat, ticket?.createdAt) }}>
                            {ticket?.tat}
                          </span>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            {ticket?.status !== 'resolved' && (
                              <>
                                {ticket?.status === 'open' && (
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => handleUpdateTicketStatus(ticket?._id, 'in-progress')}
                                  >
                                    Start
                                  </button>
                                )}
                                {ticket?.status === 'in-progress' && (
                                  <button
                                    className="btn btn-sm btn-success"
                                    onClick={() => handleUpdateTicketStatus(ticket?._id, 'resolved')}
                                  >
                                    Resolve
                                  </button>
                                )}
                              </>
                            )}
                            <button className="btn btn-sm btn-outline" onClick={() => handleViewTicket(ticket)} >View</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 text-center">
              <p className="text-muted">No tickets found with the current filters.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="animate-fade">
      {sessionWarning && <SessionEndWarning setSessionWarning={setSessionWarning} />}

      {renderContent()}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && itemToDelete && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title">Confirm Delete</h3>
                  <button
                    className="modal-close"
                    onClick={() => setIsDeleteModalOpen(false)}
                  >
                    ×
                  </button>
                </div>
                <div className="modal-body">
                  <p>
                    Are you sure you want to delete {
                      deleteType === 'branch' ? itemToDelete.name : itemToDelete.name
                    }?
                  </p>
                  <p className="text-error mt-2">This action cannot be undone.</p>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-outline"
                    onClick={() => setIsDeleteModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-error"
                    onClick={deleteType === 'branch' ? handleDeleteBranch : handleDeleteAdmin}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Detail Modal */}
      {isModalOpen && selectedTicket && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <div className="modal">
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="modal-content">

                {/* Header */}
                <div className="modal-header">
                  <h3 className="modal-title">Ticket #{selectedTicket?._id}</h3>
                  <button className="modal-close" onClick={handleCloseModal}>×</button>
                </div>

                <div className="modal-body space-y-6">

                  {/* Section 1: Ticket Info */}
                  <section className="space-y-2 border-b pb-4">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <span style={{ float: 'left', display: 'flex', gap: '5px' }}>issuedby: <span style={{ fontWeight: 'bold' }} >{selectedTicket?.issuedby === user?.username ? 'You' : selectedTicket?.issuedby}</span > </span>
                      <h4 style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }} className="text-lg font-bold">{selectedTicket?.category} -  <h5> {selectedTicket?.subject}</h5> </h4>
                    </div>
                    <div className="flex gap-3 flex-wrap" style={{ justifyContent: 'space-between' }}>
                      <div className="flex gap-3 flex-wrap">
                        <span className={`badge ${selectedTicket?.status === 'open' ? 'badge-warning' :
                          selectedTicket?.status === 'in-progress' ? 'badge-primary' : 'badge-success'}`}>
                          {selectedTicket?.status === 'in-progress' ? 'In Progress' :
                            selectedTicket?.status?.charAt(0).toUpperCase() + selectedTicket?.status?.slice(1)}
                        </span>
                        <span className={`badge ${selectedTicket?.priority === 'high' ? 'badge-error' :
                          selectedTicket?.priority === 'medium' ? 'badge-warning' : 'badge-primary'}`}>
                          {selectedTicket?.priority?.charAt(0).toUpperCase() + selectedTicket?.priority?.slice(1)}
                        </span>
                        <span className={`badge ${selectedTicket?.priority === 'high' ? 'badge-error' :
                          selectedTicket?.priority === 'medium' ? 'badge-warning' : 'badge-primary'}`} style={{ background: selectedTicket?.tat && tatBG(selectedTicket?.tat, selectedTicket?.createdAt) }}>
                          {selectedTicket?.tat && formatTat(selectedTicket?.tat, selectedTicket?.createdAt)}
                        </span>
                      </div>
                      <span className="text-sm text-muted">
                        {formatDate(selectedTicket?.createdAt)} , {formatTime(selectedTicket?.createdAt)}
                      </span>
                    </div>
                  </section> <br />
                  <hr />
                  {/* Section 2: User Info */}
                  <section className="space-y-2 border-b pb-4">
                    <h5 className="font-semibold">User Information</h5>
                    <div className="flex gap-4 flex-wrap text-sm" style={{ justifyContent: 'center' }}>
                      <span><strong>Name:</strong> {selectedTicket?.name}</span>
                      <span><strong>Mobile:</strong> {selectedTicket?.mobile}</span>
                      {/* <span><strong>Email:</strong> {selectedTicket?.email}</span> */}
                    </div>
                  </section><br />
                  <hr />

                  {/* Section 3: Department Info */}
                  <section className="space-y-4 border-b pb-4">
                    <h5 className="font-semibold">Departments</h5>
                    {selectedTicket?.department?.map((curElem, index) => (
                      // (selectedTicket?.issuedby === user?.username || curElem?.name === user?.department) &&
                      <>
                        <div key={index} style={{ display: 'flex', gap: '5px' }}>
                          <span className="font-bold">{curElem?.name}{curElem?.description && ':'}</span>
                          {
                            curElem?.users && curElem?.users?.length > 0 ? <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
                              {curElem?.users?.map(curElem => (
                                <span>{curElem}</span>
                              ))}
                            </div> :
                              <span>No Specific Member Involved.</span>
                          }
                        </div>
                        <p className="text-sm" style={{ wordBreak: 'break-word' }} >{curElem?.description}</p>
                      </>
                    ))}
                  </section>
                  <hr />
                  {/* Section 4: Comments */}
                  {
                    selectedTicket?.comments?.length > 0 &&
                    <button
                      className="notification-btn"
                      aria-label="Notifications"
                      style={{ float: 'right' }} onClick={() => setIsCommentOpen(!isCommentOpen)}
                    >
                      <FontAwesomeIcon icon={faCommentDots} />
                      {selectedTicket?.comments?.length > 0 && (
                        <span className="notification-badge">{selectedTicket?.comments?.length}</span>
                      )}
                    </button>
                  }

                  {
                    isCommentOpen &&
                    <>
                      <section className="space-y-3 border-b pb-4">
                        <h5 className="font-semibold">Comments ({selectedTicket?.comments?.length})</h5>
                        {selectedTicket?.comments?.length > 0 ? (
                          <div className="space-y-2">
                            {selectedTicket?.comments?.map((comment) => (
                              <div key={comment?.id} className="p-2 bg-gray-100 rounded">
                                <p className="text-sm" style={{ wordBreak: 'break-word' }} >{comment?.content}</p>
                                <p className="text-xs text-muted">{comment?.commenter} - {formatDate(comment?.createdAt)}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted">No comments yet.</p>
                        )}
                      </section> <hr />
                    </>
                  }

                  {/* Section 5: Reassign Ticket */}
                  {/* <section className="space-y-2">
                    <h5 className="font-semibold">ReAssign Ticket</h5>
                    <div className="flex gap-2 flex-wrap items-center">
                      <select className="form-select" onChange={(e) => setReAssignto(e.target.value)} defaultValue="">
                        <option value="" disabled>ReAssign the Ticket</option>
                        {department?.map((curElem, index) => (
                          user?.department !== curElem?.name && (
                            <option key={index} value={curElem?.name}>{curElem?.name}</option>
                          )
                        ))}
                      </select>
                      <button className="btn btn-primary" onClick={reAssignTicket}>ReAssign</button>
                    </div>
                  </section> */}

                  {/* Section 6: Add Comment */}

                  <section className="space-y-2">
                    <label htmlFor="comment" className="form-label font-semibold">Add Comment</label>
                    <textarea
                      id="comment"
                      className="form-control"
                      rows="3"
                      placeholder="Add your comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                  </section>

                </div>

                {/* Footer */}
                <div className="modal-footer">
                  <button className="btn btn-outline" onClick={handleCloseModal}>Close</button>
                  <button className="btn btn-primary" onClick={addCommentOnTicket}>Add Comment</button>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperAdminPanel;