import { useState, useEffect } from 'react';
import mockUsers from '../../data/mockUsers';
import mockTickets from '../../data/mockTickets';
import mockPasswordRequests from '../../data/mockPasswordRequests';
import mockDepartments from '../../data/mockDepartments';
import mockBranches from '../../data/mockBranches';
import UserForm from '../../components/UserForm';
import DepartmentForm from '../../components/DepartmentForm';
import { useSelector } from "react-redux";
import axios from 'axios';
import URI from '../../utills';
import toast from 'react-hot-toast';
import { } from '@fortawesome/free-brands-svg-icons'
import { faBell, faBuilding, faChartBar, faEdit, faEye, faMoon, faUser } from '@fortawesome/free-regular-svg-icons'
import { faBars, faChartLine, faGear, faLock, faSignOut, faTicketAlt, faTimes, faTrash, faUserCog, faUsers, faUsersCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from 'react-router-dom';

function AdminPanel({ view = 'departments' }) {

  const { user } = useSelector(store => store.user);

  const [departments, setDepartments] = useState([]);
  const [teamLeaders, setTeamLeaders] = useState([]);
  const [managers, setManagers] = useState([]);
  const [executive, setExecutive] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [passwordRequests, setPasswordRequests] = useState([]);
  const [branch, setBranch] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showUserForm, setShowUserForm] = useState(false);
  const [showDepartmentForm, setShowDepartmentForm] = useState(false);
  const [selectedUser, setselectedUser] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [userRole, setUserRole] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState('');

  const [allUsers, setAllUsers] = useState([]);
  const [allRequests, setAllRequests] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [comment, setComment] = useState('');
  const [userRequest, setUserRequest] = useState();

  const [stats, setStats] = useState({
    // totalBranches: 0,
    totalDepartments: 0,
    totalUsers: 0,
    totalTickets: 0,
    openTickets: 0,
    resolvedTickets: 0,
    pendingPasswordRequests: 0,
    forgetPasswordRequests: 0
  });

  useEffect(() => {
    const stats = {
      // totalBranches: branches?.length,
      totalDepartments: departments.length,
      totalUsers: allUsers?.length + managers?.length + teamLeaders?.length,
      totalTickets: tickets?.length,
      openTickets: tickets.filter(t => t.status === 'open').length,
      resolvedTickets: tickets.filter(t => t.status === 'resolved').length,
      pendingPasswordRequests: userRequest?.filter((req) => req.status === 'pending')?.length,
      forgetPasswordRequests: allRequests?.length
    };
    setStats(stats);
  }, [allUsers, tickets, userRequest,allRequests, departments,managers,teamLeaders]);

  const navigate = useNavigate();

  //fetching APIs
  // fetch password requests
  const getAllRequests = async () => {
    try {
      const res = await axios.get(`${URI}/superadmin/getalladminrequests`, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        const matchedExecutives = res?.data?.allRequests?.filter((executive) =>
          user?.branches.includes(executive.branch)
        );
        setAllRequests(matchedExecutives);
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

  //fetch users
  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(`${URI}/admin/executives`, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        const matchedExecutives = res?.data?.allBranchesData?.filter((executive) =>
          user?.branches.includes(executive.branch)
        );
        setAllUsers(matchedExecutives);
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

  //fetch team leaders
  const fetchAllTeamLeaders = async () => {
    try {
      const res = await axios.get(`${URI}/admin/teamleaders`, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        const matchedExecutives = res?.data?.allBranchesData?.filter((executive) =>
          user?.branches.includes(executive.branch)
        );
        setTeamLeaders(matchedExecutives);
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

  //fetch managers
  const fetchAllManagers = async () => {
    try {
      const res = await axios.get(`${URI}/admin/managers`, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        const matchedExecutives = res?.data?.allBranchesData?.filter((executive) =>
          user?.branches.includes(executive.branch)
        );
        setManagers(matchedExecutives);
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

  //fetch department
  const fetchDepartment = async () => {
    try {
      const res = await axios.get(`${URI}/admin/department`, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        const matchedExecutives = res?.data?.departmentes?.filter((executive) =>
          user?.branches.includes(executive?.branch)
        );
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

  // fetch tickets
  const fetchAllTickets = async () => {
    try {
      const res = await axios.get(`${URI}/executive/getalltickets`, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        const matchedExecutives = res?.data?.data?.filter((ticket) =>
          user?.branches.includes(ticket?.branch)
        );
        setTickets(matchedExecutives);
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

  const fetchEditProfileRequest = async () => {
    try {
      const res = await axios.get(`${URI}/auth/getupdateprofilerequests`, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(r => {
        setUserRequest(r?.data?.requests?.filter((req) => user?.branches?.includes(req.branch)));
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
    getAllRequests();
    fetchAllUsers();
    fetchAllManagers();
    fetchAllTeamLeaders();
    fetchAllTickets();
    fetchDepartment();
    fetchEditProfileRequest();
  }, []);


  //normal actions
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
  };

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
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

  const handleEditUser = (userId, role) => {
    let userToEdit;
    if (role === 'Team Leader') {
      userToEdit = teamLeaders?.find(tl => tl._id === userId);
    } else if (role === 'Manager') {
      userToEdit = managers?.find(m => m._id === userId);
    }
    else if (role === 'Executive') {
      userToEdit = allUsers?.find(e => e._id === userId);
    }

    setselectedUser(userToEdit);
    setUserRole(role);
    setShowUserForm(true);
  };

  const handleEditDepartment = (departmentId) => {
    const departmentToEdit = departments.find(dept => dept._id === departmentId);
    setSelectedDepartment(departmentToEdit);
    setShowDepartmentForm(true);
  };

  const confirmDeleteDepartment = (departmentId) => {
    const departmentToDelete = departments.find(dept => dept._id === departmentId);
    setItemToDelete(departmentToDelete);
    setDeleteType('department');
    setIsDeleteModalOpen(true);
  };

  //filters
  // Filter departments based on search term
  const filteredDepartments = departments?.filter(dept =>
    dept?.branch === user?.branch &&
    dept.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    dept.description?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  // Filter team leaders and managers based on search term
  const filteredTeamLeaders = teamLeaders?.filter(tl =>
    tl.branch?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    tl.username?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    tl.email?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    tl.department?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  const filteredManagers = managers?.filter(m =>
    m.branch?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    m.username?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    m.email?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    m.department?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  const filteredExecutives = allUsers?.filter(m =>
    m.branch?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    m.username?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    m.email?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    m.department?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  // Filter tickets based on status and search term
  const filteredTickets = tickets?.filter(ticket => {
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    const matchesSearch = ticket.subject?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      ticket?.branch?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      ticket?.date?.includes(searchTerm?.toLocaleLowerCase())
    return matchesStatus && matchesSearch;
  });

  // Filter password requests based on search term
  const filteredPasswordRequests = allRequests?.filter(req => {
    const matchesSearch =
      req?.username?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      req?.email?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      req?.department?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      req?.designation?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      req?.branch?.toLowerCase().includes(searchTerm?.toLowerCase());

    return matchesSearch;
  });


  //not worked
  const handleUpdateUser = (userData) => {
    if (userRole === 'Team Leader') {
      const updatedTeamLeaders = teamLeaders.map(tl =>
        tl.id === selectedUser?.id ? { ...tl, ...userData } : tl
      );
      setTeamLeaders(updatedTeamLeaders);
    } else if (userRole === 'Manager') {
      const updatedManagers = managers.map(m =>
        m.id === selectedUser?.id ? { ...m, ...userData } : m
      );
      setManagers(updatedManagers);
    }

    setselectedUser(null);
    setUserRole('');
    setShowUserForm(false);
    alert('User updated successfully!');
  };

  const handleDeleteUser = () => {
    if (userRole === 'Team Leader') {
      const updatedTeamLeaders = teamLeaders?.filter(tl => tl.id !== itemToDelete.id);
      setTeamLeaders(updatedTeamLeaders);
    } else if (userRole === 'Manager') {
      const updatedManagers = managers?.filter(m => m.id !== itemToDelete.id);
      setManagers(updatedManagers);
    }

    setIsDeleteModalOpen(false);
    setItemToDelete(null);
    setUserRole('');
    alert('User deleted successfully!');
  };

  const handleCreateDepartment = (departmentData) => {
    // In a real app, this would be an API call
    const newDepartment = {
      id: mockDepartments.length + 1,
      name: departmentData.name,
      description: departmentData.description,
      branchId: branch.id,
      managerId: departmentData.managerId || null,
      createdAt: new Date().toISOString()
    };

    // setDepartments([...departments, newDepartment]);
    setShowDepartmentForm(false);
    alert('Department created successfully!');
  };

  const handleUpdateDepartment = (departmentData) => {
    const updatedDepartments = departments.map(dept =>
      dept.id === selectedDepartment.id ? { ...dept, ...departmentData } : dept
    );

    // setDepartments(updatedDepartments);
    setSelectedDepartment(null);
    setShowDepartmentForm(false);
    alert('Department updated successfully!');
  };

  const handleUpdateTicketStatus = (ticketId, newStatus) => {
    const updatedTickets = tickets.map(ticket =>
      ticket.id === ticketId ? { ...ticket, status: newStatus, updatedAt: new Date().toISOString() } : ticket
    );

    // setTickets(updatedTickets);
    alert('Ticket status updated successfully!');
  };

  const handleApprovePasswordRequest = (requestId) => {
    const updatedRequests = passwordRequests.map(req =>
      req.id === requestId ?
        {
          ...req,
          status: 'approved',
          resolvedBy: user?.id,
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
          resolvedBy: user?.id,
          resolvedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } : req
    );

    setPasswordRequests(updatedRequests);
    alert('Password request rejected!');
  };

  useEffect(() => {
    // Get branch info
    const userBranch = mockBranches.find(b => b.adminId === user?.id);
    setBranch(userBranch);

    // Get departments in the branch
    const branchDepartments = mockDepartments?.filter(dept =>
      dept.branchId === userBranch?.id
    );
    // setDepartments(branchDepartments);

    // Get team leaders in the branch
    const branchTeamLeaders = mockUsers?.filter(u =>
      u?.designation === 'Team Leader' && branchDepartments.some(dept => dept.name === u.department)
    );
    setTeamLeaders(branchTeamLeaders);

    // Get managers in the branch
    const branchManagers = mockUsers?.filter(u =>
      u?.designation === 'Manager' && branchDepartments.some(dept => dept.name === u.department)
    );
    setManagers(branchManagers);

    // Get all tickets in the branch
    const branchTickets = mockTickets?.filter(ticket =>
      branchDepartments.some(dept => dept.name === ticket.department)
    );
    // setTickets(branchTickets);

    // Get password requests from team leaders and managers
    const teamLeaderIds = branchTeamLeaders.map(tl => tl.id);
    const managerIds = branchManagers.map(m => m.id);
    const branchPasswordRequests = mockPasswordRequests?.filter(req =>
      teamLeaderIds.includes(req.userId) || managerIds.includes(req.userId)
    );
    setPasswordRequests(branchPasswordRequests);
  }, [user?.id]);


  //action APIs
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
        if (err.response && err.response.data && err.response.data.message) {
          toast.error(err.response.data.message); // For 400, 401, etc.
        } else {
          toast.error("Something went wrong");
        }
      });
    } catch (error) {
      console.log("while delete update request");
    }
  }

  //add comment on ticket
  const addCommentOnTicket = async () => {
    try {
      const ticketId = selectedTicket?._id;
      const commenter = user?.department || user?.designation;
      const res = await axios.post(`${URI}/executive/addcommentonticket`, { ticketId, comment, commenter }, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
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

  const confirmDeleteUser = async (userId) => {
    try {
      const res = await axios.delete(`${URI}/admin/deleteuser/${userId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
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

  const handleDeleteDepartment = async () => {
    try {
      const res = await axios.delete(`${URI}/admin/deletedepartment/${itemToDelete?._id}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        fetchDepartment();
        setItemToDelete('');
        setDeleteType('');
        setIsDeleteModalOpen(false);
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


  // Render different content based on the view
  const renderContent = () => {
    switch (view) {
      case 'overview':
        return renderOverviewView();
      case 'departments':
        return renderDepartmentsView();
      case 'leadership':
        return renderLeadershipView();
      case 'tickets':
        return renderTicketsView();
      case 'password-requests':
        return renderPasswordRequestsView();
      case 'user-requests':
        return renderUserRequestsView();
      default:
        return renderDepartmentsView();
    }
  };

  const renderOverviewView = () => (
    <>
      <div className="mb-4">
        <h2 className="text-xl font-bold">System Overview</h2>
        <p className="text-muted">Admin Overview of the Ticketing System</p>
      </div>

      <div className="dashboard-grid" >

        <div className="stat-card" onClick={() => navigate('/dashboard/departments')}>
          <div className="stat-card-header">
            <h3 className="stat-card-title">Departments</h3>
            <div className="stat-card-icon blue">
              <FontAwesomeIcon icon={faUser} />
            </div>
          </div>
          <div className="stat-card-value">{stats?.totalDepartments}</div>
        </div>

        <div className="stat-card" onClick={() => navigate('/dashboard/leadership')}>
          <div className="stat-card-header">
            <h3 className="stat-card-title">Total Users</h3>
            <div className="stat-card-icon green">
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

        <div className="stat-card" onClick={() => navigate('/dashboard/user-requests')}>
          <div className="stat-card-header">
            <h3 className="stat-card-title">Pending Requests</h3>
            <div className="stat-card-icon orange">
              <FontAwesomeIcon icon={faLock} />
              {/* <FaTicketAlt /> */}
            </div>
          </div>
          <div className="stat-card-value">{stats?.pendingPasswordRequests}</div>
        </div>

      </div>

      <div className="grid grid-2 gap-4 mt-4">
        <div className="card" onClick={() => navigate('/dashboard/tickets')} >
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

        <div className="card" onClick={() => navigate('/dashboard/password-requests')}>
          <div className="card-header">
            <h3>Password Requests</h3>
          </div>
          <div className="card-body">
            <div className="flex flex-col items-center justify-center h-full">
              <div className="text-5xl font-bold text-primary mb-2">{stats?.forgetPasswordRequests}</div>
              <p className="text-muted">Pending requests</p>
              <button className="btn btn-outline mt-4">View All Requests</button>
            </div>
          </div>
        </div>
      </div>


    </>
  );

  const renderDepartmentsView = () => (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">Departments</h2>
          <p className="text-muted">Manage departments in {user?.branch || 'your organization'}</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowDepartmentForm(true)}
        >
          Add New Department
        </button>
      </div>

      {showDepartmentForm ? (
        <div className="card mb-4 animate-slide-up">
          <div className="card-header">
            <h3>{selectedDepartment ? 'Edit Department' : 'Create New Department'}</h3>
          </div>
          <div className="card-body">
            <DepartmentForm
              initialData={selectedDepartment}
              allUsers={teamLeaders}
              // onSubmit={selectedDepartment ? handleUpdateDepartment : handleCreateDepartment}
              fetchDepartment={fetchDepartment}
              onCancel={() => {
                setSelectedDepartment(null);
                setShowDepartmentForm(false);
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
                  placeholder="Search departments by name or description"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body p-0">
              {filteredDepartments.length > 0 ? (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Branch</th>
                        <th>Team Leader</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDepartments.map(dept => {
                        const tl = teamLeaders?.find(tl => tl?.username === dept?.teamleader);
                        return (
                          <tr key={dept.id}>
                            <td className="font-medium">{dept?.name}</td>
                            <td>{dept?.branch}</td>
                            <td style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              {tl ? (
                                <div className="flex items-center gap-2">
                                  <img className="user-avatar" src={tl?.profile ? tl?.profile : '/img/admin.png'} alt="/img/admin.png" />
                                  <span>{tl?.name}</span>
                                </div>
                              ) : <span className="text-muted">Not assigned</span>}
                            </td>
                            <td>{formatDate(dept.createdAt)}</td>
                            <td style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <div className="flex gap-2">
                                <button
                                  className="btn btn-sm btn-outline"
                                  onClick={() => handleEditDepartment(dept?._id)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-sm btn-error"
                                  onClick={() => confirmDeleteDepartment(dept?._id)}
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
                  <p className="text-muted">No departments found. Add a new department to get started!</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );

  const renderLeadershipView = () => (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">Team Leaders & Managers</h2>
          <p className="text-muted">Manage leadership in {user?.branch || 'your organization'}</p>
        </div>
        <div className="flex gap-2">
          <button
            className="btn btn-secondary"
            onClick={() => {
              setUserRole('Executive');
              setShowUserForm(true);
            }}
          >
            Add Executive
          </button>
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
              setUserRole('Manager');
              setShowUserForm(true);
            }}
          >
            Add Manager
          </button>
        </div>
      </div>

      {showUserForm ? (
        <div className="card mb-4 animate-slide-up">
          <div className="card-header">
            <h3>
              {selectedUser
                ? `Edit ${userRole === 'Team Leader' ? 'Team Leader' : userRole === 'Manager' ? 'Manager' : 'Executive'}`
                : `Create New ${userRole === 'Team Leader' ? 'Team Leader' : userRole === 'Manager' ? 'Manager' : 'Executive'}`}
            </h3>
          </div>
          <div className="card-body">
            <UserForm
              initialData={selectedUser}
              designation={userRole}
              fetchAllUsers={userRole === 'Executive' ? fetchAllUsers : userRole === 'Manager' ? fetchAllManagers : fetchAllTeamLeaders}
              onCancel={() => {
                setselectedUser(null);
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
                        <th>Department</th>
                        <th>Branch</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTeamLeaders?.map(tl => (
                        <>
                          {
                            // tl?.designation === "Team Leader" && tl?.branch === user?.branch &&
                            <tr key={tl.id}>
                              <td style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div className="flex items-center gap-2">
                                  <img className="user-avatar" src={tl?.profile ? tl?.profile : '/img/admin.png'} alt="/img/admin.png" />
                                  {/* <div className="user-avatar">{tl?.profile}</div> */}
                                  <span>{tl?.username}</span>
                                </div>
                              </td>

                              <td>{tl?.department ? tl?.department : 'Not Assigned'}</td>
                              <td>{tl?.branch}</td>
                              <td>{formatDate(tl?.createdAt)}</td>
                              <td style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div className="flex gap-2">
                                  <button
                                    className="btn btn-sm btn-outline"
                                    onClick={() => handleEditUser(tl._id, 'Team Leader')}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="btn btn-sm btn-error"
                                    onClick={() => confirmDeleteUser(tl._id)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          }
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-muted">No team leaders found. Add a new team leader to get started!</p>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Managers</h3>
            </div>
            <div className="card-body p-0">
              {filteredManagers?.length > 0 ? (
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
                      {filteredManagers?.map(m => (
                        <>
                          {
                            // m?.designation === "Manager" && m?.branch === user?.branch &&
                            < tr key={m.id}>
                              <td>
                                <div className="flex items-center gap-2">
                                  <img className="user-avatar" src={m?.profile ? m?.profile : '/img/admin.png'} alt="/img/admin.png" />
                                  {/* <div className="user-avatar">{m?.profile}</div> */}
                                  <span>{m?.username}</span>
                                </div>
                              </td>
                              <td>{m?.email}</td>
                              <td>{m?.branch}</td>
                              <td>{formatDate(m.createdAt)}</td>
                              <td>
                                <div className="flex gap-2">
                                  <button
                                    className="btn btn-sm btn-outline"
                                    onClick={() => handleEditUser(m._id, 'Manager')}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="btn btn-sm btn-error"
                                    onClick={() => confirmDeleteUser(m._id)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr >
                          }
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-muted">No managers found. Add a new manager to get started!</p>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Executives</h3>
            </div>
            <div className="card-body p-0">
              {filteredExecutives?.length > 0 ? (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Branch</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredExecutives?.map(m => (
                        <>
                          {
                            // m?.designation === "Manager" && m?.branch === user?.branch &&
                            < tr key={m.id}>
                              <td>
                                <div className="flex items-center gap-2">
                                  <img className="user-avatar" src={m?.profile ? m?.profile : '/img/admin.png'} alt="/img/admin.png" />
                                  {/* <div className="user-avatar">{m?.profile}</div> */}
                                  <span>{m?.username}</span>
                                </div>
                              </td>

                              <td>{m?.department}</td>
                              <td>{m?.branch}</td>
                              <td>{formatDate(m.createdAt)}</td>
                              <td>
                                <div className="flex gap-2">
                                  <button
                                    className="btn btn-sm btn-outline"
                                    onClick={() => handleEditUser(m._id, 'Manager')}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="btn btn-sm btn-error"
                                    onClick={() => confirmDeleteUser(m._id)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr >
                          }
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-muted">No managers found. Add a new executive to get started!</p>
                </div>
              )}
            </div>
          </div>
        </>
      )
      }
    </>
  );

  const renderTicketsView = () => (
    <>
      <div className="mb-4">
        <h2 className="text-xl font-bold">All Tickets</h2>
        <p className="text-muted">Manage tickets in {branch?.name || 'your organization'}</p>
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
                    <th>Branch</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Date</th>

                    <th>Subject</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets?.map((ticket, index) => {

                    return (
                      <>
                        {
                          ticket?.status === 'in-progress' &&
                          <tr key={index + 1}>
                            <td>{ticket?.branch}</td>
                            <td>
                              <span className={`badge ${ticket?.status === 'open' ? 'badge-warning' :
                                ticket.status === 'in-progress' ? 'badge-primary' :
                                  'badge-success'
                                }`}>
                                {ticket?.status === 'in-progress' ? 'In Progress' :
                                  ticket?.status?.charAt(0)?.toUpperCase() + ticket?.status?.slice(1)}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${ticket.priority === 'high' ? 'badge-error' :
                                ticket.priority === 'medium' ? 'badge-warning' :
                                  'badge-primary'
                                }`}>
                                {ticket?.priority?.charAt(0)?.toUpperCase() + ticket?.priority?.slice(1)}
                              </span>
                            </td>
                            <td>{formatDate(ticket?.createdAt)}</td>
                            <td>{ticket?.subject}</td>
                            <td>
                              <div className="flex gap-2">
                                {/* {ticket.status !== 'resolved' && (
                                  <>
                                    {ticket.status === 'open' && (
                                      <button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => handleUpdateTicketStatus(ticket.id, 'in-progress')}
                                      >
                                        Start
                                      </button>
                                    )}
                                    {ticket.status === 'in-progress' && (
                                      <button
                                        className="btn btn-sm btn-success"
                                        onClick={() => handleUpdateTicketStatus(ticket.id, 'resolved')}
                                      >
                                        Resolve
                                      </button>
                                    )}
                                  </>
                                )} */}
                                <button className="btn btn-sm btn-outline" onClick={() => handleViewTicket(ticket)}>View</button>
                              </div>
                            </td>
                          </tr>
                        }
                      </>

                    );
                  })}
                  {filteredTickets?.map((ticket, index) => {

                    return (
                      <>
                        {
                          ticket?.status === 'open' &&
                          <tr key={index + 1}>
                            <td>{ticket?.branch}</td>
                            <td>
                              <span className={`badge ${ticket?.status === 'open' ? 'badge-warning' :
                                ticket.status === 'in-progress' ? 'badge-primary' :
                                  'badge-success'
                                }`}>
                                {ticket?.status === 'in-progress' ? 'In Progress' :
                                  ticket?.status?.charAt(0)?.toUpperCase() + ticket?.status?.slice(1)}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${ticket.priority === 'high' ? 'badge-error' :
                                ticket.priority === 'medium' ? 'badge-warning' :
                                  'badge-primary'
                                }`}>
                                {ticket?.priority?.charAt(0)?.toUpperCase() + ticket?.priority?.slice(1)}
                              </span>
                            </td>
                            <td>{formatDate(ticket?.createdAt)}</td>
                            <td>{ticket?.subject}</td>
                            <td>
                              <div className="flex gap-2">
                                {/* {ticket.status !== 'resolved' && (
                                  <>
                                    {ticket.status === 'open' && (
                                      <button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => handleUpdateTicketStatus(ticket.id, 'in-progress')}
                                      >
                                        Start
                                      </button>
                                    )}
                                    {ticket.status === 'in-progress' && (
                                      <button
                                        className="btn btn-sm btn-success"
                                        onClick={() => handleUpdateTicketStatus(ticket.id, 'resolved')}
                                      >
                                        Resolve
                                      </button>
                                    )}
                                  </>
                                )} */}
                                <button className="btn btn-sm btn-outline" onClick={() => handleViewTicket(ticket)}>View</button>
                              </div>
                            </td>
                          </tr>
                        }
                      </>

                    );
                  })}
                  {filteredTickets?.map((ticket, index) => {

                    return (
                      <>
                        {
                          ticket?.status === 'resolved' &&
                          <tr key={index + 1}>
                            <td>{ticket?.branch}</td>
                            <td>
                              <span className={`badge ${ticket?.status === 'open' ? 'badge-warning' :
                                ticket.status === 'in-progress' ? 'badge-primary' :
                                  'badge-success'
                                }`}>
                                {ticket?.status === 'in-progress' ? 'In Progress' :
                                  ticket?.status?.charAt(0)?.toUpperCase() + ticket?.status?.slice(1)}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${ticket.priority === 'high' ? 'badge-error' :
                                ticket.priority === 'medium' ? 'badge-warning' :
                                  'badge-primary'
                                }`}>
                                {ticket?.priority?.charAt(0)?.toUpperCase() + ticket?.priority?.slice(1)}
                              </span>
                            </td>
                            <td>{formatDate(ticket?.createdAt)}</td>
                            <td>{ticket?.subject}</td>
                            <td>
                              <div className="flex gap-2">
                                {/* {ticket.status !== 'resolved' && (
                                  <>
                                    {ticket.status === 'open' && (
                                      <button
                                        className="btn btn-sm btn-primary"
                                        onClick={() => handleUpdateTicketStatus(ticket.id, 'in-progress')}
                                      >
                                        Start
                                      </button>
                                    )}
                                    {ticket.status === 'in-progress' && (
                                      <button
                                        className="btn btn-sm btn-success"
                                        onClick={() => handleUpdateTicketStatus(ticket.id, 'resolved')}
                                      >
                                        Resolve
                                      </button>
                                    )}
                                  </>
                                )} */}
                                <button className="btn btn-sm btn-outline" onClick={() => handleViewTicket(ticket)}>View</button>
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
              <p className="text-muted">No tickets found with the current filters.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );

  const renderPasswordRequestsView = () => (
    <>
      <div className="mb-4">
        <h2 className="text-xl font-bold">Password Update Requests</h2>
        <p className="text-muted">Manage password change requests from team leaders and managers</p>
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
                onCancel={() => {
                  setselectedUser(null);
                  setUserRole('');
                  setShowUserForm(false);
                }}
                designation={userRole}
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
                      <th>Branch</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPasswordRequests?.map((request, index) => {
                      return (
                        <>
                          <tr key={request?.id}>
                            <td>#{index + 1}</td>
                            <td>

                              <div className="flex items-center gap-2">
                                <img src={request?.profile ? request?.profile : '/img/admin.png'} className='user-avatar' alt="/img/admin.png" />
                                <span>{request?.username}</span>
                              </div>

                            </td>
                            <td>
                              {request?.designation}
                            </td>
                            <td>{request?.branch}</td>

                            <td>
                              {/* {request?.status === 'pending' ? ( */}
                              <div className="flex gap-2">
                                <button
                                  className="btn btn-sm btn-success"
                                  onClick={() => handleEditUser(request?._id, request?.designation)}
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
        )}
      </div>
    </>
  );

  const renderUserRequestsView = () => (
    <>
      <div className="mb-4">
        <h2 className="text-xl font-bold">User Requests</h2>
        <p className="text-muted">Manage requests from team leaders and managers</p>
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
                        {
                          request.status === 'pending' && request?.designation === 'Manager' &&
                          <tr key={request?.id} >

                            <td style={{ display: 'flex', justifyContent: 'center' }}>

                              <div className="flex items-center gap-2">
                                <img src={request?.profile ? request?.profile : '/img/admin.png'} className='user-avatar' alt="/img/admin.png" />
                                <span>{request?.username}</span>
                              </div>

                            </td>
                            <td>
                              {request?.designation}
                            </td>
                            <td> {
                              request?.designation === 'Manager' ? '----' : request?.department ? request?.department : 'N/A'
                            }
                            </td>
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
                                    'Accepted'
                                  // <button
                                  //   className="btn btn-sm btn-error"
                                  // // onClick={() => deleteUpdateRequest(request?._id)}
                                  // >
                                  //   View
                                  // </button>
                                }
                              </div>

                            </td>
                          </tr>
                        }

                      </>
                    );
                  })}
                  {userRequest?.map((request, index) => {
                    return (
                      <>
                        {
                          request.status === 'pending' && (request?.designation === 'Team Leader' || request?.designation === 'Executive') &&
                          <tr key={request?.id} >

                            <td style={{ display: 'flex', justifyContent: 'center' }}>

                              <div className="flex items-center gap-2">
                                <img src={request?.profile ? request?.profile : '/img/admin.png'} className='user-avatar' alt="/img/admin.png" />
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
                                    'Accepted'
                                  // <button
                                  //   className="btn btn-sm btn-error"
                                  // // onClick={() => deleteUpdateRequest(request?._id)}
                                  // >
                                  //   View
                                  // </button>
                                }
                              </div>

                            </td>
                          </tr>
                        }

                      </>
                    );
                  })}
                  {userRequest?.map((request, index) => {
                    return (
                      <>
                        {
                          request.status !== 'pending' &&
                          <tr key={request?.id} >

                            <td style={{ display: 'flex', justifyContent: 'center' }}>

                              <div className="flex items-center gap-2">
                                <img src={request?.profile ? request?.profile : '/img/admin.png'} className='user-avatar' alt="/img/admin.png" />
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
                                    'Accepted'
                                  // <button
                                  //   className="btn btn-sm btn-error"
                                  // // onClick={() => deleteUpdateRequest(request?._id)}
                                  // >
                                  //   View
                                  // </button>
                                }
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
                      deleteType === 'user' ? itemToDelete.name : itemToDelete.name
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
                    onClick={deleteType === 'user' ? confirmDeleteUser : handleDeleteDepartment}
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
                      Created: {formatDate(selectedTicket?.createdAt)}
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

export default AdminPanel;