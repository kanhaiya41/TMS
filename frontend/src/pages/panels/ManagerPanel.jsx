import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import mockUsers from '../../data/mockUsers';
import mockTickets from '../../data/mockTickets';
import mockPasswordRequests from '../../data/mockPasswordRequests';
import mockDepartments from '../../data/mockDepartments';
import mockBranches from '../../data/mockBranches';
import { } from '@fortawesome/free-brands-svg-icons'
import { faBell, faBuilding, faChartBar, faEdit, faEye, faMoon, faUser } from '@fortawesome/free-regular-svg-icons'
import { faBars, faChartLine, faGear, faLock, faSignOut, faTicketAlt, faTimes, faTrash, faUserCog, faUsers, faUsersCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserForm from '../../components/UserForm';
import TicketForm from '../../components/TicketForm';
import axios from 'axios';
import URI from '../../utills';
import toast from 'react-hot-toast';

function ManagerPanel({ user, view = 'branch' }) {
  const [branch, setBranch] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [executives, setExecutives] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [passwordRequests, setPasswordRequests] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserForm, setShowUserForm] = useState(false);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userRequest, setUserRequest] = useState();


  const location = useLocation();

  //fetching APIs
  //fetch team leaders
  const fetchAllTeamLeaders = async () => {
    try {
      const res = await axios.get(`${URI}/admin/teamleaders`, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        setTeamLeaders(res?.data?.allBranchesData?.filter((tl) => tl?.branch === user?.branch));
      }).catch(err => {
        // Handle error and show toast
        if (err?.response && err?.response?.data && err?.response?.data?.message) {
          toast.error(err?.response?.data?.message); // For 400, 401, etc.
        } else {
          toast.error("Something went wrong");
        }
      });

    } catch (error) {
      console.log("while fetching all Users data", error);
    }
  }

  //fetch users
  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(`${URI}/admin/executives`, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        setExecutives(res?.data?.allBranchesData?.filter((tl) => tl?.branch === user?.branch));
      }).catch(err => {
        // Handle error and show toast
        if (err?.response && err?.response?.data && err?.response?.data?.message) {
          toast.error(err?.response?.data?.message); // For 400, 401, etc.
        } else {
          toast.error("Something went wrong");
        }
      });

    } catch (error) {
      console.log("while fetching all Users data", error);
    }
  }

  const fetchAllTickets = async () => {
    try {
      const res = await axios.get(`${URI}/executive/getalltickets`, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        setTickets(res?.data?.data?.filter((tickt) => tickt?.branch === user?.branch));
      }).catch(err => {
        // Handle error and show toast
        if (err?.response && err?.response?.data && err?.response?.data?.message) {
          toast.error(err?.response?.data?.message); // For 400, 401, etc.
        } else {
          toast.error("Something went wrong");
        }
      });
    } catch (error) {
      console.log('while feting tickets', error);
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
        setDepartments(res?.data?.departmentes?.filter((dept) => dept?.branch === user?.branch));
      }).catch(err => {
        // Handle error and show toast
        if (err?.response && err?.response?.data && err?.response?.data?.message) {
          toast.error(err?.response?.data?.message); // For 400, 401, etc.
        } else {
          toast.error("Something went wrong");
        }
      });
    } catch (error) {
      console.log('while geting branches for super admin', error);
    }
  }

  // fetch password requests
  const getAllRequests = async () => {
    try {
      const res = await axios.get(`${URI}/superadmin/getalladminrequests`, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        setPasswordRequests(res?.data?.allRequests?.filter((req) => req?.branch === user?.branch));
      }).catch(err => {
        // Handle error and show toast
        if (err?.response && err?.response?.data && err?.response?.data.message) {
          toast.error(err?.response?.data.message); // For 400, 401, etc.
        } else {
          toast.error("Something went wrong");
        }
      });
    } catch (error) {
      console.log("while geting all admin requests", error);
    }
  }

  const fetchEditProfileRequest = async () => {
    try {
      const res = await axios.get(`${URI}/auth/getupdateprofilerequests`, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(r => {
        setUserRequest(r?.data?.requests?.filter((req) => user?.branch === req.branch && (req?.designation === 'Team Leader' || req?.designation === 'Executive')));
      }).catch(err => {
        // Handle error and show toast
        if (err.response && err.response.data && err.response.data.message) {
          toast.error(err.response.data.message); // For 400, 401, etc.
        } else {
          toast.error("Something went wrong");
        }
      });
    } catch (error) {
      console.log('while fetching edit profile request', error);
    }
  }

  useEffect(() => {
    fetchAllTeamLeaders();
    fetchAllUsers();
    fetchAllTickets();
    fetchDepartment();
    getAllRequests();
    fetchEditProfileRequest();
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Statistics for branch overview
  const getBranchStats = () => {
    return {
      totalDepartments: departments?.length,
      totalTeamLeaders: teamLeaders?.length,
      totalExecutives: executives?.length,
      totalTickets: tickets?.length,
      openTickets: tickets.filter(t => t.status === 'open')?.length,
      resolvedTickets: tickets.filter(t => t.status === 'resolved')?.length,
      // pendingRequests: passwordRequests.filter(r => r.status === 'pending')?.length
      pendingRequests: passwordRequests?.length
    };
  };

  const handleDeleteUser = () => {
    if (userRole === 'teamleader') {
      setTeamLeaders(teamLeaders.filter(tl => tl.id !== userToDelete.id));
    } else {
      setExecutives(executives.filter(exec => exec.id !== userToDelete.id));
    }

    setIsDeleteModalOpen(false);
    setUserToDelete(null);
    setUserRole('');
    alert('User deleted successfully!');
  };

  // delete password update request
  const deleteUpdateRequest = async (id) => {
    try {
      const res = await axios.delete(`${URI}/admin/deleteupdaterequest/${id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        getAllRequests();
        toast.success(res?.data?.message);
      }).catch(err => {
        // Handle error and show toast
        if (err?.response && err?.response?.data && err?.response?.data.message) {
          toast.error(err?.response?.data.message); // For 400, 401, etc.
        } else {
          toast.error("Something went wrong");
        }
      });
    } catch (error) {
      console.log("while delete update request");
    }
  }

  const handleCancelForm = () => {
    setSelectedUser(null);
    setShowUserForm(false);
  };

  const handleCreateTicket = (ticketData) => {
    const newTicket = {
      id: tickets.length + 1,
      title: ticketData.title,
      description: ticketData.description,
      status: 'open',
      priority: ticketData.priority,
      department: ticketData.department,
      createdBy: user.id,
      assignedTo: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: []
    };

    setTickets([newTicket, ...tickets]);
    setShowTicketForm(false);
    alert('Ticket created successfully!');
  };

  //update ticket status
  const handleUpdateTicketStatus = async (ticketId, status) => {
    try {
      const res = await axios.post(`${URI}/executive/updateticketstatus`, { ticketId, status }, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        fetchAllTickets();
        toast.success(res?.data?.message);
      }).catch(err => {
        // Handle error and show toast
        if (err?.response && err?.response?.data && err?.response?.data.message) {
          toast.error(err?.response?.data.message); // For 400, 401, etc.
        } else {
          toast.error("Something went wrong");
        }
      });

    } catch (error) {
      console.log('error while ticket updation', error);
    }
  }

  const handleApprovePasswordRequest = (requestId) => {
    const updatedRequests = passwordRequests.map(req =>
      req.id === requestId ?
        {
          ...req,
          status: 'approved',
          resolvedBy: user.id,
          resolvedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } : req
    );

    setPasswordRequests(updatedRequests);
    alert('Password request approved!');
  };

  const handleRejectPasswordRequest = (requestId) => {
    const updatedRequests = passwordRequests.map(req =>
      req.id === requestId ?
        {
          ...req,
          status: 'rejected',
          resolvedBy: user.id,
          resolvedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } : req
    );

    setPasswordRequests(updatedRequests);
    alert('Password request rejected!');
  };

  // Filter users based on search term
  const filteredTeamLeaders = teamLeaders?.filter(tl =>
    tl?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    tl?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    tl?.department?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    tl?.createdAt?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  const filteredExecutives = executives?.filter(exec =>
    exec?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    exec?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    exec?.department?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    exec?.createdAt?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  // Filter tickets based on status and search term
  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesSearch = ticket.subject?.toLowerCase().includes(searchTerm?.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Filter password requests
  const filteredPasswordRequests = passwordRequests.filter(req => {
    // const user = mockUsers.find(u => u.id === req.userId);
    return (
      req?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      req?.email?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      req?.department?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      req?.reason?.toLowerCase()?.includes(searchTerm?.toLowerCase())
    );
  });

  const statusUpdateforUserRequest = async (requestId, status, email) => {
    try {
      const res = await axios.post(`${URI}/auth/statusupdateforuserrequest`, { requestId, status }, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(async r => {

        const notificationRes = await axios.post(`${URI}/notification/pushnotification`, { user: email, section: 'profile' },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        fetchEditProfileRequest();
        toast.success(r?.data?.message);
      }).catch(err => {
        // Handle error and show toast
        if (err.response && err.response.data && err.response.data.message) {
          toast.error(err.response.data.message); // For 400, 401, etc.
        } else {
          toast.error("Something went wrong");
        }
      });
    } catch (error) {
      console.log('while status update for user request');
    }
  }

  const renderContent = () => {
    switch (view) {
      case 'branch':
        return renderBranchOverview();
      case 'team':
        return renderTeamView();
      case 'tickets':
        return renderTicketsView();
      case 'password-requests':
        return renderPasswordRequestsView();
      case 'user-requests':
        return renderUserRequestsView();
      default:
        return renderBranchOverview();
    }
  };

  const renderBranchOverview = () => {
    const stats = getBranchStats();

    return (
      <>
        <div className="mb-4">
          <h2 className="text-xl font-bold">Branch Manager Dashboard</h2>
        </div>
        <div className="dashboard-grid">
          <div className="stat-card">
            <div className="stat-card-header">
              <h3 className="stat-card-title">Departments</h3>
              <div className="stat-card-icon blue">
                <FontAwesomeIcon icon={faUser} />
              </div>
            </div>
            <div className="stat-card-value">{stats?.totalDepartments}</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <h3 className="stat-card-title">Team Size</h3>
              <div className="stat-card-icon green">
                <FontAwesomeIcon icon={faUser} />
              </div>
            </div>
            <div className="stat-card-value">
              {stats?.totalTeamLeaders + stats?.totalExecutives}
            </div>
            <div className="stat-card-change">
              {stats.totalTeamLeaders} Leaders, {stats.totalExecutives} Executives
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <h3 className="stat-card-title">Tickets</h3>
              <div className="stat-card-icon orange">
                <FontAwesomeIcon icon={faTicketAlt} />
              </div>
            </div>
            <div className="stat-card-value">{stats?.totalTickets}</div>
            <div className="stat-card-change">
              {stats?.openTickets} open, {stats?.resolvedTickets} resolved
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <h3 className="stat-card-title">Pending Requests</h3>
              <div className="stat-card-icon red">
                <FontAwesomeIcon icon={faLock} />
              </div>
            </div>
            <div className="stat-card-value">{stats.pendingRequests}</div>
          </div>
        </div>

        <div className="grid grid-2 gap-4 mt-4">
          <div className="card">
            <div className="card-header">
              <h3>Recent Tickets</h3>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Title</th>
                      {/* <th>Department</th> */}
                      <th>Status</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets?.slice(0, 5)?.map(ticket => (
                      <tr key={ticket?.id}>
                        <td>{ticket?.subject}</td>
                        {/* <td>{ticket?.department}</td> */}
                        <td>
                          <span className={`badge ${ticket?.status === 'open' ? 'badge-warning' :
                            ticket?.status === 'in-progress' ? 'badge-primary' :
                              'badge-success'
                            }`}>
                            {ticket?.status === 'in-progress' ? 'In Progress' :
                              ticket?.status?.charAt(0).toUpperCase() + ticket?.status?.slice(1)}
                          </span>
                        </td>
                        <td>{formatDate(ticket?.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Department Overview</h3>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>Team Leaders</th>
                      <th>Executives</th>
                      <th>Open Tickets</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments?.map(dept => {
                      const deptTeamLeaders = teamLeaders?.filter(tl => tl?.department === dept?.name);
                      const deptExecutives = executives?.filter(exec => exec?.department === dept?.name);
                      const deptOpenTickets = tickets?.filter(t =>
                        t.department === dept?.name && t?.status === 'open'
                      );

                      return (
                        <tr key={dept.id}>
                          <td>{dept.name}</td>
                          <td>{deptTeamLeaders.length}</td>
                          <td>{deptExecutives.length}</td>
                          <td>{deptOpenTickets.length}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderTeamView = () => (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">Branch Team</h2>
          <p className="text-muted">Manage team leaders and executives</p>
        </div>
        <div className="flex gap-2">
          <button
            className="btn btn-primary"
            onClick={() => {
              setUserRole('Team Leader');
              setShowUserForm(true);
            }}
          >
            Add Team Leader
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setUserRole('Executive');
              setShowUserForm(true);
            }}
          >
            Add Executive
          </button>
        </div>
      </div>

      {showUserForm ? (
        <div className="card mb-4 animate-slide-up">
          <div className="card-header">
            <h3>
              {selectedUser
                ? `Edit ${userRole === 'Team Leader' ? 'Team Leader' : 'Executive'}`
                : `Create New ${userRole === 'Team Leader' ? 'Team Leader' : 'Executive'}`}
            </h3>
          </div>
          <div className="card-body">
            <UserForm
              initialData={selectedUser}
              fetchAllUsers={userRole === 'Executive' ? fetchAllUsers : fetchAllTeamLeaders}
              designation={userRole}
              onCancel={() => {
                setSelectedUser(null);
                setUserRole('');
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
                  placeholder="Search by name, email or department"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-header">
              <h3>Team Leaders</h3>
            </div>
            <div className="card-body p-0">
              {filteredTeamLeaders?.length > 0 ? (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTeamLeaders.map(tl => (
                        <tr key={tl?.id}>
                          <td>
                            <div className="flex items-center gap-2">
                              <img className="user-avatar" src={tl?.profile ? tl?.profile : '/img/admin.png'} alt="PF" />
                              <span>{tl?.name}</span>
                            </div>
                          </td>
                          <td>{tl?.email}</td>
                          <td>{tl?.department ? tl?.department : 'Not Assigned'}</td>
                          <td>{formatDate(tl?.createdAt)}</td>
                          <td>
                            <div className="flex gap-2">
                              <button
                                className="btn btn-sm btn-outline"
                                onClick={() => {
                                  setSelectedUser(tl);
                                  setUserRole('Team Leader');
                                  setShowUserForm(true);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-sm btn-error"
                                onClick={() => {
                                  setUserToDelete(tl);
                                  setUserRole('Team Leader');
                                  setIsDeleteModalOpen(true);
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-muted">No team leaders found.</p>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Executives</h3>
            </div>
            <div className="card-body p-0">
              {filteredExecutives.length > 0 ? (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredExecutives.map(exec => (
                        <tr key={exec.id}>
                          <td>
                            <div className="flex items-center gap-2">
                              <img className="user-avatar" src={exec?.profile ? exec?.profile : '/img/admin.png'} alt="PF" />
                              <span>{exec.name}</span>
                            </div>
                          </td>
                          <td>{exec.email}</td>
                          <td>{exec?.department ? exec?.department : 'Not Assigned'}</td>
                          <td>{formatDate(exec.createdAt)}</td>
                          <td>
                            <div className="flex gap-2">
                              <button
                                className="btn btn-sm btn-outline"
                                onClick={() => {
                                  setSelectedUser(exec);
                                  setUserRole('Executive');
                                  setShowUserForm(true);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-sm btn-error"
                                onClick={() => {
                                  setUserToDelete(exec);
                                  setUserRole('Executive');
                                  setIsDeleteModalOpen(true);
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-muted">No executives found.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && userToDelete && (
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
                  <p>Are you sure you want to delete {userToDelete.name}?</p>
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
                    onClick={handleDeleteUser}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

  const renderTicketsView = () => (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">Branch Tickets</h2>
          <p className="text-muted">Manage tickets across all departments</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowTicketForm(true)}
        >
          Create Ticket
        </button>
      </div>

      {showTicketForm ? (
        <div className="card mb-4 animate-slide-up">
          <div className="card-header">
            <h3>Create New Ticket</h3>
          </div>
          <div className="card-body">
            <TicketForm
              onSubmit={handleCreateTicket}
              onCancel={() => setShowTicketForm(false)}
              fetchAllTickets={fetchAllTickets}
            />
          </div>
        </div>
      ) : (
        <>
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
                        <th>ID</th>
                        <th>Title</th>
                        {/* <th>Department</th> */}
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTickets?.map((ticket, index) => {
                        const creator = mockUsers.find(u => u.id === ticket.createdBy);
                        return (
                          <tr key={index + 1}>
                            <td>#{index + 1}</td>
                            <td>{ticket.subject}</td>
                            {/* <td>{ticket?.department}</td> */}
                            <td>
                              <span className={`badge ${ticket.status === 'open' ? 'badge-warning' :
                                ticket.status === 'in-progress' ? 'badge-primary' :
                                  'badge-success'
                                }`}>
                                {ticket.status === 'in-progress' ? 'In Progress' :
                                  ticket.status?.charAt(0).toUpperCase() + ticket.status?.slice(1)}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${ticket.priority === 'high' ? 'badge-error' :
                                ticket.priority === 'medium' ? 'badge-warning' :
                                  'badge-primary'
                                }`}>
                                {ticket.priority?.charAt(0).toUpperCase() + ticket.priority?.slice(1)}
                              </span>
                            </td>
                            <td>{formatDate(ticket.createdAt)}</td>
                            <td>
                              <div className="flex gap-2">
                                {ticket.status !== 'resolved' && (
                                  <>
                                    {ticket.status === 'open' && (
                                      <button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => handleUpdateTicketStatus(ticket._id, 'in-progress')}
                                      >
                                        Start
                                      </button>
                                    )}
                                    {ticket.status === 'in-progress' && (
                                      <button
                                        className="btn btn-sm btn-success"
                                        onClick={() => handleUpdateTicketStatus(ticket._id, 'resolved')}
                                      >
                                        Resolve
                                      </button>
                                    )}
                                  </>
                                )}
                                <button className="btn btn-sm btn-outline">View</button>
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
      )}
    </>
  );

  const renderPasswordRequestsView = () => (
    <>
      <div className="mb-4">
        <h2 className="text-xl font-bold">Password Update Requests</h2>
        <p className="text-muted">Manage password change requests from team leaders and executives</p>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search password requests"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card">
        {showUserForm ? (
          <div className="card mb-4 animate-slide-up">
            <div className="card-header">
              <h3>{selectedUser ? 'Edit Executive' : 'Create New Executive'}</h3>
            </div>
            <div className="card-body">
              <UserForm
                initialData={selectedUser}
                fetchAllUsers={fetchAllUsers}
                // onSubmit={selectedUser ? handleUpdateUser : handleCreateUser} 
                onCancel={handleCancelForm}
                designation='Executive'
                passReq={true}
                deleteUpdateRequest={deleteUpdateRequest}
              />
            </div>
          </div>
        ) : (
          <div className="card-body p-0">
            {filteredPasswordRequests?.length > 0 ? (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User</th>
                      <th>Role</th>
                      <th>Department</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPasswordRequests?.map((request, index) => {
                      // const requestUser = mockUsers.find(u => u.id === request.userId);
                      return (
                        <tr key={index + 1}>
                          <td>#{index + 1}</td>
                          <td>
                            {request ? (
                              <div className="flex items-center gap-2">
                                <img className="user-avatar" src={request?.profile ? request?.profile : '/img/admin.png'} alt="" />
                                <span>{request.name}</span>
                              </div>
                            ) : 'Unknown User'}
                          </td>
                          <td>
                            {request ? request.designation?.charAt(0).toUpperCase() + request.designation?.slice(1) : ''}
                          </td>
                          <td>{request ? request.department : ''}</td>
                          {/* <td>
                          <span className={`badge ${request.status === 'pending' ? 'badge-warning' :
                            request.status === 'approved' ? 'badge-success' :
                              'badge-error'
                            }`}>
                            {request.status?.charAt(0).toUpperCase() + request.status?.slice(1)}
                          </span>
                        </td> */}
                          <td>{formatDate(request.createdAt)}</td>
                          <td>
                            {/* {request.status === 'pending' ? ( */}
                            <div className="flex gap-2">
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => {
                                  setSelectedUser(request);
                                  setUserRole('Team Leader');
                                  setShowUserForm(true);
                                }}
                              >

                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                              <button
                                className="btn btn-sm btn-error"
                                onClick={() => deleteUpdateRequest(request?._id)}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </button>
                            </div>
                            {/* ) : ( */}
                            {/* <button className="btn btn-sm btn-outline">View</button> */}
                            {/* )} */}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 text-center">
                <p className="text-muted">No password requests found.</p>
              </div>
            )}
          </div>
        )
        }
      </div>
    </>
  );

  const renderUserRequestsView = () => (
    <>
      <div className="mb-4">
        <h2 className="text-xl font-bold">User Requests</h2>
        <p className="text-muted">Manage requests from team leaders and executives</p>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search password requests"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card">

        <div className="card-body p-0">
          {userRequest?.length > 0 ? (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>

                    <th>User</th>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Req. to</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userRequest?.map((request, index) => {
                    return (
                      <>
                        <tr key={request?.id} >

                          <td style={{ display: 'flex', justifyContent: 'center' }}>

                            <div className="flex items-center gap-2">
                              <img src={request?.profile ? request?.profile : '/img/admin.png'} className='user-avatar' alt="PF" />
                              <span>{request?.username}</span>
                            </div>

                          </td>
                          <td>
                            {request?.designation}
                          </td>
                          <td>{request?.department}</td>
                          <td>{request?.reqto}</td>
                          <td style={{ display: 'flex', justifyContent: 'center' }}>
                            {/* {request?.status === 'pending' ? ( */}
                            <div className="flex gap-2">
                              {
                                request?.status === 'pending' ?
                                  <>
                                    <button
                                      className="btn btn-sm btn-success"
                                      onClick={() => statusUpdateforUserRequest(request?._id, 'allow', request?.email)}
                                    >Accept
                                    </button>
                                    <button
                                      className="btn btn-sm btn-error"
                                      onClick={() => deleteUpdateRequest(request?._id)}
                                    >
                                      Delete
                                    </button>
                                  </> :
                                  <button
                                    className="btn btn-sm btn-error"
                                  // onClick={() => deleteUpdateRequest(request?._id)}
                                  >
                                    View
                                  </button>
                              }
                            </div>

                          </td>
                        </tr>

                      </>

                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 text-center">
              <p className="text-muted">No password requests found.</p>
            </div>
          )}
        </div>

      </div>
    </>
  );

  return (
    <div className="animate-fade">
      {renderContent()}
    </div>
  );
}

export default ManagerPanel;