import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import mockUsers from '../../data/mockUsers';
import mockTickets from '../../data/mockTickets';
import mockPasswordRequests from '../../data/mockPasswordRequests';
import mockDepartments from '../../data/mockDepartments';
import { } from '@fortawesome/free-brands-svg-icons'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { faChartLine, faLock, faTicketAlt, faUserAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios';
import URI from '../../utills';
import toast from 'react-hot-toast';
// import { FaTicketAlt, FaUsers, FaLock, FaChartLine } from 'react-icons/fa';

function ManagerPanel({ user, view = 'department' }) {
  const [executives, setExecutives] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [passwordRequests, setPasswordRequests] = useState([]);
  const [department, setDepartment] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [allUsers, setAllUsers] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [allTickets, setAllTickets] = useState([]);

  const location = useLocation();

  // fetch password request 
  const getAllRequests = async () => {
    try {
      const res = await axios.get(`${URI}/superadmin/getalladminrequests`, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res=>{
        setAllRequests(res?.data?.allRequests);
        setPasswordRequests(
          res?.data?.allRequests?.filter((req) => req?.department === user?.department && req?.designation === 'Executive' && req?.branch === user?.branch)
        )
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

  //fetch users
  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(`${URI}/superadmin/getbranches`, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res=>{
        setAllUsers(res?.data?.allBranchesData);
        setExecutives(
          res?.data?.allBranchesData?.filter((ex) => ex?.department === user?.department && ex?.designation === 'Executive' && ex?.branch === user?.branch)
        )
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
      }).then(res=>{
        setAllTickets(res?.data?.data);
        setTickets(
          res?.data?.data?.filter((ticket) => ticket?.department === user?.department && ticket?.branch === user?.branch)
        )
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

  // useEffect(() => {
  //   // Get department info
  //   const userDepartment = mockDepartments.find(dept => dept.managerId === user.id);
  //   setDepartment(userDepartment);

  //   // Get executives in the department
  //   const departmentExecutives = mockUsers.filter(u =>
  //     u.role === 'executive' && u.department === user.department
  //   );
  //   setExecutives(departmentExecutives);

  //   // Get tickets in the department
  //   const departmentTickets = mockTickets.filter(ticket =>
  //     ticket?.department === user.department
  //   );
  //   setTickets(departmentTickets);

  //   // Get password requests from executives in the department
  //   const executiveIds = departmentExecutives.map(exec => exec?.id);
  //   const deptPasswordRequests = mockPasswordRequests.filter(req =>
  //     executiveIds.includes(req.userId)
  //   );
  //   setPasswordRequests(deptPasswordRequests);
  // }, [user.id, user.department]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Statistics for department overview
  const getDepartmentStats = () => {
    const totalExecutives = executives.length;
    const totalTickets = tickets?.length;
    const openTickets = tickets.filter(t => t.status === 'open').length;
    const inProgressTickets = tickets.filter(t => t.status === 'in-progress').length;
    const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;
    const pendingPasswordRequests = passwordRequests.filter(r => r.status === 'pending').length;

    return {
      totalExecutives,
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
      pendingPasswordRequests
    };
  };

  const stats = getDepartmentStats();

  // Filter executives based on search term
  const filteredExecutives = executives.filter(exec =>
    exec?.username?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    exec?.email?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
    exec?.address?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  // Filter tickets based on status and search term
  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = filterStatus === 'all' || ticket?.status === filterStatus;
    const matchesSearch = ticket?.subject?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      ticket?.issuedby?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      ticket?.date?.toLowerCase().includes(searchTerm?.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Filter password requests based on search term
  const filteredPasswordRequests = passwordRequests.filter(req => {
    // const user = mockUsers.find(u => u.id === req.userId);
    return (
      req.username?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      req.email?.toLowerCase().includes(searchTerm?.toLowerCase()) 
    )
  });

  // Render different content based on the view
  const renderContent = () => {
    switch (view) {
      case 'executives':
        return renderExecutivesView();
      case 'tickets':
        return renderTicketsView();
      case 'password-requests':
        return renderPasswordRequestsView();
      default:
        return renderDepartmentOverview();
    }
  };

  const renderDepartmentOverview = () => (
    <>
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Total Executives</h3>
            <div className="stat-card-icon blue">
              {/* <FaUsers /> user */}
              <FontAwesomeIcon icon={faUserAlt} />
            </div>
          </div>
          <div className="stat-card-value">{stats.totalExecutives}</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Total Tickets</h3>
            <div className="stat-card-icon orange">
              <FontAwesomeIcon icon={faTicketAlt} />
              {/* <FaTicketAlt />  */}
            </div>
          </div>
          <div className="stat-card-value">{stats?.totalTickets}</div>
          <div className="stat-card-change">
            <span>{stats?.openTickets} open</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Resolution Rate</h3>
            <div className="stat-card-icon green">
              <FontAwesomeIcon icon={faChartLine} />
              {/* <FaChartLine /> */}
            </div>
          </div>
          <div className="stat-card-value">
            {stats.totalTickets > 0
              ? Math.round((stats.resolvedTickets / stats.totalTickets) * 100)
              : 0}%
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <h3 className="stat-card-title">Password Requests</h3>
            <div className="stat-card-icon red">
              <FontAwesomeIcon icon={faLock} />
              {/* <FaLock /> */}
            </div>
          </div>
          <div className="stat-card-value">{stats.pendingPasswordRequests}</div>
          <div className="stat-card-change">Pending requests</div>
        </div>
      </div>

      <div className="grid grid-2 gap-4">
        <div className="card">
          <div className="card-header">
            <h3>Recent Tickets</h3>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets?.slice(0, 5).map((ticket, index) => (
                    <tr key={index + 1}>
                      <td>#{index + 1}</td>
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
                      <td>{formatDate(ticket?.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Department Executives</h3>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Address</th>
                  </tr>
                </thead>
                <tbody>
                  {executives?.slice(0, 5).map((exec, index) => (
                    <tr key={index + 1}>
                      <td>{exec?.username}</td>
                      <td>{exec?.email}</td>
                      <td>{exec?.address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const renderExecutivesView = () => (
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
        <div className="card-header">
          <h3>Department Executives</h3>
        </div>
        <div className="card-body p-0">
          {filteredExecutives?.length > 0 ? (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Tickets</th>
                    {/* <th>View</th> */}
                  </tr>
                </thead>
                <tbody>
                  {filteredExecutives?.map((exec, index) => {
                    const execTickets = allTickets.filter(t => t?.issuedby === exec?.username);
                    return (
                      <tr key={index + 1}>
                        <td>
                          <div className="flex items-center gap-2">
                            <img src={exec?.profile} alt="PF" className='user-avatar' />
                            {/* <div className="user-avatar">{exec?.avatar}</div> */}
                            <span>{exec?.username}</span>
                          </div>
                        </td>
                        <td>{exec?.email}</td>
                        {/* <td>{formatDate(exec?.createdAt)}</td> */}
                        <td>{exec?.address}</td>
                        <td>{execTickets.length}</td>
                        {/* <td>
                          <button className="btn btn-sm btn-outline">Details</button>
                        </td> */}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 text-center">
              <p className="text-muted">No executives found in your department.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );

  const renderTicketsView = () => (
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
                placeholder="Search by title or description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Department Tickets</h3>
        </div>
        <div className="card-body p-0">
          {filteredTickets.length > 0 ? (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Subject</th>
                    <th>Created By</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Created</th>
                    {/* <th>View</th> */}
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((ticket, index) => {
                    const creator = mockUsers.find(u => u.id === ticket?.createdBy);
                    return (
                      <tr key={index + 1}>
                        <td>#{index + 1}</td>
                        <td>{ticket?.subject}</td>
                        {/* <td>{creator ? creator.name : 'Unknown'}</td> */}
                        <td>{ticket?.issuedby}</td>
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
                        <td>{formatDate(ticket?.date)}</td>
                        {/* <td>
                          <button className="btn btn-sm btn-outline">View</button>
                        </td> */}
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

  const renderPasswordRequestsView = () => (
    <>
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
        <div className="card-header">
          <h3>Password Update Requests</h3>
        </div>
        <div className="card-body p-0">
          {filteredPasswordRequests?.length > 0 ? (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Email</th>

                    <th>Mobile</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPasswordRequests?.map((request, index) => {
                    // const requestUser = mockUsers.find(u => u.id === request.userId);
                    return (
                      <tr key={index + 1}>
                        <td>#{index + 1}</td>
                        <td>
                          {/* {requestUser ? ( */}
                          <div className="flex items-center gap-2">
                            <img src={request?.profile} alt="PF" className='user-avatar' />
                            {/* <div className="user-avatar">{requestUser.avatar}</div> */}
                            <span>{request?.username}</span>
                          </div>
                          {/* ) : 'Unknown User'} */}
                        </td>
                        <td>{request?.email}</td>
                        {/* <td>
                          <span className={`badge ${request.status === 'pending' ? 'badge-warning' :
                            request.status === 'approved' ? 'badge-success' :
                              'badge-error'
                            }`}>
                            {request.status?.charAt(0).toUpperCase() + request.status?.slice(1)}
                          </span>
                        </td>
                        <td>{formatDate(request.createdAt)}</td> */}
                        <td> {request?.mobile}
                          {/* <button className="btn btn-sm btn-outline">View</button> */}
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

  return (
    <div className="animate-fade">
      {department ? (
        <div className="mb-4">
          <h2 className="text-xl font-bold">
            {department?.name} Department
          </h2>
          <p className="text-muted">{department?.description}</p>
        </div>
      ) : (
        <div className="mb-4">
          <h2 className="text-xl font-bold">{user?.department} Department</h2>
        </div>
      )}

      {renderContent()}
    </div>
  );
}

export default ManagerPanel;