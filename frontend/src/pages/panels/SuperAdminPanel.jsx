import { useState, useEffect } from 'react';
import { } from '@fortawesome/free-brands-svg-icons'
import { faBuilding, faUser } from '@fortawesome/free-regular-svg-icons'
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

function SuperAdminPanel({ user, view = 'overview' }) {
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

  // fetch password requests
  const getAllRequests = async () => {
    try {
      const res = await axios.get(`${URI}/superadmin/getalladminrequests`, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res=>{
        setPasswordRequests(res?.data?.allRequests);
      }).catch(err => {
        // Handle error and show toast
        if (err.response && err.response.data && err.response.data.message) {
          toast.error(err.response.data.message); // For 400, 401, etc.
        } else {
          toast.error("Something went wrong");
        }
      });
    } catch (error) {
      console.log("while geting all admin requests", error);
    }
  }

  useEffect(() => {
    getAllRequests();
  }, []);

  //fetch department

  const fetchDepartment = async () => {
    try {
      const res = await axios.get(`${URI}/admin/department`, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res=>{
        setDepartments(res?.data?.departmentes)
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

  //fetch users
  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(`${URI}/superadmin/getbranches`, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res=>{
        setAllUsers(
          res?.data?.allBranchesData?.filter((us) => us?.designation !== 'superadmin')
        );
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

  // fetch tickets
  const fetchAllTickets = async () => {
    try {
      const res = await axios.get(`${URI}/executive/getalltickets`, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res=>{
        setTickets(res?.data?.data);
      }).catch(err => {
        // Handle error and show toast
        if (err.response && err.response.data && err.response.data.message) {
          toast.error(err.response.data.message); // For 400, 401, etc.
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
      }).then(res=>{
        setBranches(res?.data?.branches)
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
  };

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  //add comment on ticket
  const addCommentOnTicket = async () => {
    try {
      const ticketId = selectedTicket?._id;
      const commenter = user?.department || user?.designation;
      const res = await axios.post(`${URI}/executive/addcommentonticket`, { ticketId, comment, commenter }, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res=>{
        fetchAllTickets();
        handleCloseModal();
        setComment('');
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
      console.log('error while adding comment', error);
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
    console.log(adminUsers)

    // Get all tickets
    // setTickets(mockTickets);

    // Get password requests from admins
    const adminIds = adminUsers.map(admin => admin.id);
    const adminPasswordRequests = mockPasswordRequests.filter(req =>
      adminIds.includes(req.userId)
    );
    // setPasswordRequests(adminPasswordRequests);

    
  }, []);

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
  }, [allUsers, tickets, passwordRequests, departments]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleCreateBranch = (branchData) => {
    // In a real app, this would be an API call
    alert('admins'+admins)
    const newBranch = {
      id: branches.length + 1,
      name: branchData.name,
      location: branchData.location,
      adminId: branchData.adminId || null,
      createdAt: new Date().toISOString()
    };

    // setBranches([...branches, newBranch]);
    setShowBranchForm(false);
    alert('Branch created successfully!');
  };

  const handleEditBranch = (branchId) => {
    const branchToEdit = branches.find(branch => branch.id === branchId);
    setSelectedBranch(branchToEdit);
    setShowBranchForm(true);
  };

  const handleUpdateBranch = (branchData) => {
    const updatedBranches = branches.map(branch =>
      branch.id === selectedBranch.id ? { ...branch, ...branchData } : branch
    );

    // setBranches(updatedBranches);
    setSelectedBranch(null);
    setShowBranchForm(false);
    alert('Branch updated successfully!');
  };

  const confirmDeleteBranch = (branchId) => {
    const branchToDelete = branches.find(branch => branch._id === branchId);
    setItemToDelete(branchToDelete);
    setDeleteType('branch');
    setIsDeleteModalOpen(true);
  };

  const handleDeleteBranch = async () => {
    try {
      const res = await axios.delete(`${URI}/superadmin/deletebranch/${itemToDelete?._id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res=>{
        fetchBranches();
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
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
      console.log("while delete user", error);
    }
  };


  const handleEditAdmin = (adminId) => {
    const adminToEdit = allUsers.find(admin => admin._id === adminId);
    setSelectedUser(adminToEdit);
    setShowUserForm(true);
  };

  const handleUpdateAdmin = (userData) => {
    const updatedAdmins = admins.map(admin =>
      admin.id === selectedUser.id ? { ...admin, ...userData } : admin
    );

    // setAdmins(updatedAdmins);
    setSelectedUser(null);
    setShowUserForm(false);
    alert('Admin updated successfully!');
  };

  const confirmDeleteAdmin = async (adminId) => {
    try {
      const res = await axios.delete(`${URI}/admin/deleteuser/${adminId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res=>{
        fetchAllUsers();
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
      console.log("while delete user", error);
    }
  };

  const handleDeleteAdmin = () => {
    const updatedAdmins = admins.filter(admin => admin.id !== itemToDelete.id);
    // setAdmins(updatedAdmins);
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
    alert('Admin deleted successfully!');
  };

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

  // Filter branches based on search term
  const filteredBranches = branches.filter(branch =>
    branch.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    branch.location?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  // Filter admins based on search term
  const filteredAdmins = allUsers?.filter(admin =>
    admin?.designation === 'admin' &&
    admin.username?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    admin.email?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  // Filter password requests based on search term
  const filteredPasswordRequests = passwordRequests.filter(req => {
    const admin = admins.find(a => a.id === req.userId);
    return admin && (
      admin.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      admin.email?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      req.reason?.toLowerCase().includes(searchTerm?.toLowerCase())
    );
  });

  // Filter tickets based on search term and status
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch =
      ticket?.branch?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      ticket?.subject?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      ticket?.description?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      ticket?.department?.toLowerCase().includes(searchTerm?.toLowerCase());

    const matchesStatus = filterStatus === 'all' || ticket?.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleUpdateTicketStatus = (ticketId, newStatus) => {
    const updatedTickets = tickets.map(ticket =>
      ticket.id === ticketId ?
        {
          ...ticket,
          status: newStatus,
          updatedAt: new Date().toISOString()
        } : ticket
    );

    setTickets(updatedTickets);
    alert('Ticket status updated successfully!');
  };

  // Render different content based on the view
  const renderContent = () => {
    switch (view) {
      case 'branches':
        return renderBranchesView();
      case 'admins':
        return renderAdminsView();
      case 'password-requests':
        return renderPasswordRequestsView();
      case 'tickets':
        return renderTicketsView();
      case 'overview':
        return renderOverviewView();
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
        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Branches</h3>
            <div className="stat-card-icon blue">
              <FontAwesomeIcon icon={faBuilding} />
              {/* <FaBuilding /> */}
            </div>
          </div>
          <div className="stat-card-value">{stats?.totalBranches}</div>
        </div>

        {/* <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Departments</h3>
            <div className="stat-card-icon blue">
              <FontAwesomeIcon icon={faBuilding} />
            </div>
          </div>
          <div className="stat-card-value">{stats?.totalDepartments}</div>
        </div> */}

        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Total Users</h3>
            <div className="stat-card-icon blue">
              <FontAwesomeIcon icon={faUser} />
              {/* <FaUsers /> */}
            </div>
          </div>
          <div className="stat-card-value">{stats?.totalUsers}</div>
        </div>

        <div className="stat-card">
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
        <div className="card">
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

        <div className="card">
          <div className="card-header">
            <h3>Password Requests</h3>
          </div>
          <div className="card-body">
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-5xl font-bold text-primary mb-2">{stats?.pendingPasswordRequests}</div>
              <p className="text-muted">Pending requests</p>
              <button className="btn btn-outline mt-4">View All Requests</button>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-4">
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
                  <th>Departments</th>
                  <th>Tickets</th>
                </tr>
              </thead>
              <tbody>
                {branches.map(branch => {
                  const branchAdmin = admins.find(a => a.id === branch.adminId);
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
                          <div className="flex items-center gap-2">
                            <div className="user-avatar">{branchAdmin.avatar}</div>
                            <span>{branchAdmin.name}</span>
                          </div>
                        ) : <span className="text-muted">Not assigned</span>}
                      </td>
                      <td>{branch?.departments ? branch?.departments : 0}</td>
                      <td>{branch?.tickets ? branch?.tickets : 0}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
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
                        const branchAdmin = admins.find(a => a.id === branch.adminId);
                        const branchDepartments = mockDepartments.filter(d => d.branchId === branch.id);

                        return (
                          <tr key={branch.id}>
                            <td className="font-medium">{branch.name}</td>
                            <td>{branch.location}</td>
                            <td>
                              {branchAdmin ? (
                                <div className="flex items-center gap-2">
                                  <div className="user-avatar">{branchAdmin.avatar}</div>
                                  <span>{branchAdmin.name}</span>
                                </div>
                              ) : <span className="text-muted">Not assigned</span>}
                            </td>
                            <td>{branchDepartments.length}</td>
                            <td>{formatDate(branch.createdAt)}</td>
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
                        <th>Branch</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAdmins.map(admin => {


                        return (
                          <>
                            {
                              admin?.designation === 'admin' &&
                              <tr key={admin.id}>
                                <td>
                                  <div className="flex items-center gap-2">
                                    <img src={admin?.profile} className="user-avatar" alt="" />
                                    {/* <div className="user-avatar">{admin.avatar}</div> */}
                                    <span>{admin?.name}</span>
                                  </div>
                                </td>
                                <td>{admin.email}</td>
                                <td>{admin?.branch}</td>
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

  const renderPasswordRequestsView = () => (
    <>
      <div className="mb-4">
        <h2 className="text-xl font-bold">Admin Password Update Requests</h2>
        <p className="text-muted">Manage password change requests from admins</p>
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
          {filteredPasswordRequests.length > 0 ? (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Admin</th>
                    <th>Branch</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPasswordRequests.map(request => {
                    const requestAdmin = admins.find(a => a.id === request.userId);
                    const adminBranch = requestAdmin ? branches.find(b => b.adminId === requestAdmin.id) : null;

                    return (
                      <tr key={request.id}>
                        <td>#{request.id}</td>
                        <td>
                          {requestAdmin ? (
                            <div className="flex items-center gap-2">
                              <div className="user-avatar">{requestAdmin.avatar}</div>
                              <span>{requestAdmin.name}</span>
                            </div>
                          ) : 'Unknown Admin'}
                        </td>
                        <td>{adminBranch ? adminBranch.name : 'Not assigned'}</td>
                        <td>{request.reason}</td>
                        <td>
                          <span className={`badge ${request.status === 'pending' ? 'badge-warning' :
                            request.status === 'approved' ? 'badge-success' :
                              'badge-error'
                            }`}>
                            {request.status?.charAt(0).toUpperCase() + request.status?.slice(1)}
                          </span>
                        </td>
                        <td>{formatDate(request.createdAt)}</td>
                        <td>
                          {request.status === 'pending' ? (
                            <div className="flex gap-2">
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => handleApprovePasswordRequest(request.id)}
                              >
                                Approve
                              </button>
                              <button
                                className="btn btn-sm btn-error"
                                onClick={() => handleRejectPasswordRequest(request.id)}
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <button className="btn btn-sm btn-outline">View</button>
                          )}
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
      </div>
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
          {filteredTickets.length > 0 ? (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Department</th>
                    <th>Branch</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets?.map((ticket, index) => {
                    // const creator = mockUsers.find(u => u.id === ticket.createdBy);
                    // const department = mockDepartments.find(d => d.name === ticket.department);
                    // const branch = department ? mockBranches.find(b => b.id === department.branchId) : null;

                    return (
                      <tr key={index + 1}>
                        <td>#{index + 1}</td>
                        <td>{ticket?.subject}</td>
                        <td>{ticket?.department}</td>
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
                        <td>{formatDate(ticket?.date)}</td>
                        <td>
                          <div className="flex gap-2">
                            {ticket?.status !== 'resolved' && (
                              <>
                                {ticket?.status === 'open' && (
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => handleUpdateTicketStatus(ticket?.id, 'in-progress')}
                                  >
                                    Start
                                  </button>
                                )}
                                {ticket?.status === 'in-progress' && (
                                  <button
                                    className="btn btn-sm btn-success"
                                    onClick={() => handleUpdateTicketStatus(ticket?.id, 'resolved')}
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
                <div className="modal-header">
                  <h3 className="modal-title">Ticket #{selectedTicket?._id}</h3>
                  <button className="modal-close" onClick={handleCloseModal}>×</button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <h4 className="font-bold">{selectedTicket?.subject}</h4>
                    <div className="flex gap-2 mb-2">
                      <span className={`badge ${selectedTicket?.status === 'open' ? 'badge-warning' :
                        selectedTicket?.status === 'in-progress' ? 'badge-primary' :
                          'badge-success'
                        }`}>
                        {selectedTicket?.status === 'in-progress' ? 'In Progress' :
                          selectedTicket?.status?.charAt(0).toUpperCase() + selectedTicket?.status?.slice(1)}
                      </span>
                      <span className={`badge ${selectedTicket?.priority === 'high' ? 'badge-error' :
                        selectedTicket?.priority === 'medium' ? 'badge-warning' :
                          'badge-primary'
                        }`}>
                        {selectedTicket?.priority?.charAt(0).toUpperCase() + selectedTicket?.priority?.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-muted">
                      Created: {formatDate(selectedTicket?.date)}
                    </p>
                  </div>

                  <div className="mb-4">
                    <h5 className="font-bold mb-2">Description</h5>
                    <p>{selectedTicket?.description}</p>
                  </div>

                  <div className="mb-4">
                    <h5 className="font-bold mb-2">Comments ({selectedTicket?.comments?.length})</h5>
                    {selectedTicket?.comments?.length > 0 ? (
                      <div className="space-y-3">
                        {selectedTicket?.comments?.map(comment => (
                          <div key={comment?.id} className="p-2 bg-gray-100 rounded">
                            <p className="text-sm">{comment?.content}</p>
                            <p className="text-sm">{comment?.commenter}</p>
                            <p className="text-xs text-muted mt-1">
                              {formatDate(comment?.createdAt)}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted">No comments yet.</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="comment" className="form-label">Add Comment</label>
                    <textarea
                      id="comment"
                      className="form-control"
                      rows="3"
                      placeholder="Add your comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-outline"
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                  <button className="btn btn-primary"
                    onClick={addCommentOnTicket}
                  >
                    Add Comment
                  </button>
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