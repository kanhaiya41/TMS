import { useState, useEffect } from 'react';
import mockUsers from '../../data/mockUsers';
import mockTickets from '../../data/mockTickets';
import mockPasswordRequests from '../../data/mockPasswordRequests';
import mockDepartments from '../../data/mockDepartments';
import UserForm from '../../components/UserForm';
import axios from 'axios';
import URI from '../../utills';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { } from '@fortawesome/free-brands-svg-icons'
import { faBell, faBuilding, faChartBar, faEdit, faEye, faMoon, faUser } from '@fortawesome/free-regular-svg-icons'
import { faBars, faChartLine, faGear, faLock, faSignOut, faTicketAlt, faTimes, faTrash, faUserCog, faUsers, faUsersCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import TicketForm from '../../components/TicketForm';

function TeamLeaderPanel({ view = 'executives' }) {

  const { user } = useSelector(store => store.user);

  const [executives, setExecutives] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [passwordRequests, setPasswordRequests] = useState([]);
  const [department, setDepartment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showUserForm, setShowUserForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [comment, setComment] = useState('');
  const [showTicketForm, setShowTicketForm] = useState(false);

  const [allRequests, setAllRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [reAssignto, setReAssignto] = useState('');
  const [userRequest, setUserRequest] = useState();


  // fetch password request 
  const getAllRequests = async () => {
    try {
      const res = await axios.get(`${URI}/superadmin/getalladminrequests`, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        setAllRequests(res?.data?.allRequests);
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

  //fetch department
  const fetchDepartment = async () => {
    try {
      const res = await axios.get(`${URI}/admin/department`, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        setDepartment(res?.data?.departmentes)
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

  const fetchEditProfileRequest = async () => {
    try {
      const res = await axios.get(`${URI}/auth/getupdateprofilerequests`, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(r => {
        setUserRequest(r?.data?.requests?.filter((req) => user?.branch === req.branch && req?.designation === 'Executive'));
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
    fetchDepartment();
    fetchEditProfileRequest();
  }, []);

  //fetch users
  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(`${URI}/admin/executives`, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        setAllUsers(res?.data?.allBranchesData?.filter((exec) => exec?.branch === user?.branch && exec?.department === exec?.department));
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

  useEffect(() => {
    fetchAllUsers();
  }, []);

  // fetch tickets
  const fetchAllTickets = async () => {
    try {
      const res = await axios.get(`${URI}/executive/getalltickets`, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        setTickets(res?.data?.data?.filter((tickt) => tickt?.branch === user?.branch && tickt?.department?.filter((dept) => dept?.name === user?.department)));
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

  useEffect(() => {
    fetchAllTickets();
  }, []);

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleEditUser = (userId) => {
    const userToEdit = allUsers?.find(exec => exec?._id === userId);
    setSelectedUser(userToEdit);
    setShowUserForm(true);

  };


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

  const handleCancelForm = () => {
    setSelectedUser(null);
    setShowUserForm(false);
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

  // Filter executives based on search term
  const filteredExecutives = allUsers?.filter(exec =>
    exec?.username?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    exec?.email?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    exec?.address?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  // Filter tickets based on status and search term
  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = filterStatus === 'all' || ticket?.status === filterStatus;
    const matchesSearch = ticket?.subject?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      ticket?.name?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      ticket?.issuedby?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      ticket?.date?.toLowerCase().includes(searchTerm?.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Filter password requests based on search term and status
  const filteredPasswordRequests = allRequests.filter(req => {
    const departmentRequest = (
      user?.department === req?.department &&
      req?.designation === 'Executive' &&
      req?.branch === user?.branch
    )
    const matchesSearch = user ? (
      req.username?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      req.designation?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      req.department?.toLowerCase().includes(searchTerm?.toLowerCase())
    ) : false;

    return matchesSearch && departmentRequest;
  });

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
        if (err.response && err.response.data && err.response.data.message) {
          toast.error(err.response.data.message); // For 400, 401, etc.
        } else {
          toast.error("Something went wrong");
        }
      });

    } catch (error) {
      console.log('error while ticket updation', error);
    }
  }

  //add comment on ticket
  const addCommentOnTicket = async () => {
    try {
      const ticketId = selectedTicket?._id;
      const commenter = user?.department;
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

  const reAssignTicket = async () => {
    try {
      const res = await axios.post(`${URI}/executive/ticketreassign`, { ticketId: selectedTicket?._id, presentDept: selectedTicket?.department, reAssignto: reAssignto })
        .then(res => {
          fetchAllTickets();
          handleCloseModal();
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
      console.log("while Re-Assigning the Ticket", error);
      toast.error('Error While Re-Assigning the Ticket', error);
    }
  }

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
      case 'executives':
        return renderExecutivesView();
      case 'tickets':
        return renderTLTicketsView();
      case 'password-requests':
        return renderPasswordRequestsView();
      case 'user-requests':
        return renderUserRequestsView();
      default:
        return renderExecutivesView();
    }
  };

  const renderExecutivesView = () => (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">Department Executives</h2>
          <p className="text-muted">Manage executives in your department</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowUserForm(true)}
        >
          Add New Executive
        </button>
      </div>

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
                  placeholder="Search executives by name or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body p-0">
              {filteredExecutives?.length > 0 ? (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>UserName</th>
                        <th>Email</th>
                        <th>Mobile</th>
                        <th>Address</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredExecutives?.map(exec => {
                        // const execTickets = tickets.filter(t => t.createdBy === exec?.id);
                        return (
                          <>
                            {
                              // exec?.designation === 'Executive' && exec?.department === user?.department && exec?.branch === user?.branch &&
                              <tr key={exec?.id}>
                                <td>
                                  <div className="flex items-center gap-2">
                                    {/* <div className="user-avatar">{exec?.avatar}</div> */}
                                    <img src={exec?.profile ? exec?.profile : '/img/admin.png'} className='user-avatar' alt="PF" />
                                    <span>{exec?.username}</span>
                                  </div>
                                </td>
                                <td>{exec?.email}</td>
                                {/* <td>{formatDate(exec?.createdAt)}</td> */}
                                <td>{exec?.mobile}</td>
                                {/* <td>{execTickets.length}</td> */}
                                <td>{exec?.address}</td>
                                <td>
                                  <div className="flex gap-2">
                                    <button
                                      className="btn btn-sm btn-outline"
                                      onClick={() => handleEditUser(exec?._id)}
                                    >
                                      Edit
                                    </button>
                                    <button
                                      className="btn btn-sm btn-error"
                                      onClick={() => confirmDeleteUser(exec?._id)}
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
                  <p className="text-muted">No executives found. Add a new executive to get started!</p>
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
                  // onClick={handleDeleteUser}
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

  const renderTLTicketsView = () => (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">Department Tickets</h2>
          <p className="text-muted">Manage and resolve tickets in your department</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowTicketForm(true)}
        >
          Create Ticket
        </button>
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
                placeholder="Search by title or description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {showTicketForm ? (
        <div className="card mb-4 animate-slide-up">
          <div className="card-header">
            <h3>Create New Ticket</h3>
          </div>
          <div className="card-body">
            <TicketForm
              // onSubmit={handleCreateTicket}
              onCancel={() => setShowTicketForm(false)}
              fetchAllTickets={fetchAllTickets}
            />
          </div>
        </div>
      ) : (

        <div className="card">
          <div className="card-body p-0">
            {filteredTickets.length > 0 ? (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>IssuedBy</th>
                      <th>IssuedOn</th>
                      <th>Subject</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTickets?.map(ticket => {
                      // const creator = mockUsers.find(u => u.id === ticket?.createdBy);

                      return (
                        <>
                          {
                            // ticket?.department === user?.department && ticket?.branch === user?.branch &&
                            <tr key={ticket?.id}>
                              <td>{ticket?.name}</td>
                              <td>{ticket?.issuedby}</td>
                              {/* <td>{creator ? creator.name : 'Unknown'}</td> */}
                              <td>{formatDate(ticket?.date)}</td>
                              <td>{ticket?.subject}</td>
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
                                <span className={`badge ${ticket?.priority === 'high' ? 'badge-error' :
                                  ticket?.priority === 'medium' ? 'badge-warning' :
                                    'badge-primary'
                                  }`}>
                                  {ticket?.priority?.charAt(0).toUpperCase() + ticket?.priority?.slice(1)}
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
                                  <button className="btn btn-sm btn-outline" onClick={() => handleViewTicket(ticket)}>View</button>
                                </div>
                              </td>
                            </tr>
                          }
                        </>
                      );
                    })}
                  </tbody >
                </table>
              </div>
            ) : (
              <div className="p-4 text-center">
                <p className="text-muted">No tickets found with the current filters.</p>
              </div>
            )}

          </div>
        </div>
      )
      }
    </>
  );

  const renderPasswordRequestsView = () => (
    <>
      <div className="mb-4">
        <h2 className="text-xl font-bold">Password Update Requests</h2>
        <p className="text-muted">Manage password change requests from executives</p>
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
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPasswordRequests?.map((request, index) => {
                      return (
                        <>
                          {
                            <tr key={request?.id}  >
                              <td>#{index + 1}</td>
                              <td>

                                <div className="flex items-center gap-2">
                                  <img src={request?.profile ? request?.profile : '/img/admin.png'} className='user-avatar' alt="PF" />
                                  <span>{request?.username}</span>
                                </div>

                              </td>
                              <td>
                                {request?.designation}
                              </td>
                              <td>{request?.department}</td>

                              <td>
                                {/* {request?.status === 'pending' ? ( */}
                                <div className="flex gap-2">
                                  <button
                                    className="btn btn-sm btn-success"
                                    onClick={() => handleEditUser(request?._id)}
                                  >
                                    {/* Approve */}
                                    <FontAwesomeIcon icon={faEdit} />
                                  </button>
                                  <button
                                    className="btn btn-sm btn-error"
                                    onClick={() => deleteUpdateRequest(request?._id)}
                                  >
                                    <FontAwesomeIcon icon={faTrash} />
                                    {/* Reject */}
                                  </button>
                                  {/* <button className="btn btn-sm btn-outline"><FontAwesomeIcon icon={faEye} /></button> */}
                                </div>

                              </td>
                            </tr>
                          }</>
                      );
                    })}
                  </tbody >
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
        <p className="text-muted">Manage requests from executives</p>
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
                      Created: {formatDate(selectedTicket?.date)} , {selectedTicket?.time}
                    </p>
                  </div>

                  <div className="flex gap-2 mb-2">
                    <span className=''>
                      {selectedTicket?.name}
                    </span>
                    <span className=''>
                      {selectedTicket?.mobile}
                    </span>
                    <span className=''>
                      {selectedTicket?.email}
                    </span>

                  </div>
                  {
                    selectedTicket?.department?.map((curElem) => (
                      <div className="mb-4">
                        <h5 className="font-bold mb-2">{curElem?.name}</h5>
                        <p>{curElem?.description}</p>
                      </div>
                    ))
                  }


                  <div className="mb-4">
                    <h5 className="font-bold mb-2">Comments ({selectedTicket?.comments?.length})</h5>
                    {selectedTicket?.comments?.length > 0 ? (
                      <div className="space-y-3">
                        {selectedTicket?.comments?.map(comment => (
                          <div key={comment?.id} className="p-2 bg-gray-100 rounded">
                            <p className="text-sm">{comment?.content}</p>
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

                  <div className="flex gap-2 mb-2">

                    <span >ReAssign to</span>
                    <select name="" id="" className="form-select" onChange={(e) => setReAssignto(e.target.value)}>
                      <option value="" disabled selected>ReAssign the Ticket</option>
                      {
                        department?.map((curElem) => (
                          <>
                            {
                              user?.department !== curElem?.name &&
                              <option value={curElem?.name}>{curElem?.name}</option>
                            }
                          </>
                        ))
                      }
                    </select>
                    <button className="btn btn-primary"
                      onClick={reAssignTicket}
                    >
                      ReAssign
                    </button>
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

export default TeamLeaderPanel;